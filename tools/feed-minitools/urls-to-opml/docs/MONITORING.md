# Monitoring Guide

## Overview

This guide covers the complete monitoring setup for URLs to OPML, including performance metrics, error tracking, and alerting.

## Cloudflare Analytics Setup

### 1. Worker Analytics

```javascript
// worker/src/monitoring.js
class Monitoring {
  constructor() {
    this.metrics = {
      requests: 0,
      errors: 0,
      latency: []
    };
  }

  async trackRequest(request, handler) {
    const start = Date.now();
    try {
      this.metrics.requests++;
      const response = await handler(request);
      this.metrics.latency.push(Date.now() - start);
      return response;
    } catch (error) {
      this.metrics.errors++;
      throw error;
    }
  }

  getMetrics() {
    return {
      ...this.metrics,
      averageLatency: this.calculateAverageLatency()
    };
  }
}
```

### 2. Frontend Monitoring

```typescript
// frontend/lib/monitoring.ts
import { Analytics } from '@vercel/analytics/react';

export function setupMonitoring() {
  // Performance monitoring
  if (typeof window !== 'undefined') {
    new PerformanceObserver((entryList) => {
      for (const entry of entryList.getEntries()) {
        console.log(`${entry.name}: ${entry.startTime}`);
        // Send to analytics
      }
    }).observe({ entryTypes: ['paint', 'largest-contentful-paint'] });
  }
}
```

## Error Tracking

### 1. Worker Error Tracking

```javascript
// worker/src/error-tracking.js
async function trackError(error, request) {
  const errorData = {
    message: error.message,
    stack: error.stack,
    url: request.url,
    method: request.method,
    timestamp: Date.now(),
    userAgent: request.headers.get('user-agent')
  };

  await env.ANALYTICS.writeDataPoint({
    blobs: ['error', JSON.stringify(errorData)],
    doubles: [Date.now()],
    indexes: ['errors']
  });
}
```

### 2. Frontend Error Tracking

```typescript
// frontend/lib/error-boundary.tsx
import { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(_: Error): State {
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
    // Send to error tracking service
  }

  public render() {
    if (this.state.hasError) {
      return <h1>Sorry.. there was an error</h1>;
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
```

## Performance Monitoring

### 1. Custom Metrics

```typescript
// frontend/lib/metrics.ts
export interface PerformanceMetrics {
  ttfb: number;
  fcp: number;
  lcp: number;
  cls: number;
}

export function collectPerformanceMetrics(): PerformanceMetrics {
  return {
    ttfb: performance.getEntriesByType('navigation')[0]?.responseStart ?? 0,
    fcp: performance.getEntriesByName('first-contentful-paint')[0]?.startTime ?? 0,
    lcp: performance.getEntriesByName('largest-contentful-paint')[0]?.startTime ?? 0,
    cls: performance.getEntriesByName('layout-shift').reduce((sum, entry) => sum + entry.value, 0)
  };
}
```

## Alerting System

### 1. Alert Configuration

```javascript
// worker/src/alerts.js
const ALERT_THRESHOLDS = {
  errorRate: 0.05, // 5% error rate
  latency: 1000,   // 1 second
  memory: 128      // 128MB
};

async function checkAlerts(metrics) {
  const alerts = [];
  
  // Check error rate
  const errorRate = metrics.errors / metrics.requests;
  if (errorRate > ALERT_THRESHOLDS.errorRate) {
    alerts.push({
      type: 'error_rate',
      value: errorRate,
      threshold: ALERT_THRESHOLDS.errorRate
    });
  }

  // Check latency
  if (metrics.averageLatency > ALERT_THRESHOLDS.latency) {
    alerts.push({
      type: 'high_latency',
      value: metrics.averageLatency,
      threshold: ALERT_THRESHOLDS.latency
    });
  }

  return alerts;
}
```

### 2. Alert Notifications

```typescript
// frontend/lib/alerts.ts
interface Alert {
  type: string;
  value: number;
  threshold: number;
  message: string;
}

async function sendAlert(alert: Alert) {
  // Send to notification service (e.g., email, Slack)
  await fetch('/api/alert', {
    method: 'POST',
    body: JSON.stringify(alert)
  });
}
```

## Dashboard Setup

### 1. Metrics Dashboard

```typescript
// frontend/components/Dashboard.tsx
import { LineChart, Line, XAxis, YAxis, Tooltip } from 'recharts';

interface MetricsDashboard {
  data: {
    timestamp: number;
    requests: number;
    errors: number;
    latency: number;
  }[];
}

export function MetricsDashboard({ data }: MetricsDashboard) {
  return (
    <div className="p-4">
      <h2>Performance Metrics</h2>
      <LineChart width={600} height={300} data={data}>
        <Line type="monotone" dataKey="requests" stroke="#8884d8" />
        <Line type="monotone" dataKey="errors" stroke="#82ca9d" />
        <XAxis dataKey="timestamp" />
        <YAxis />
        <Tooltip />
      </LineChart>
    </div>
  );
}
```

## Health Checks

### 1. Worker Health Check

```javascript
// worker/src/health.js
async function healthCheck() {
  const checks = {
    api: await checkAPI(),
    memory: checkMemoryUsage(),
    cache: await checkCache()
  };

  const status = Object.values(checks).every(check => check.status === 'healthy')
    ? 'healthy'
    : 'unhealthy';

  return {
    status,
    checks,
    timestamp: new Date().toISOString()
  };
}
```

## Logging

### 1. Structured Logging

```typescript
// lib/logger.ts
interface LogEvent {
  level: 'debug' | 'info' | 'warn' | 'error';
  message: string;
  metadata?: Record<string, any>;
  timestamp: string;
}

export class Logger {
  static log(event: LogEvent) {
    // Send to logging service
    console.log(JSON.stringify(event));
  }
}
```

## Maintenance

### Regular Tasks

1. Review metrics daily
2. Check error logs
3. Update alert thresholds
4. Clean up old logs
5. Verify monitoring systems

### Backup

1. Export metrics data
2. Backup dashboard configurations
3. Save alert settings

## Troubleshooting

### Common Issues

1. Missing metrics
   - Check data collection
   - Verify monitoring setup

2. False alerts
   - Adjust thresholds
   - Verify alert conditions

3. Dashboard issues
   - Check data source
   - Verify permissions
