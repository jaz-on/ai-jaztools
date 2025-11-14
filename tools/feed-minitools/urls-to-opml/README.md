# URLs to OPML

Convert a list of website URLs to OPML format by automatically detecting their RSS/Atom feeds.

**Note:** This is a client-side application that runs entirely in your browser. No data is sent to any server.

## 🌟 Features

- ✨ Bulk URL processing
- 🔍 Automatic RSS/Atom feed detection
- 🔄 Real-time feed validation
- 💾 OPML file generation
- 🔒 Privacy-first: All processing happens in your browser
- 🎨 Modern, responsive interface
- 🚀 No backend required - works offline after initial load

## 🚀 Quick Start

### Usage

Simply open `index.html` in a web browser or serve it from a web server. No installation or build process required.

### Local Development

```bash
# Serve with a simple HTTP server (Python)
python -m http.server 8000

# Or with Node.js
npx http-server

# Or with PHP
php -S localhost:8000
```

Then visit `http://localhost:8000` in your browser.

## 📖 Documentation

- [User Guide](docs/USER_GUIDE.md) - How to use the tool
- [Setup Guide](docs/SETUP.md) - Development setup (if needed)
- [Deployment Guide](docs/DEPLOYMENT.md) - Deployment instructions

## 🛠️ Technology Stack

### Client-Side
- Vanilla JavaScript (ES6 modules)
- HTML5
- CSS3 (using shared design system)

### Features
- Client-side RSS/Atom feed detection
- HTML parsing for feed discovery
- OPML generation
- No external dependencies

## 🔒 Privacy & Security

- **100% Client-Side**: All processing happens in your browser
- **No Data Collection**: No data is sent to any server
- **No Tracking**: No analytics or tracking scripts
- **CORS Handling**: Uses browser CORS for feed detection

## 📝 How It Works

1. Enter website URLs (one per line)
2. Click "Find Feeds" to detect RSS/Atom feeds
3. The tool automatically:
   - Fetches each website
   - Parses HTML for feed links
   - Checks common feed paths (`/feed`, `/rss`, etc.)
   - Validates feed formats (RSS/Atom)
4. Download the generated OPML file
5. Import into your RSS reader

## 🤝 Contributing

Contributions are welcome! This tool is part of the [ai-jaztools](https://github.com/jaz-on/ai-jaztools) project.

## 📝 License

This project is part of ai-jaztools and is licensed under the GNU Affero General Public License v3.0 - see the [LICENSE](../../../LICENSE) file for details.