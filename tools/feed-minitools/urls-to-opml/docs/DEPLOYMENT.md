# Deployment Guide

## Overview

URLs to OPML is a static client-side application. Deployment is simple - just serve the static files.

## Deployment Options

### Option 1: Static File Hosting

Any static file hosting service works:

- **GitHub Pages**
- **Netlify**
- **Vercel**
- **Cloudflare Pages**
- **AWS S3 + CloudFront**
- **Any web server** (Apache, Nginx, etc.)

### Option 2: Coolify

If using Coolify, the `coolify.yml` file is already configured:

```yaml
type: static
build:
  command: echo "No build required - static files only"
  directory: .
port: 80
```

### Option 3: Simple Web Server

#### Nginx

```nginx
server {
    listen 80;
    server_name your-domain.com;
    root /path/to/urls-to-opml;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

#### Apache

```apache
<VirtualHost *:80>
    ServerName your-domain.com
    DocumentRoot /path/to/urls-to-opml
    
    <Directory /path/to/urls-to-opml>
        Options Indexes FollowSymLinks
        AllowOverride None
        Require all granted
    </Directory>
</VirtualHost>
```

## Deployment Checklist

- [ ] All files are present (`index.html`, `app.js`, `modules/`)
- [ ] Shared design system files are accessible (`../../../shared/`)
- [ ] Test the application after deployment
- [ ] Verify CORS works correctly
- [ ] Check browser console for errors

## Important Notes

### Shared Design System

This tool uses shared assets and design system from `../../../shared/`. Make sure:
- The relative paths are correct
- Or adjust paths if deploying separately

### CORS Considerations

- The application makes cross-origin requests to detect feeds
- Some websites may block these requests
- This is expected behavior and not a deployment issue

## Post-Deployment

1. Test the application with various URLs
2. Verify OPML generation works
3. Check browser console for any errors
4. Monitor for any CORS issues

## Troubleshooting

### Files Not Loading

- Check file paths are correct
- Verify web server configuration
- Check file permissions

### CORS Errors

- This is normal - some websites block cross-origin requests
- Users may need to use a browser extension or proxy for some sites
- Not a deployment issue

## Maintenance

- No server maintenance required
- No dependencies to update
- Just keep the files served
