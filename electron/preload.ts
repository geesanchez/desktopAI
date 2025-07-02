import { contextBridge, ipcRenderer } from 'electron';

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electronAPI', {
  // AI chat functionality
  aiChat: (message: string) => ipcRenderer.invoke('ai-chat', message),
  
  // Voice recognition
  startVoiceRecognition: () => ipcRenderer.invoke('start-voice-recognition'),
  
  // System notifications
  showNotification: (title: string, body: string) => 
    ipcRenderer.invoke('show-notification', title, body),
  
  // App settings
  getAppSettings: () => ipcRenderer.invoke('get-app-settings'),
  updateAppSettings: (settings: any) => ipcRenderer.invoke('update-app-settings', settings),
  
  // Event listeners
  onVoiceCommandResult: (callback: (data: any) => void) => {
    ipcRenderer.on('voice-command-result', (event, data) => callback(data));
  },
  
  // Remove listeners
  removeAllListeners: (channel: string) => {
    ipcRenderer.removeAllListeners(channel);
  }
});

// Type definitions for the exposed API
declare global {
  interface Window {
    electronAPI: {
      aiChat: (message: string) => Promise<{ success: boolean; data?: any; error?: string }>;
      startVoiceRecognition: () => Promise<{ success: boolean; data?: string; error?: string }>;
      showNotification: (title: string, body: string) => Promise<void>;
      getAppSettings: () => Promise<any>;
      updateAppSettings: (settings: any) => Promise<void>;
      onVoiceCommandResult: (callback: (data: any) => void) => void;
      removeAllListeners: (channel: string) => void;
    };
  }
} 