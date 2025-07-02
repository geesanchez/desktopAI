import React, { useState, useEffect, useRef } from 'react';

interface Message {
  id: string;
  type: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
}

const ChatInterface: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isWebDemo, setIsWebDemo] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const welcomeAddedRef = useRef(false);

  useEffect(() => {
    // Detect if running in web demo mode (no Electron APIs)
    const webDemo = !window.electronAPI;
    setIsWebDemo(webDemo);

    // Add welcome message only once
    if (!welcomeAddedRef.current) {
      if (webDemo) {
        addSystemMessage('🌐 Welcome to DeskMate AI Web Demo! This showcases the UI/UX design. For full functionality including voice commands and AI integration, download the desktop app.');
      } else {
        addSystemMessage('Welcome to DeskMate AI! I\'m here to help you with various tasks. Try asking me a question or use the voice command button (🎤) in the header.');
      }
      welcomeAddedRef.current = true;
    }

    // Listen for voice command results (Electron only)
    if (!webDemo) {
      console.log('🔗 Setting up voice command listener in ChatInterface');
      
      if (window.electronAPI) {
        console.log('✅ electronAPI available, registering voice command listener');
        
        // Set up the voice command result listener
        window.electronAPI.onVoiceCommandResult((data: any) => {
          console.log('🎯 Voice command IPC message received:', data);
          handleVoiceCommandResult(data);
        });
        
        console.log('✅ Voice command listener registered successfully');
      } else {
        console.warn('⚠️ electronAPI not available in ChatInterface');
      }
    }

    return () => {
      if (!webDemo) {
        console.log('🧹 Cleaning up voice command listeners');
        if (window.electronAPI) {
          window.electronAPI.removeAllListeners('voice-command-result');
        }
      }
    };
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const addMessage = (type: Message['type'], content: string) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      type,
      content,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, newMessage]);
    return newMessage;
  };

  const addSystemMessage = (content: string) => {
    addMessage('system', content);
  };

  const handleVoiceCommandResult = (data: { input: string; response: string }) => {
    console.log('📥 Voice command result received in React:', data);
    console.log('📥 Adding user message:', `🎤 ${data.input}`);
    console.log('📥 Adding assistant response:', data.response);
    
    // Add the voice input as a user message with a microphone emoji
    addMessage('user', `🎤 ${data.input}`);
    
    // Add the AI response
    addMessage('assistant', data.response);
    
    console.log('✅ Voice command messages added to chat');
  };

  // Simulated AI responses for web demo
  const generateDemoResponse = (input: string): string => {
    const responses: Record<string, string> = {
      "hello": "Hello! I'm DeskMate AI. In the full desktop version, I'd be powered by OpenAI's API for intelligent responses.",
      "what can you do": "In the desktop app, I can help with coding, answer questions, set reminders, and respond to voice commands. This web demo shows the interface design!",
      "voice command": "Voice commands work in the desktop version! You can use the microphone button or press Cmd+Shift+Space for hands-free interaction.",
      "features": "Key features include: AI chat, voice commands, system tray integration, global shortcuts, and cross-platform support. Download the desktop app to try them all!",
      "help": "This is a web demo showcasing the UI design. For full functionality including OpenAI integration, voice commands, and system features, please download the desktop application.",
      "demo": "You're currently viewing the web demo! The desktop version includes voice recognition, AI responses, system notifications, and global shortcuts.",
      "portfolio": "This project demonstrates modern web technologies: React, TypeScript, Electron, AI integration, and responsive design. Perfect for showcasing full-stack development skills!",
      "download": "You can download the desktop version from the GitHub releases page. It's available for macOS, Windows, and Linux!",
      "technology": "Built with React + TypeScript + Electron + OpenAI API. Features include voice recognition, system tray integration, global shortcuts, and secure IPC communication.",
      "developer": "This project showcases skills in desktop app development, modern frontend frameworks, AI integration, and cross-platform deployment."
    };

    const lowerInput = input.toLowerCase();
    for (const [key, response] of Object.entries(responses)) {
      if (lowerInput.includes(key)) {
        return response;
      }
    }

    if (lowerInput.includes('time')) {
      return `The current time is ${new Date().toLocaleTimeString()}. In the desktop version, I'd also have access to system APIs for more functionality!`;
    }

    return `Thanks for trying the web demo! You said: "${input}". In the full desktop version, I'd provide intelligent AI responses using OpenAI's API. This demo showcases the clean, modern interface design.`;
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage = inputValue.trim();
    setInputValue('');
    setIsLoading(true);

    // Add user message
    addMessage('user', userMessage);

    try {
      if (window.electronAPI && !isWebDemo) {
        // Electron version - use real AI API
        const result = await window.electronAPI.aiChat(userMessage);
        
        if (result.success) {
          addMessage('assistant', result.data);
        } else {
          addMessage('system', `Error: ${result.error}`);
        }
      } else {
        // Web demo version - simulate AI response
        setTimeout(() => {
          const demoResponse = generateDemoResponse(userMessage);
          addMessage('assistant', demoResponse);
        }, 1000 + Math.random() * 2000); // Realistic delay
      }
    } catch (error) {
      console.error('Chat error:', error);
      if (isWebDemo) {
        addMessage('system', 'This is a web demo. For full AI functionality, download the desktop app!');
      } else {
        addMessage('system', 'Failed to send message. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const handleClearChat = () => {
    setMessages([]);
    welcomeAddedRef.current = false;
    if (isWebDemo) {
      addSystemMessage('🌐 Chat cleared! This web demo showcases the DeskMate AI interface. Try asking about features, technology, or the desktop version.');
    } else {
      addSystemMessage('Chat cleared. How can I help you today?');
    }
  };

  // Demo voice command for web version
  const simulateVoiceCommand = () => {
    if (isWebDemo) {
      const demoCommands = [
        "What's the current time?",
        "Tell me about this project",
        "What features are available?",
        "How do I download the desktop version?",
        "What technologies were used?"
      ];
      
      const randomCommand = demoCommands[Math.floor(Math.random() * demoCommands.length)];
      
      // Simulate voice input
      addMessage('user', `🎤 ${randomCommand}`);
      
      // Generate response
      setTimeout(() => {
        const response = generateDemoResponse(randomCommand);
        addMessage('assistant', response);
      }, 1500);
    }
  };

  return (
    <div className="chat-interface">
      <div className="chat-header">
        {isWebDemo && (
          <div className="demo-banner">
            <span>🌐 Web Demo</span>
            <a 
              href="https://github.com/geesanchez/desktopAI/releases" 
              target="_blank" 
              rel="noopener noreferrer"
              className="download-link"
            >
              📥 Download Desktop App
            </a>
          </div>
        )}
        
        <div className="chat-actions">
          <button
            onClick={handleClearChat}
            className="clear-button"
            title="Clear chat history"
          >
            🗑️ Clear
          </button>
          
          {isWebDemo && (
            <button
              onClick={simulateVoiceCommand}
              className="demo-voice-button"
              title="Simulate voice command (desktop app has real voice recognition)"
            >
              🎤 Demo Voice
            </button>
          )}
          
          <span className="message-count">
            {messages.filter(m => m.type !== 'system').length} messages
          </span>
        </div>
      </div>

      <div className="chat-messages">
        {messages.map((message) => (
          <div key={message.id} className={`message ${message.type}`}>
            <div className="message-content">
              {message.content}
            </div>
            <div className="message-time">
              {formatTime(message.timestamp)}
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="message assistant">
            <div className="message-content">
              <div className="loading"></div>
              <span style={{ marginLeft: '0.5rem' }}>
                {isWebDemo ? 'Generating demo response...' : 'Thinking...'}
              </span>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      <div className="chat-input-area">
        <div className="chat-input-container">
          <textarea
            ref={inputRef}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={
              isWebDemo 
                ? "Try asking: 'What features are available?' or 'Tell me about this project'..." 
                : "Type your message here... (Shift+Enter for new line)"
            }
            className="chat-input"
            disabled={isLoading}
          />
          <button
            onClick={handleSendMessage}
            disabled={!inputValue.trim() || isLoading}
            className="send-button"
          >
            {isLoading ? <div className="loading"></div> : '➤'} Send
          </button>
        </div>
        
        <div className="input-help">
          {isWebDemo ? (
            <span>💡 This is a web demo. Download the desktop app for voice commands and AI integration!</span>
          ) : (
            <span>💡 Tip: Use Cmd+Shift+Space for voice commands, Cmd+Shift+D to toggle window</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatInterface; 