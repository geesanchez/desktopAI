import { app, BrowserWindow, ipcMain, Tray, Menu, nativeImage, globalShortcut, Notification } from 'electron';
import * as path from 'path';
import { isDev } from './utils';
import { AIService } from './services/aiService';
import { VoiceService } from './services/voiceService';
import { setupSecurity, validateURL } from './security';

class DeskMateApp {
  private mainWindow: BrowserWindow | null = null;
  private tray: Tray | null = null;
  private aiService: AIService;
  private voiceService: VoiceService;

  constructor() {
    this.aiService = new AIService();
    this.voiceService = new VoiceService();
  }

  private createWindow(): void {
    // Create the browser window
    this.mainWindow = new BrowserWindow({
      height: 800,
      width: 1200,
      minHeight: 600,
      minWidth: 800,
      webPreferences: {
        nodeIntegration: false,
        contextIsolation: true,
        preload: path.join(__dirname, 'preload.js'),
        webSecurity: true,
        allowRunningInsecureContent: false,
        experimentalFeatures: false,
      },
      titleBarStyle: 'hiddenInset',
      show: false,
      icon: path.join(__dirname, '../assets/icon.png'),
    });

    // Load the React app
    const startUrl = isDev 
      ? 'http://localhost:3000' 
      : `file://${path.join(__dirname, '../build/index.html')}`;
    
    console.log('isDev:', isDev);
    console.log('Loading URL:', startUrl);
    
    // Validate URL before loading
    if (validateURL(startUrl)) {
      this.mainWindow.loadURL(startUrl);
    } else {
      console.error('Invalid URL blocked for security:', startUrl);
    }

    // Show window when ready to prevent visual flash
    this.mainWindow.once('ready-to-show', () => {
      this.mainWindow?.show();
    });

    // Open DevTools in development
    if (isDev) {
      this.mainWindow.webContents.openDevTools();
    }

    // Handle window closed
    this.mainWindow.on('closed', () => {
      this.mainWindow = null;
    });

    // Handle window minimize to tray
    this.mainWindow.on('minimize', (event: Electron.Event) => {
      event.preventDefault();
      this.mainWindow?.hide();
    });
  }

  private createTray(): void {
    const iconPath = path.join(__dirname, '../assets/tray-icon.png');
    const trayIcon = nativeImage.createFromPath(iconPath);
    
    this.tray = new Tray(trayIcon.resize({ width: 16, height: 16 }));
    
    const contextMenu = Menu.buildFromTemplate([
      {
        label: 'Show DeskMate',
        click: () => {
          this.mainWindow?.show();
        }
      },
      {
        label: 'Voice Command',
        click: () => {
          this.handleVoiceCommand();
        }
      },
      { type: 'separator' },
      {
        label: 'Quit',
        click: () => {
          app.quit();
        }
      }
    ]);

    this.tray.setToolTip('DeskMate AI Assistant');
    this.tray.setContextMenu(contextMenu);

    // Show window on tray click
    this.tray.on('click', () => {
      this.mainWindow?.show();
    });
  }

  private setupGlobalShortcuts(): void {
    // Global shortcut for voice command
    globalShortcut.register('CommandOrControl+Shift+Space', () => {
      this.handleVoiceCommand();
    });

    // Global shortcut to show/hide main window
    globalShortcut.register('CommandOrControl+Shift+D', () => {
      if (this.mainWindow?.isVisible()) {
        this.mainWindow.hide();
      } else {
        this.mainWindow?.show();
      }
    });
  }

  private setupIPC(): void {
    // Handle AI chat requests
    ipcMain.handle('ai-chat', async (event, message: string) => {
      try {
        const response = await this.aiService.chat(message);
        return { success: true, data: response };
      } catch (error) {
        console.error('AI chat error:', error);
        return { success: false, error: error instanceof Error ? error.message : String(error) };
      }
    });

    // Handle voice recognition (button click)
    ipcMain.handle('start-voice-recognition', async (event) => {
      try {
        console.log('🔘 Voice recognition button clicked - starting voice command...');
        
        const voiceText = await this.voiceService.startListening();
        console.log('🔘 Voice text from button click:', voiceText);
        
        if (voiceText) {
          // Generate AI response
          let aiResponse: string;
          try {
            aiResponse = await this.aiService.chat(voiceText);
          } catch (error) {
            // Fallback response if AI service fails
            aiResponse = this.generateDemoResponse(voiceText);
          }
          
          console.log('🔘 AI response for button click:', aiResponse);
          
          // Send voice command result to renderer (same as global shortcut)
          const payload = {
            input: voiceText,
            response: aiResponse
          };
          
          console.log('🔘 Sending voice command result from button click:', payload);
          this.mainWindow?.webContents.send('voice-command-result', payload);
          
          return { success: true, data: voiceText };
        } else {
          // No voice detected
          this.mainWindow?.webContents.send('voice-command-result', {
            input: 'No voice detected',
            response: 'Sorry, I didn\'t hear anything. Please try again.'
          });
          
          return { success: false, error: 'No voice detected' };
        }
      } catch (error) {
        console.error('🔘 Voice recognition button error:', error);
        
        // Send error to chat interface
        this.mainWindow?.webContents.send('voice-command-result', {
          input: 'Voice command failed',
          response: 'Sorry, there was an error processing your voice command.'
        });
        
        return { success: false, error: error instanceof Error ? error.message : String(error) };
      }
    });

    // Handle system notifications
    ipcMain.handle('show-notification', (event, title: string, body: string) => {
      new Notification({
        title,
        body,
        icon: path.join(__dirname, '../assets/icon.png')
      }).show();
    });

    // Handle app settings
    ipcMain.handle('get-app-settings', () => {
      return this.aiService.getSettings();
    });

    ipcMain.handle('update-app-settings', (event, settings) => {
      this.aiService.updateSettings(settings);
    });
  }

  private async handleVoiceCommand(): Promise<void> {
    try {
      console.log('🎤 Starting voice command...');
      
      // Make sure main window exists and is ready
      if (!this.mainWindow || this.mainWindow.isDestroyed()) {
        console.error('Main window not available for voice command');
        return;
      }

      const voiceText = await this.voiceService.startListening();
      console.log('🎤 Voice text received:', voiceText);
      
      if (voiceText) {
        // For demo purposes, create a simulated AI response since API key might not be configured
        let aiResponse: string;
        try {
          aiResponse = await this.aiService.chat(voiceText);
        } catch (error) {
          // Fallback response if AI service fails (no API key configured)
          aiResponse = this.generateDemoResponse(voiceText);
        }
        
        console.log('🤖 AI response generated:', aiResponse);
        
        // Send voice command result to renderer with detailed logging
        const payload = {
          input: voiceText,
          response: aiResponse
        };
        
        console.log('📤 Sending voice command result to renderer:', payload);
        this.mainWindow.webContents.send('voice-command-result', payload);

        // Verify the message was sent
        console.log('✅ Voice command result sent to renderer process');

        // Show notification
        new Notification({
          title: 'DeskMate AI - Voice Command',
          body: `"${voiceText}" processed successfully`,
          icon: path.join(__dirname, '../assets/icon.png')
        }).show();
        
      } else {
        console.log('❌ No voice text received');
        this.mainWindow.webContents.send('voice-command-result', {
          input: 'No voice detected',
          response: 'Sorry, I didn\'t hear anything. Please try again.'
        });
      }
    } catch (error) {
      console.error('❌ Voice command error:', error);
      
      // Send error to renderer if window exists
      if (this.mainWindow && !this.mainWindow.isDestroyed()) {
        this.mainWindow.webContents.send('voice-command-result', {
          input: 'Voice command failed',
          response: 'Sorry, there was an error processing your voice command.'
        });
      }
    }
  }

  private generateDemoResponse(input: string): string {
    const responses: Record<string, string> = {
      "what's the weather today": "I'm a demo assistant, so I can't check real weather. But I'd be happy to help with other tasks!",
      "help me with my coding project": "I'd love to help with coding! You can ask me about JavaScript, TypeScript, React, or Electron development.",
      "set a reminder for 3 pm": "Reminder feature coming soon! For now, you might want to use your system calendar.",
      "tell me a joke": "Why do programmers prefer dark mode? Because light attracts bugs! 🐛",
      "what's the current time": `The current time is ${new Date().toLocaleTimeString()}.`,
      "open my email": "I can't open applications yet, but that's a great feature for the next version!",
      "schedule a meeting": "Meeting scheduling would integrate with your calendar app in a full version.",
      "summarize my tasks": "I don't have access to your tasks yet, but I could help organize them if you share them with me!"
    };

    const lowerInput = input.toLowerCase();
    for (const [key, response] of Object.entries(responses)) {
      if (lowerInput.includes(key.toLowerCase())) {
        return response;
      }
    }

    return `I heard you say: "${input}". This is a demo version, but in a full implementation, I'd provide a helpful response to your request!`;
  }

  public async initialize(): Promise<void> {
    // Wait for app to be ready
    await app.whenReady();

    // Setup security policies
    setupSecurity();

    // Create main window and tray
    this.createWindow();
    this.createTray();
    this.setupGlobalShortcuts();
    this.setupIPC();

    // Handle app activation (macOS)
    app.on('activate', () => {
      if (BrowserWindow.getAllWindows().length === 0) {
        this.createWindow();
      }
    });

    // Handle all windows closed
    app.on('window-all-closed', () => {
      if (process.platform !== 'darwin') {
        app.quit();
      }
    });

    // Cleanup on quit
    app.on('will-quit', () => {
      globalShortcut.unregisterAll();
    });
  }
}

// Create and initialize the app
const deskMateApp = new DeskMateApp();
deskMateApp.initialize().catch(console.error); 