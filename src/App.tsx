import React, { useState, useEffect } from 'react';
import './App.css';
import ChatInterface from './components/ChatInterface';
import SettingsPanel from './components/SettingsPanel';
import VoiceIndicator from './components/VoiceIndicator';
import StatusBar from './components/StatusBar';

type View = 'chat' | 'settings';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>('chat');
  const [isVoiceListening, setIsVoiceListening] = useState(false);
  const [settings, setSettings] = useState<any>(null);
  const [isWebDemo, setIsWebDemo] = useState(false);

  useEffect(() => {
    // Detect if running in web demo mode
    const webDemo = !window.electronAPI;
    setIsWebDemo(webDemo);

    // Load initial settings (Electron only)
    if (!webDemo) {
      loadSettings();

      // Listen for voice command results
      if (window.electronAPI) {
        window.electronAPI.onVoiceCommandResult((data) => {
          console.log('Voice command result:', data);
          // The ChatInterface will handle displaying this
        });
      }
    }

    // Cleanup listeners on unmount
    return () => {
      if (!webDemo && window.electronAPI) {
        window.electronAPI.removeAllListeners('voice-command-result');
      }
    };
  }, []);

  const loadSettings = async () => {
    if (window.electronAPI) {
      try {
        const appSettings = await window.electronAPI.getAppSettings();
        setSettings(appSettings);
      } catch (error) {
        console.error('Failed to load settings:', error);
      }
    }
  };

  const handleVoiceCommand = async () => {
    if (!window.electronAPI || isVoiceListening) return;

    console.log('Voice command button clicked');
    setIsVoiceListening(true);
    
    try {
      const result = await window.electronAPI.startVoiceRecognition();
      if (result.success) {
        console.log('Voice recognition result:', result.data);
        // Show success notification
        window.electronAPI.showNotification(
          'Voice Command',
          'Voice command processed successfully!'
        );
      } else {
        console.error('Voice recognition failed:', result.error);
        // Show error notification
        window.electronAPI.showNotification(
          'Voice Command Error',
          result.error || 'Voice recognition failed'
        );
      }
    } catch (error) {
      console.error('Voice command error:', error);
      // Show error notification
      if (window.electronAPI) {
        window.electronAPI.showNotification(
          'Voice Command Error',
          'Failed to start voice recognition'
        );
      }
    } finally {
      setIsVoiceListening(false);
    }
  };

  const handleSettingsUpdate = async (newSettings: any) => {
    if (window.electronAPI) {
      try {
        await window.electronAPI.updateAppSettings(newSettings);
        setSettings({ ...settings, ...newSettings });
        
        // Show success notification
        window.electronAPI.showNotification(
          'Settings Updated',
          'Your preferences have been saved successfully.'
        );
      } catch (error) {
        console.error('Failed to update settings:', error);
      }
    }
  };

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-left">
          <h1 className="app-title">
            <span className="logo">🤖</span>
            DeskMate AI
            {isWebDemo && <span style={{ fontSize: '0.7rem', color: '#667eea', marginLeft: '0.5rem' }}>Web Demo</span>}
          </h1>
        </div>
        
        <nav className="nav-tabs">
          <button 
            className={`nav-tab ${currentView === 'chat' ? 'active' : ''}`}
            onClick={() => setCurrentView('chat')}
          >
            💬 Chat
          </button>
          <button 
            className={`nav-tab ${currentView === 'settings' ? 'active' : ''}`}
            onClick={() => setCurrentView('settings')}
          >
            ⚙️ Settings
          </button>
        </nav>

        <div className="header-right">
          {/* Only show voice indicator in Electron app, not web demo */}
          {!isWebDemo && (
            <VoiceIndicator 
              isListening={isVoiceListening}
              onVoiceCommand={handleVoiceCommand}
            />
          )}
          
          {/* Show web demo indicator instead */}
          {isWebDemo && (
            <div style={{ 
              fontSize: '0.8rem', 
              color: '#667eea', 
              fontWeight: '500',
              padding: '0.5rem 1rem',
              background: 'rgba(102, 126, 234, 0.1)',
              borderRadius: '20px'
            }}>
              🌐 Web Preview
            </div>
          )}
        </div>
      </header>

      <main className="app-content">
        {currentView === 'chat' && (
          <ChatInterface />
        )}
        {currentView === 'settings' && (
          <SettingsPanel 
            settings={settings}
            onSettingsUpdate={handleSettingsUpdate}
          />
        )}
      </main>

      <StatusBar 
        isConnected={!isWebDemo && !!settings?.openaiApiKey}
        model={isWebDemo ? 'Web Demo Mode' : settings?.model}
      />
    </div>
  );
};

export default App; 