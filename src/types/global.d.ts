// Global type definitions for DeskMate AI

interface ElectronAPI {
  // AI chat functionality
  aiChat: (message: string) => Promise<{
    success: boolean;
    data?: string;
    error?: string;
  }>;
  
  // Voice recognition
  startVoiceRecognition: () => Promise<{
    success: boolean;
    data?: string;
    error?: string;
  }>;
  
  // System notifications
  showNotification: (title: string, body: string) => Promise<void>;
  
  // App settings
  getAppSettings: () => Promise<AppSettings>;
  updateAppSettings: (settings: Partial<AppSettings>) => Promise<void>;
  
  // Event listeners
  onVoiceCommandResult: (callback: (data: VoiceCommandResult) => void) => void;
  
  // Utility
  removeAllListeners: (channel: string) => void;
}

interface AppSettings {
  openaiApiKey?: string;
  model: string;
  temperature: number;
  maxTokens: number;
  systemPrompt: string;
}

interface VoiceCommandResult {
  input: string;
  response: string;
}

interface Window {
  electronAPI?: ElectronAPI;
}

// Message types for chat interface
interface ChatMessage {
  id: string;
  type: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
}

// Component prop types
interface ComponentProps {
  className?: string;
  children?: React.ReactNode;
}

// Theme types
type ThemeMode = 'light' | 'dark' | 'auto';

interface ThemeSettings {
  mode: ThemeMode;
  primaryColor: string;
  accentColor: string;
}

// Voice recognition types
interface VoiceRecognitionOptions {
  language: string;
  continuous: boolean;
  interimResults: boolean;
  maxAlternatives: number;
}

// AI service types
interface AIServiceConfig {
  apiKey: string;
  model: string;
  temperature: number;
  maxTokens: number;
  systemPrompt: string;
}

interface AIResponse {
  content: string;
  finishReason: string;
  usage: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
}

// System integration types
interface SystemNotification {
  title: string;
  body: string;
  icon?: string;
  silent?: boolean;
  urgency?: 'low' | 'normal' | 'critical';
}

interface GlobalShortcut {
  accelerator: string;
  callback: () => void;
  description: string;
}

// Error types
interface AppError {
  code: string;
  message: string;
  details?: any;
  timestamp: Date;
}

// Performance monitoring
interface PerformanceMetrics {
  memoryUsage: NodeJS.MemoryUsage;
  cpuUsage: NodeJS.CpuUsage;
  responseTime: number;
  timestamp: Date;
}

// Settings persistence
interface SettingsStorage {
  get<T>(key: string): T;
  set<T>(key: string, value: T): void;
  delete(key: string): void;
  clear(): void;
}

// Export types for use in other files
export {
  ElectronAPI,
  AppSettings,
  VoiceCommandResult,
  ChatMessage,
  ComponentProps,
  ThemeMode,
  ThemeSettings,
  VoiceRecognitionOptions,
  AIServiceConfig,
  AIResponse,
  SystemNotification,
  GlobalShortcut,
  AppError,
  PerformanceMetrics,
  SettingsStorage
}; 