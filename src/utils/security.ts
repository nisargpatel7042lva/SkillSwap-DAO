import { createHash } from 'crypto';
import { SECURITY_CONFIG } from '@/config/security';

// Input sanitization
export const sanitizeInput = (input: string): string => {
  if (!input) return '';
  return input
    .replace(/[<>]/g, '') // Remove < and > to prevent XSS
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .trim();
};

// Rate limiting
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

export const checkRateLimit = (identifier: string): boolean => {
  const now = Date.now();
  const userLimit = rateLimitStore.get(identifier);

  if (!userLimit || now > userLimit.resetTime) {
    rateLimitStore.set(identifier, {
      count: 1,
      resetTime: now + SECURITY_CONFIG.RATE_LIMIT.WINDOW_MS,
    });
    return true;
  }

  if (userLimit.count >= SECURITY_CONFIG.RATE_LIMIT.MAX_REQUESTS) {
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

// Security headers
export const getSecurityHeaders = () => {
  return {
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'X-XSS-Protection': '1; mode=block',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
  };
};

// Route protection
export const isProtectedRoute = (path: string): boolean => {
  const protectedRoutes = [
    '/profile',
    '/dashboard',
    '/service',
    '/project',
  ];
  return protectedRoutes.some(route => path.startsWith(route));
};

// Password validation (for future traditional auth)
export const validatePassword = (password: string): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  const { MIN_LENGTH, REQUIRE_SPECIAL_CHAR, REQUIRE_NUMBER, REQUIRE_UPPERCASE } = SECURITY_CONFIG.PASSWORD;

  if (password.length < MIN_LENGTH) {
    errors.push(`Password must be at least ${MIN_LENGTH} characters long`);
  }
  if (REQUIRE_SPECIAL_CHAR && !/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push('Password must contain at least one special character');
  }
  if (REQUIRE_NUMBER && !/\d/.test(password)) {
    errors.push('Password must contain at least one number');
  }
  if (REQUIRE_UPPERCASE && !/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

// API request validation
export const validateApiRequest = (request: Request): { isValid: boolean; error?: string } => {
  // Check content type
  const contentType = request.headers.get('content-type');
  if (request.method === 'POST' && contentType !== 'application/json') {
    return { isValid: false, error: 'Invalid content type' };
  }

  // Check payload size
  const contentLength = request.headers.get('content-length');
  if (contentLength && parseInt(contentLength) > parseInt(SECURITY_CONFIG.API.MAX_PAYLOAD_SIZE)) {
    return { isValid: false, error: 'Payload too large' };
  }

  return { isValid: true };
};

// Session management
export const createSecureSession = (userId: string): string => {
  const sessionId = crypto.randomUUID();
  const expiresAt = Date.now() + SECURITY_CONFIG.SESSION.MAX_AGE;
  
  // In a real application, you would store this in a secure database
  // For now, we'll just return the session ID
  return sessionId;
}; 