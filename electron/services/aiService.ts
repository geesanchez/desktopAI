import OpenAI from 'openai';
import Store from 'electron-store';
import { sanitizeInput } from '../security';

interface AppSettings {
  openaiApiKey?: string;
  model: string;
  temperature: number;
  maxTokens: number;
  systemPrompt: string;
}

interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
  timestamp: number;
}

export class AIService {
  private openai: OpenAI | null = null;
  private store: Store<AppSettings>;
  private chatHistory: ChatMessage[] = [];
  
  constructor() {
    this.store = new Store<AppSettings>({
      defaults: {
        model: 'gpt-3.5-turbo',
        temperature: 0.7,
        maxTokens: 1000,
        systemPrompt: `You are DeskMate, an intelligent desktop assistant. You help users with various tasks including:
- Answering questions and providing information
- Helping with productivity and organization
- Providing coding assistance and technical support
- Managing reminders and tasks
- System-level assistance

Be concise, helpful, and friendly. Always aim to provide actionable advice.`
      }
    });
    
    this.initializeOpenAI();
  }

  private initializeOpenAI(): void {
    const apiKey = this.store.get('openaiApiKey');
    if (apiKey) {
      this.openai = new OpenAI({
        apiKey: apiKey,
      });
    }
  }

  public async chat(message: string): Promise<string> {
    if (!this.openai) {
      throw new Error('OpenAI API key not configured. Please set your API key in settings.');
    }

    // Sanitize input for security
    const sanitizedMessage = sanitizeInput(message);
    if (!sanitizedMessage) {
      throw new Error('Invalid input message');
    }

    const settings = this.store.store;
    
    // Add user message to history
    this.chatHistory.push({
      role: 'user',
      content: sanitizedMessage,
      timestamp: Date.now()
    });

    // Keep only last 10 messages to manage context length
    if (this.chatHistory.length > 10) {
      this.chatHistory = this.chatHistory.slice(-10);
    }

    try {
      const messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
        {
          role: 'system',
          content: settings.systemPrompt
        },
        ...this.chatHistory.map(msg => ({
          role: msg.role as 'user' | 'assistant',
          content: msg.content
        }))
      ];

      const completion = await this.openai.chat.completions.create({
        model: settings.model,
        messages: messages,
        temperature: settings.temperature,
        max_tokens: settings.maxTokens,
      });

      const response = completion.choices[0]?.message?.content || 'Sorry, I could not generate a response.';

      // Add assistant response to history
      this.chatHistory.push({
        role: 'assistant',
        content: response,
        timestamp: Date.now()
      });

      return response;
    } catch (error) {
      console.error('OpenAI API error:', error);
      throw new Error(`AI service error: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  public getSettings(): AppSettings {
    return this.store.store;
  }

  public updateSettings(newSettings: Partial<AppSettings>): void {
    // Update store
    Object.keys(newSettings).forEach(key => {
      this.store.set(key as keyof AppSettings, newSettings[key as keyof AppSettings]);
    });

    // Reinitialize OpenAI if API key changed
    if (newSettings.openaiApiKey) {
      this.initializeOpenAI();
    }
  }

  public clearChatHistory(): void {
    this.chatHistory = [];
  }

  public getChatHistory(): ChatMessage[] {
    return this.chatHistory;
  }

  public async generateQuickResponse(prompt: string): Promise<string> {
    if (!this.openai) {
      throw new Error('OpenAI API key not configured.');
    }

    try {
      const completion = await this.openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'Provide a very brief, helpful response (1-2 sentences maximum).'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.5,
        max_tokens: 100,
      });

      return completion.choices[0]?.message?.content || 'No response available.';
    } catch (error) {
      console.error('Quick response error:', error);
      throw new Error(`Quick response error: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
} 