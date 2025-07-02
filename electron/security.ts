import { session } from 'electron';
import { isDev } from './utils';

export const setupSecurity = () => {
  // Set up Content Security Policy
  const csp = isDev
    ? // Development CSP (minimal unsafe-eval for React dev tools only)
      "default-src 'self' https://api.openai.com ws://localhost:* http://localhost:*; " +
      "script-src 'self' 'unsafe-inline' http://localhost:* blob:; " +
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com http://localhost:*; " +
      "font-src 'self' https://fonts.gstatic.com; " +
      "img-src 'self' data: https: http://localhost:*; " +
      "connect-src 'self' https://api.openai.com ws://localhost:* http://localhost:*; " +
      "worker-src 'self' blob:;"
    : // Production CSP (strict security)
      "default-src 'self'; " +
      "script-src 'self'; " +
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; " +
      "font-src 'self' https://fonts.gstatic.com; " +
      "img-src 'self' data: https:; " +
      "connect-src 'self' https://api.openai.com;";

  console.log('Setting up CSP:', csp);

  // Set CSP header for all requests
  session.defaultSession.webRequest.onHeadersReceived((details, callback) => {
    callback({
      responseHeaders: {
        ...details.responseHeaders,
        'Content-Security-Policy': [csp]
      }
    });
  });

  // Block insecure content in production
  if (!isDev) {
    session.defaultSession.webRequest.onBeforeRequest((details, callback) => {
      // Block HTTP requests in production (only allow HTTPS)
      if (details.url.startsWith('http://') && !details.url.includes('localhost')) {
        callback({ cancel: true });
      } else {
        callback({});
      }
    });
  }

  // Set secure session settings
  session.defaultSession.setUserAgent(
    session.defaultSession.getUserAgent() + ' DeskMateAI/1.0.0'
  );

  // Clear any existing data in development for clean state
  if (isDev) {
    session.defaultSession.clearStorageData({
      storages: ['cookies', 'filesystem', 'indexdb', 'localstorage', 'shadercache', 'websql']
    });
  }
};

export const validateURL = (url: string): boolean => {
  try {
    const parsedURL = new URL(url);
    
    // Allow localhost in development
    if (isDev && parsedURL.hostname === 'localhost') {
      return true;
    }
    
    // Allow HTTPS URLs for APIs
    if (parsedURL.protocol === 'https:') {
      const allowedHosts = [
        'api.openai.com',
        'fonts.googleapis.com',
        'fonts.gstatic.com'
      ];
      return allowedHosts.includes(parsedURL.hostname);
    }
    
    // Allow file protocol for production builds
    if (parsedURL.protocol === 'file:') {
      return true;
    }
    
    return false;
  } catch {
    return false;
  }
};

export const sanitizeInput = (input: string): string => {
  // Remove potential XSS vectors
  return input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+\s*=/gi, '')
    .trim();
}; 