import { createHash } from 'crypto';

// Input sanitization
export const sanitizeInput = (input: string): string => {
  if (!input) return '';
  return input
    .replace(/[<>]/g, '') // Remove < and > to prevent XSS
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .trim();
};

// Basic rate limiting
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_WINDOW = 15 * 60 * 1000; // 15 minutes
const MAX_REQUESTS = 100; // Maximum requests per window

// Rate limiting middleware
export const checkRateLimit = (identifier: string): boolean => {
  const now = Date.now();
  const userLimit = rateLimitStore.get(identifier);

  if (!userLimit || now > userLimit.resetTime) {
    rateLimitStore.set(identifier, {
      count: 1,
      resetTime: now + RATE_LIMIT_WINDOW,
    });
    return true;
  }

  if (userLimit.count >= MAX_REQUESTS) {
    return false;
  }

  userLimit.count++;
  return true;
};

// Password hashing (for any future traditional auth)
export const hashPassword = (password: string): string => {
  return createHash('sha256').update(password).digest('hex');
};

// CSRF token generation
export const generateCSRFToken = (): string => {
  return createHash('sha256')
    .update(Math.random().toString())
    .digest('hex');
};

// Validate wallet signature
export const validateWalletSignature = async (
  message: string,
  signature: string,
  address: string
): Promise<boolean> => {
  try {
    // Implement wallet signature validation logic here
    // This is a placeholder - you'll need to implement the actual validation
    // based on your wallet provider (e.g., wagmi, ethers.js)
    return true;
  } catch (error) {
    console.error('Error validating wallet signature:', error);
    return false;
  }
};

// Basic security headers
export const getSecurityHeaders = () => {
  return {
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'X-XSS-Protection': '1; mode=block',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
  };
};

// Content Security Policy headers
export const getCSPHeaders = () => {
  return {
    'Content-Security-Policy': `
      default-src 'self';
      script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.jsdelivr.net;
      style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
      img-src 'self' data: https:;
      font-src 'self' https://fonts.gstatic.com;
      connect-src 'self' https://api.your-backend.com;
    `.replace(/\s+/g, ' ').trim(),
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'X-XSS-Protection': '1; mode=block',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
  };
}; 