# Setup Guide

## Overview

URLs to OPML is a **client-side application** that runs entirely in your browser. No backend, no build process, no dependencies required.

## Prerequisites

- A modern web browser (Chrome, Firefox, Safari, Edge)
- A web server (optional, for local development)

## Local Development

### Option 1: Direct File Access

Simply open `index.html` in your web browser. However, due to CORS restrictions, some features may not work when opening files directly.

### Option 2: Local Web Server (Recommended)

Use any simple HTTP server:

**Python:**
```bash
python -m http.server 8000
```

**Node.js:**
```bash
npx http-server
```

**PHP:**
```bash
php -S localhost:8000
```

**VS Code Live Server:**
- Install the "Live Server" extension
- Right-click on `index.html` and select "Open with Live Server"

Then visit `http://localhost:8000` in your browser.

## Project Structure

```
urls-to-opml/
├── index.html          # Main HTML file
├── app.js              # Main application logic
├── modules/
│   ├── feedParser.js   # Feed detection and parsing
│   └── opmlGenerator.js # OPML file generation
├── docs/               # Documentation
└── coolify.yml         # Deployment configuration
```

## Development

### Making Changes

1. Edit the files directly
2. Refresh your browser to see changes
3. No build or compilation step required

### Testing

1. Open the application in your browser
2. Test with various URLs
3. Check browser console for any errors

## Browser Compatibility

- Chrome/Edge: Full support
- Firefox: Full support
- Safari: Full support
- Mobile browsers: Full support

## Troubleshooting

### CORS Issues

If you encounter CORS errors when testing locally:
- Use a local web server instead of opening files directly
- Some websites may block cross-origin requests from localhost

### Feed Detection Not Working

- Check browser console for errors
- Verify the website has RSS/Atom feeds
- Some websites may require authentication

## Next Steps

- See [USER_GUIDE.md](USER_GUIDE.md) for usage instructions
- See [DEPLOYMENT.md](DEPLOYMENT.md) for deployment options
