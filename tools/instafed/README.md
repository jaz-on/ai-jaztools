# InstaFed

A secure and fast tool to facilitate migration from Instagram to Pixelfed. All processing happens locally in your browser, ensuring complete privacy.

## Quick Start

1. **Get Instagram Archive**: Settings → Privacy and Security → Download Information (JSON format)
2. **Convert**: Open `index.html`, drop your archive, follow the steps
3. **Import**: Upload converted archive to your chosen Pixelfed server

## Key Features

- **Privacy-First**: Local processing only, no data leaves your device
- **Smart Fixes**: Handles empty captions, optimizes structure, cleans metadata
- **User-Friendly**: Step-by-step process with real-time feedback
- **Universal**: Works on all modern browsers, no installation needed

## Project Structure & Architecture

```
instafed/
├── index.html          # Main application
├── styles.css          # CSS entry point
├── styles/            
│   ├── base.css       # Global styles, typography
│   ├── layout.css     # Structure, grid system
│   ├── components.css # UI components
│   └── icons.css      # Icon system
└── script.js          # Core functionality
```

### CSS Organization
- **Base**: Reset, typography, variables, accessibility utilities
- **Layout**: Grid system, containers, responsive design
- **Components**: UI elements, forms, progress bars, cards
- **Icons**: SVG system with accessibility support

## Accessibility Features

- **Keyboard**: Full navigation + shortcuts (Tab, Enter/Space, Esc, Ctrl/Cmd+K)
- **Screen Readers**: ARIA labels, live regions, status updates
- **Visual**: High contrast, reduced motion, focus indicators
- **Structure**: Semantic HTML, proper heading hierarchy

## Technical Details

### Browser Support
- Chrome 60+, Firefox 55+, Safari 12+, Edge 79+
- Requires: ES6+, File API, Drag & Drop, CSS Grid

### Performance
- Modular CSS/JS architecture
- Efficient file processing
- Memory management
- Progressive enhancement

### Privacy & Security
- Client-side processing
- No external requests
- Automatic data cleanup
- Open source auditable code

## Contributing
1. Fork & clone
2. Create feature branch
3. Follow guidelines
4. Test thoroughly
5. Submit PR

## Credits & License
- **License**: MIT
- **Author**: [Jason Rouet](https://jasonrouet.com/)