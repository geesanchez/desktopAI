// Global type declarations for Electron API
declare global {
  interface Window {
    electronAPI?: {
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

export {}; 