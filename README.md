# DeskMate AI - Intelligent Desktop Assistant

![DeskMate AI](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white) ![Electron](https://img.shields.io/badge/Electron-191970?style=for-the-badge&logo=Electron&logoColor=white) ![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB) ![OpenAI](https://img.shields.io/badge/OpenAI-412991?style=for-the-badge&logo=openai&logoColor=white)

[![🌐 Live Demo](https://img.shields.io/badge/🌐_Live_Demo-Try_Now-blue?style=for-the-badge)](https://deskmate-ai-demo-at17ev176-sanchez27gs-2764s-projects.vercel.app)
[![📥 Download](https://img.shields.io/badge/📥_Download-Desktop_App-green?style=for-the-badge)](https://github.com/geesanchez/desktopAI/releases)
[![⭐ Star](https://img.shields.io/badge/⭐_Star-Repository-yellow?style=for-the-badge)](https://github.com/geesanchez/desktopAI)

An intelligent desktop assistant built with **Electron**, **React**, and **TypeScript**, featuring AI-powered chat, voice commands, and system tray integration. This project demonstrates modern desktop application development with cutting-edge AI integration.

> **🎯 Portfolio Project:** Perfect demonstration of full-stack desktop development skills for modern tech companies.

## 🌟 Features

### Core Functionality
- **🤖 AI Chat Interface** - Powered by OpenAI GPT models (3.5-turbo, GPT-4)
- **🎤 Voice Commands** - Real-time speech recognition with global shortcuts
- **⚙️ System Tray Integration** - Minimize to tray with quick access menu
- **🔧 Customizable Settings** - Configurable AI models, temperature, and system prompts
- **💬 Modern UI** - Sleek, responsive design with gradient themes
- **⌨️ Global Shortcuts** - `Cmd+Shift+Space` for voice, `Cmd+Shift+D` to toggle window

### Technical Features
- **Cross-platform** - Works on macOS, Windows, and Linux
- **TypeScript** - Fully typed codebase for better development experience
- **Secure IPC** - Context isolation with secure inter-process communication
- **Performance Optimized** - Efficient memory management and startup time
- **Persistent Settings** - Encrypted storage using electron-store

## 🛠️ Technology Stack

### Frontend
- **React 18** - Modern component-based UI
- **TypeScript** - Type-safe development
- **CSS3** - Modern styling with gradients and animations

### Backend/Desktop
- **Electron** - Cross-platform desktop framework
- **Node.js** - Runtime environment
- **OpenAI API** - AI chat capabilities

### Development Tools
- **ESLint** - Code linting and formatting
- **Electron Builder** - Application packaging and distribution
- **Concurrently** - Development server management

## 🚀 Getting Started

### Prerequisites
- **Node.js** (v16 or higher)
- **npm** or **yarn**
- **OpenAI API Key** ([Get one here](https://platform.openai.com/api-keys))

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/deskmate-ai.git
   cd deskmate-ai
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Configure OpenAI API Key**
   - Open the application
   - Navigate to Settings tab
   - Enter your OpenAI API key
   - Save settings

### Building for Production

```bash
# Build React app and Electron main process
npm run build

# Create distributable packages
npm run dist
```

This will create installation packages in the `release/` directory for your platform.

## 📱 Usage

### Basic Chat
1. Open DeskMate AI
2. Type your message in the chat interface
3. Press Enter or click Send
4. The AI will respond based on your configured model and settings

### Voice Commands
1. Click the 🎤 button in the header, or
2. Use the global shortcut `Cmd+Shift+Space` (macOS) / `Ctrl+Shift+Space` (Windows/Linux)
3. Speak your command clearly
4. The AI will process and respond to your voice input

### Global Shortcuts
- **`Cmd+Shift+Space`** - Activate voice command
- **`Cmd+Shift+D`** - Show/hide main window

## ⚙️ Configuration

### AI Model Settings
- **Model Selection** - Choose between GPT-3.5 Turbo, GPT-4, or GPT-4 Turbo
- **Temperature** - Control response creativity (0-2)
- **Max Tokens** - Set maximum response length
- **System Prompt** - Customize AI behavior and personality

### Keyboard Shortcuts
All shortcuts are configurable and work globally (even when the app is minimized).

## 🐳 Docker Deployment

For server deployment or containerized environments:

```bash
# Build Docker image
docker build -t deskmate-ai .

# Run container
docker run -p 3000:3000 deskmate-ai
```

## 🏗️ Project Structure

```
deskmate-ai/
├── electron/           # Electron main process
│   ├── main.ts        # Main application entry
│   ├── preload.ts     # Secure IPC bridge
│   ├── utils.ts       # Utility functions
│   └── services/      # Backend services
│       ├── aiService.ts      # OpenAI integration
│       └── voiceService.ts   # Voice recognition
├── src/               # React frontend
│   ├── components/    # React components
│   ├── App.tsx       # Main app component
│   └── index.tsx     # React entry point
├── build/            # React build output
├── dist/             # Electron build output
└── release/          # Distribution packages
```

## 🔒 Security Features

- **Context Isolation** - Secure separation between main and renderer processes
- **API Key Encryption** - Secure storage of sensitive credentials
- **Input Sanitization** - Protection against XSS and injection attacks
- **Sandboxed Renderer** - Isolated rendering process for security

## 🎯 Portfolio Highlights

This project demonstrates proficiency in:

- **Modern JavaScript/TypeScript** - ES6+, async/await, modern React hooks
- **Desktop Application Development** - Electron with secure IPC patterns
- **AI Integration** - OpenAI API, prompt engineering, conversation management
- **UI/UX Design** - Modern, responsive interface with smooth animations
- **Performance Optimization** - Efficient rendering and memory management
- **Cross-platform Development** - macOS, Windows, and Linux compatibility
- **DevOps** - Build automation, containerization, CI/CD ready

## 🚀 Performance Metrics

- **Startup Time** - < 3 seconds on modern hardware
- **Memory Usage** - ~150MB baseline, scales with conversation history
- **Response Time** - Dependent on OpenAI API (typically 1-3 seconds)
- **Bundle Size** - ~200MB (includes Electron runtime and dependencies)

## 🔮 Future Enhancements

- [ ] **Plugin System** - Extensible architecture for custom integrations
- [ ] **Multiple AI Providers** - Support for Anthropic Claude, Google Bard
- [ ] **Advanced Voice** - Speech synthesis for AI responses
- [ ] **File Operations** - Drag-and-drop file analysis
- [ ] **Scheduling Integration** - Calendar and reminder management
- [ ] **Team Collaboration** - Shared workspaces and conversations

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 About the Developer

Built by **Gabriel Sanchez** ([@geesanchez](https://github.com/geesanchez)) as a portfolio project demonstrating modern desktop application development with AI integration. This project showcases skills relevant to companies like Cluely, focusing on:

- AI-powered desktop assistants
- Real-time user interfaces
- Cross-platform development
- Performance optimization
- Modern development practices

**Contact:** [sanchez27.gs@gmail.com](mailto:sanchez27.gs@gmail.com)

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📞 Support

For questions or support, please open an issue on GitHub or contact [sanchez27.gs@gmail.com](mailto:sanchez27.gs@gmail.com).

---

**⚡ Built for the future of human-computer interaction** 