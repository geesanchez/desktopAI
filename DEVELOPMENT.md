# DeskMate AI - Development Guide

This guide provides detailed information for developers working on DeskMate AI, including setup, architecture, and contribution guidelines.

## 🏗️ Architecture Overview

### High-Level Architecture
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   React Frontend │    │  Electron Main  │    │   External APIs │
│                 │    │     Process     │    │                 │
│  - Components   │◄──►│  - IPC Handler  │◄──►│   - OpenAI API  │
│  - State Mgmt   │    │  - AI Service   │    │   - Voice APIs  │
│  - UI/UX        │    │  - Voice Service│    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### Process Communication
- **Secure IPC**: Context-isolated communication between renderer and main processes
- **Event-driven**: Asynchronous message passing for real-time features
- **Type-safe**: Full TypeScript coverage for all IPC channels

### Key Design Patterns
1. **Service Layer**: Abstracted AI and voice services
2. **Component Composition**: Reusable React components
3. **State Management**: React hooks with local state
4. **Error Boundaries**: Graceful error handling
5. **Performance Optimization**: Lazy loading and memoization

## 🛠️ Development Setup

### Prerequisites
```bash
# Node.js 18+ (recommended: use nvm)
nvm install 18
nvm use 18

# Package manager
npm install -g npm@latest

# Optional: Development tools
npm install -g @electron/rebuild
npm install -g electron-builder
```

### Initial Setup
```bash
# Clone repository
git clone <repository-url>
cd deskmate-ai

# Install dependencies
npm install

# Copy environment template
cp .env.example .env

# Start development server
npm run dev
```

### Development Scripts
```bash
# Development
npm run dev              # Start both React and Electron in development
npm run start:react      # Start only React development server
npm run start:electron   # Start only Electron (requires React server)

# Building
npm run build           # Build both React and Electron
npm run build:react     # Build React for production
npm run build:electron  # Compile TypeScript for Electron

# Testing
npm test               # Run React tests
npm run typecheck      # TypeScript type checking
npm run lint           # ESLint code linting

# Distribution
npm run dist           # Create distributable packages
```

## 🏛️ Project Structure

```
deskmate-ai/
├── 📁 electron/                 # Electron main process
│   ├── 📄 main.ts              # Application entry point
│   ├── 📄 preload.ts           # Secure IPC bridge
│   ├── 📄 utils.ts             # Utility functions
│   └── 📁 services/            # Backend services
│       ├── 📄 aiService.ts     # OpenAI integration
│       └── 📄 voiceService.ts  # Voice recognition
├── 📁 src/                     # React frontend
│   ├── 📁 components/          # React components
│   │   ├── 📄 ChatInterface.tsx
│   │   ├── 📄 SettingsPanel.tsx
│   │   ├── 📄 VoiceIndicator.tsx
│   │   └── 📄 StatusBar.tsx
│   ├── 📁 types/               # TypeScript definitions
│   ├── 📄 App.tsx             # Main React component
│   ├── 📄 App.css             # Application styles
│   └── 📄 index.tsx           # React entry point
├── 📁 public/                  # Static assets
├── 📁 assets/                  # Application assets
├── 📁 build/                   # React build output
├── 📁 dist/                    # Electron build output
├── 📁 release/                 # Distribution packages
├── 📄 package.json            # Dependencies and scripts
├── 📄 tsconfig.json           # TypeScript config (React)
├── 📄 tsconfig.electron.json  # TypeScript config (Electron)
├── 📄 Dockerfile              # Container configuration
└── 📄 README.md               # Project documentation
```

## 🔧 Configuration Files

### TypeScript Configuration
- **`tsconfig.json`**: React frontend configuration
- **`tsconfig.electron.json`**: Electron main process configuration

### Build Configuration
- **`package.json`**: npm scripts and electron-builder config
- **Electron Builder**: Automated packaging for all platforms

### Development Tools
- **ESLint**: Code linting with TypeScript rules
- **Prettier**: Code formatting (add if needed)

## 🎨 Code Style Guidelines

### TypeScript Best Practices
```typescript
// Use interfaces for object shapes
interface ComponentProps {
  title: string;
  onClose?: () => void;
}

// Use type aliases for unions
type Status = 'loading' | 'success' | 'error';

// Use const assertions for immutable arrays
const MODELS = ['gpt-3.5-turbo', 'gpt-4'] as const;

// Use async/await over Promises
const fetchData = async (): Promise<Data> => {
  const response = await fetch('/api/data');
  return response.json();
};
```

### React Component Patterns
```typescript
// Functional components with hooks
const Component: React.FC<Props> = ({ prop1, prop2 }) => {
  const [state, setState] = useState<StateType>(initialValue);
  
  useEffect(() => {
    // Side effects
  }, [dependencies]);
  
  return <div>{/* JSX */}</div>;
};

// Custom hooks for reusable logic
const useCustomHook = (param: string) => {
  const [value, setValue] = useState();
  // Hook logic
  return { value, setValue };
};
```

### CSS Conventions
- **BEM methodology**: `.component__element--modifier`
- **CSS Variables**: Use for theme colors and spacing
- **Mobile-first**: Responsive design with min-width breakpoints

## 🔒 Security Considerations

### Electron Security
1. **Context Isolation**: Enabled by default
2. **Node Integration**: Disabled in renderer
3. **Remote Module**: Disabled
4. **CSP Headers**: Implemented in HTML
5. **Secure Defaults**: All security features enabled

### API Security
1. **API Key Storage**: Encrypted using electron-store
2. **Input Validation**: Sanitize all user inputs
3. **HTTPS Only**: All external API calls use HTTPS
4. **Rate Limiting**: Implement client-side rate limiting

## 🧪 Testing Strategy

### Unit Testing
```bash
# React components
npm test

# Test specific component
npm test -- --testNamePattern="ChatInterface"

# Coverage report
npm test -- --coverage
```

### Integration Testing
- IPC communication testing
- AI service integration tests
- Voice service mock testing

### E2E Testing
- Electron application testing
- User workflow testing
- Cross-platform testing

## 📊 Performance Optimization

### React Performance
- **Memoization**: Use `React.memo` for expensive components
- **Code Splitting**: Lazy load components
- **Bundle Analysis**: Monitor bundle size

### Electron Performance
- **Memory Management**: Proper cleanup of listeners
- **Startup Time**: Optimize main process initialization
- **Background Processing**: Use worker threads for heavy tasks

### Monitoring
```typescript
// Performance monitoring
const measurePerformance = (name: string, fn: Function) => {
  performance.mark(`${name}-start`);
  const result = fn();
  performance.mark(`${name}-end`);
  performance.measure(name, `${name}-start`, `${name}-end`);
  return result;
};
```

## 🚀 Deployment

### Development Deployment
```bash
# Start development servers
npm run dev

# Build for testing
npm run build
```

### Production Deployment
```bash
# Build application
npm run build

# Create distributables
npm run dist

# Docker deployment
docker build -t deskmate-ai .
docker run -p 3000:3000 deskmate-ai
```

### Platform-Specific Builds
```bash
# Build for specific platform
npm run dist -- --mac
npm run dist -- --win
npm run dist -- --linux
```

## 🤝 Contributing

### Development Workflow
1. **Fork** the repository
2. **Create** a feature branch
3. **Implement** changes with tests
4. **Run** linting and tests
5. **Submit** pull request

### Commit Guidelines
```bash
# Format: type(scope): description
feat(chat): add voice command support
fix(ui): resolve message overflow issue
docs(readme): update installation instructions
```

### Pull Request Process
1. Ensure all tests pass
2. Update documentation
3. Add screenshots for UI changes
4. Request review from maintainers

## 📈 Roadmap & Future Features

### Phase 1: Core Features ✅
- [x] AI chat interface
- [x] Voice commands
- [x] System tray integration
- [x] Settings management

### Phase 2: Enhanced Features 🚧
- [ ] Plugin system
- [ ] Multiple AI providers
- [ ] Advanced voice synthesis
- [ ] File drag-and-drop

### Phase 3: Advanced Features 📋
- [ ] Team collaboration
- [ ] Cloud synchronization
- [ ] Advanced analytics
- [ ] Mobile companion app

## 🆘 Troubleshooting

### Common Issues

**Issue**: Electron app won't start
```bash
# Solution: Rebuild native modules
npm run postinstall
```

**Issue**: TypeScript compilation errors
```bash
# Solution: Clear cache and reinstall
rm -rf node_modules dist build
npm install
```

**Issue**: Voice recognition not working
```bash
# Check microphone permissions
# Ensure HTTPS context for Web Speech API
```

### Debug Mode
```bash
# Enable debug logging
DEBUG=* npm run dev

# Electron debug mode
npm run dev -- --enable-logging
```

## 📚 Resources

### Documentation
- [Electron Documentation](https://electronjs.org/docs)
- [React Documentation](https://reactjs.org/docs)
- [TypeScript Documentation](https://typescriptlang.org/docs)
- [OpenAI API Documentation](https://platform.openai.com/docs)

### Tools
- [Electron Fiddle](https://electronjs.org/fiddle) - Prototyping
- [React DevTools](https://reactjs.org/blog/2019/08/15/new-react-devtools.html) - Debugging
- [Electron DevTools](https://github.com/MarshallOfSound/electron-devtools-installer) - Debugging

---

**Happy coding! 🚀**

For questions or support, please open an issue or contact the development team. 