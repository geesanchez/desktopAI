# DeskMate AI - Asset Creation Guide

This directory contains the application assets. Since we can't generate actual image files in this context, here are the specifications and instructions for creating the required assets:

## Required Assets

### 1. Application Icon (`icon.png`)
- **Size**: 512x512px
- **Format**: PNG with transparency
- **Style**: Modern, clean robot/AI icon
- **Colors**: Use gradient from #667eea to #764ba2
- **Usage**: Main application icon, shown in dock/taskbar

### 2. Tray Icon (`tray-icon.png`)
- **Size**: 32x32px (will be resized to 16x16)
- **Format**: PNG with transparency
- **Style**: Simplified version of main icon
- **Colors**: Monochrome or subtle colors
- **Usage**: System tray icon (appears in menu bar)

### 3. Favicon (`favicon.ico`)
- **Size**: Multiple sizes (16x16, 32x32, 48x48)
- **Format**: ICO file
- **Usage**: Browser tab icon
- **Note**: Should be placed in `public/favicon.ico`

### 4. App Store Icons
- **logo192.png**: 192x192px for PWA
- **logo512.png**: 512x512px for PWA
- **Usage**: Web app manifest and app stores

### 5. Social Media Assets
- **og-image.png**: 1200x630px for Open Graph
- **twitter-image.png**: 1200x675px for Twitter cards
- **Usage**: Social media previews

### 6. Screenshots
- **screenshot-wide.png**: 1280x720px
- **screenshot-narrow.png**: 720x1280px
- **Usage**: App store listings and documentation

## Design Guidelines

### Icon Design
```
🎨 Color Palette:
- Primary: #667eea (Blue)
- Secondary: #764ba2 (Purple)
- Accent: #10b981 (Green)
- Background: #f8fafc (Light Gray)
```

### Icon Concept
The main icon should represent:
- 🤖 AI/Robot theme
- 💬 Communication/Chat
- ⚡ Intelligence/Speed
- 🖥️ Desktop/Computer

### Tools for Creation
1. **Vector Graphics**: Figma, Adobe Illustrator, Sketch
2. **Raster Graphics**: Photoshop, GIMP, Canva
3. **Icon Generation**: IconGenerator, AppIconMaker
4. **Online Tools**: Favicon.io, RealFaviconGenerator

## Quick Asset Generation

### Using AI Tools (Recommended)
```bash
# Prompt for AI image generation (DALL-E, Midjourney, etc.):
"Modern minimalist robot assistant icon, gradient from blue to purple, 
clean geometric design, suitable for desktop application, 
transparent background, professional style"
```

### Using Design Tools
1. Create a 512x512px canvas
2. Design a simple robot/AI icon
3. Use the color palette above
4. Export in required formats
5. Generate different sizes using batch processing

### Placeholder Assets
For immediate development, you can use:
- Emoji as temporary icons (🤖, 💬, ⚡)
- Simple geometric shapes
- Text-based logos

## File Structure
```
assets/
├── icon.png              # Main app icon (512x512)
├── tray-icon.png         # System tray icon (32x32)
├── icon.icns             # macOS icon bundle
├── icon.ico              # Windows icon
└── screenshots/
    ├── main-interface.png
    ├── chat-demo.png
    └── settings-panel.png

public/
├── favicon.ico           # Browser favicon
├── logo192.png          # PWA icon
├── logo512.png          # PWA icon
├── og-image.png         # Social media preview
└── manifest.json        # Web app manifest
```

## Implementation Notes

1. **Icon Registration**: Icons are referenced in:
   - `package.json` (build.icon)
   - `electron/main.ts` (window icon, tray icon)
   - `public/manifest.json` (PWA icons)

2. **Platform Considerations**:
   - macOS: Use .icns format for best quality
   - Windows: Use .ico format with multiple sizes
   - Linux: PNG files work well

3. **Automated Generation**: Consider using tools like:
   - `electron-icon-maker`
   - `app-icon-generator`
   - `electron-builder` icon processing

## Asset Optimization

- Compress PNG files using TinyPNG or ImageOptim
- Use vector formats when possible
- Test icons at different sizes and backgrounds
- Ensure accessibility with sufficient contrast

---

**Note**: Replace this file with actual asset files once created. This guide serves as a reference for the design and creation process. 