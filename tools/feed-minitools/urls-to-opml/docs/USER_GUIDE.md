# User Guide

## Getting Started

URLs to OPML is a tool that helps you convert a list of website URLs into an OPML file containing their RSS/Atom feeds.

### Basic Usage

1. Open the application (serve `index.html` from a web server)
2. Enter your URLs (one per line)
3. Click "Find Feeds"
4. Download the OPML file

### Features

- Bulk URL processing
- Automatic feed detection
- OPML generation
- Feed validation

## Step-by-Step Guide

### 1. Preparing URLs

```
https://example.com
https://another-site.com
https://blog.site.com
```

### 2. Finding Feeds

1. Paste URLs in the text area
2. Click "Find Feeds"
3. Wait for results
4. Review detected feeds

### 3. Downloading OPML

1. Click "Download OPML"
2. Import the file into your RSS reader

## Advanced Usage

### Custom Feed Selection

1. Review found feeds
2. Select desired feeds
3. Generate OPML with selection

### Batch Processing

- Process multiple URLs at once
- All processing happens in your browser
- Progress indicator shown

## Troubleshooting

### Common Issues

1. Invalid URLs
   - Ensure URLs start with http:// or https://
   - Check for typos
   - Remove trailing spaces

2. No Feeds Found
   - Verify website has RSS/Atom feeds
   - Check site accessibility
   - Try alternative URLs

3. Error Messages
   - Invalid input: Check URL format
   - Network error: Check connection and CORS settings
   - CORS error: Some websites block cross-origin requests (this is normal)

## Best Practices

1. URL Format
   - Use complete URLs
   - Include protocol (http/https)
   - Remove tracking parameters

2. Batch Processing
   - Group similar sites
   - Process in smaller batches
   - Monitor results

3. Feed Management
   - Verify feed content
   - Check update frequency
   - Test in RSS reader

## RSS Reader Integration

### Compatible Readers

- Feedly
- Inoreader
- NetNewsWire
- NewsBlur

### Import Steps

1. Download OPML file
2. Open RSS reader
3. Find import option
4. Select OPML file
5. Confirm import

## FAQ

### General Questions

Q: How many URLs can I process at once?
A: There's no hard limit, but processing many URLs may take time as each is checked individually.

Q: What feed types are supported?
A: RSS and Atom feeds.

Q: Is there a cost?
A: No, this is a free client-side tool. All processing happens in your browser.

### Technical Questions

Q: Does this require a server?
A: No, this is a client-side application. You can run it locally or deploy it as static files.

Q: How are feeds validated?
A: The tool checks feed format (RSS/Atom) and accessibility directly in your browser.

## Support

### Getting Help

1. Check documentation
2. Review FAQ
3. Submit issue on GitHub
4. Contact support

### Reporting Issues

Please include:
- Steps to reproduce
- Expected behavior
- Actual behavior
- URLs tested
- Error messages

[More sections to follow...]