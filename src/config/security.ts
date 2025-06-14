export const SECURITY_CONFIG = {
  // Rate limiting
  RATE_LIMIT: {
    WINDOW_MS: 15 * 60 * 1000, // 15 minutes
    MAX_REQUESTS: 100,
  },
  
  // Session
  SESSION: {
    MAX_AGE: 24 * 60 * 60 * 1000, // 24 hours
    SECURE_COOKIES: true,
  },
  
  // Password requirements (for future traditional auth)
  PASSWORD: {
    MIN_LENGTH: 8,
    REQUIRE_SPECIAL_CHAR: true,
    REQUIRE_NUMBER: true,
    REQUIRE_UPPERCASE: true,
  },
  
  // API security
  API: {
    TIMEOUT_MS: 30000, // 30 seconds
    MAX_PAYLOAD_SIZE: '1mb',
  },
  
  // Content Security Policy
  CSP: {
    DEFAULT_SRC: ["'self'"],
    SCRIPT_SRC: ["'self'", "'unsafe-inline'", "'unsafe-eval'", "https://cdn.jsdelivr.net"],
    STYLE_SRC: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
    IMG_SRC: ["'self'", "data:", "https:"],
    FONT_SRC: ["'self'", "https://fonts.gstatic.com"],
    CONNECT_SRC: ["'self'", "https://api.your-backend.com"],
  },
  
  // Protected routes
  PROTECTED_ROUTES: [
    '/profile',
    '/dashboard',
    '/service',
    '/project',
  ],
  
  // Public routes
  PUBLIC_ROUTES: [
    '/',
    '/marketplace',
    '/about',
  ],
}; 