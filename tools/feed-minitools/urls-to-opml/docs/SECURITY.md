# Security Guide

## Overview

This document outlines security measures implemented in URLs to OPML.

## Security Features

### 1. Input Validation

```typescript
// frontend/lib/validation.ts
import { z } from 'zod';

export const UrlSchema = z.string().url().max(2048);

export const UrlsInputSchema = z.object({
  urls: z.array(UrlSchema).max(50)
});

export function validateUrls(urls: string[]): boolean {
  try {
    UrlsInputSchema.parse({ urls });
    return true;
  } catch (error) {
    return false;
  }
}
```

### 2. Rate Limiting

```javascript
// worker/src/rate-limit.js
class RateLimiter {
  constructor(options = {}) {
    this.windowMs = options.windowMs || 60000; // 1 minute
    this.max = options.max || 100; // 100 requests per window
    this.store = new Map();
  }

  async isRateLimited(ip) {
    const now = Date.now();
    const requests = this.store.get(ip) || [];
    
    // Clean old requests
    const recentRequests = requests.filter(time => 
      now - time < this.windowMs
    );

    if (recentRequests.length >= this.max) {
      return true;
    }

    recentRequests.push(now);
    this.store.set(ip, recentRequests);
    return false;
  }
}
```

### 3. CORS Configuration

```javascript
// worker/src/cors.js
const corsHeaders = {
  'Access-Control-Allow-Origin': 'https://urls-to-opml.pages.dev',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Max-Age': '86400',
};

function handleCORS(request) {
  if (request.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }
  return null;
}
```

### 4. Content Security Policy

```typescript
// frontend/next.config.js
const ContentSecurityPolicy = `
  default-src 'self';
  script-src 'self' 'unsafe-eval' 'unsafe-inline';
  style-src 'self' 'unsafe-inline';
  img-src 'self' data:;
  font-src 'self';
  connect-src 'self' https://urls-to-opml-api.workers.dev;
`;

const securityHeaders = [
  {
    key: 'Content-Security-Policy',
    value: ContentSecurityPolicy.replace(/\s{2,}/g, ' ').trim()
  },
  {
    key: 'X-Frame-Options',
    value: 'DENY'
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff'
  },
  {
    key: 'Referrer-Policy',
    value: 'strict-origin-when-cross-origin'
  },
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=()'
  }
];
```

### 5. XSS Protection

```typescript
// frontend/lib/sanitization.ts
import DOMPurify from 'dompurify';

export function sanitizeHtml(html: string): string {
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: ['a', 'b', 'i', 'em', 'strong'],
    ALLOWED_ATTR: ['href']
  });
}

export function sanitizeUrl(url: string): string {
  const sanitized = url.trim();
  if (!sanitized.startsWith('http://') && !sanitized.startsWith('https://')) {
    return `https://${sanitized}`;
  }
  return sanitized;
}
```

## Security Best Practices

### 1. Dependency Management

```bash
# Check for vulnerabilities
npm audit

# Update dependencies
npm update

# Generate dependency report
npm audit report
```

### 2. Secret Management

```javascript
// worker/src/secrets.js
class SecretManager {
  constructor(env) {
    this.env = env;
  }

  async getSecret(name) {
    return this.env[name];
  }

  async rotateSecrets() {
    // Implement secret rotation logic
  }
}
```

### 3. Logging and Monitoring

```typescript
// frontend/lib/security-monitoring.ts
interface SecurityEvent {
  type: 'authentication' | 'authorization' | 'validation' | 'rate-limit';
  severity: 'low' | 'medium' | 'high' | 'critical';
  details: Record<string, any>;
  timestamp: string;
}

export async function logSecurityEvent(event: SecurityEvent) {
  await fetch('/api/security-log', {
    method: 'POST',
    body: JSON.stringify(event)
  });
}
```

## Security Checklist

### Development
- [ ] Input validation
- [ ] Output encoding
- [ ] Error handling
- [ ] Secure dependencies
- [ ] Code review

### Deployment
- [ ] SSL/TLS configuration
- [ ] Security headers
- [ ] CORS policy
- [ ] Rate limiting
- [ ] Monitoring setup

### Maintenance
- [ ] Regular updates
- [ ] Security scanning
- [ ] Log review
- [ ] Incident response
- [ ] Access control

## Incident Response

### 1. Detection

```typescript
// lib/incident-detection.ts
interface SecurityIncident {
  id: string;
  type: string;
  severity: string;
  details: Record<string, any>;
  timestamp: string;
}

export async function detectIncident(event: any): Promise<SecurityIncident | null> {
  // Implement detection logic
  return null;
}
```

### 2. Response Procedure

1. Immediate Actions
   - Isolate affected systems
   - Block suspicious IPs
   - Notify security team

2. Investigation
   - Collect logs
   - Analyze traffic
   - Document findings

3. Recovery
   - Patch vulnerabilities
   - Restore systems
   - Update documentation

## Regular Security Tasks

### Daily
- Monitor security logs
- Check rate limit violations
- Review access patterns

### Weekly
- Update dependencies
- Review security alerts
- Check SSL/TLS configuration

### Monthly
- Security penetration testing
- Access control review
- Policy updates
- Documentation review

## Security Configurations

### 1. Worker Security

```toml
# wrangler.toml
[security]
always_use_https = true
tls_1_3 = true

[[security.policies]]
block_uploads = true
max_upload_size = "1MB"
```

### 2. Frontend Security

```typescript
// next.config.js
module.exports = {
  poweredByHeader: false,
  httpAgentOptions: {
    keepAlive: true
  },
  headers: async () => [
    {
      source: '/:path*',
      headers: securityHeaders
    }
  ]
}
```

[Continuing with CI/CD documentation...]