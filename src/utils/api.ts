
import { SECURITY_CONFIG } from '@/config/security';
import { sanitizeInput, validateApiRequest } from './security';

interface ApiOptions {
  requireAuth?: boolean;
  requireWallet?: boolean;
}

class SecureApiClient {
  private baseUrl: string;
  private defaultHeaders: HeadersInit;

  constructor() {
    this.baseUrl = import.meta.env.VITE_API_URL || '';
    this.defaultHeaders = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };
  }

  private async handleResponse(response: Response) {
    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'An error occurred' }));
      throw new Error(error.message || 'API request failed');
    }
    return response.json();
  }

  private async makeRequest(
    endpoint: string,
    options: RequestInit & ApiOptions = {}
  ) {
    const {
      requireAuth = true,
      requireWallet = false,
      headers = {},
      body,
      ...restOptions
    } = options;

    // Prepare headers
    const requestHeaders = {
      ...this.defaultHeaders,
      ...headers,
    };

    // Add authentication headers if required
    if (requireAuth) {
      const token = localStorage.getItem('auth_token');
      if (!token) {
        throw new Error('Authentication required');
      }
      requestHeaders['Authorization'] = `Bearer ${token}`;
    }

    // Add wallet headers if required
    if (requireWallet) {
      const walletAddress = localStorage.getItem('wallet_address');
      const walletSignature = localStorage.getItem('wallet_signature');
      
      if (!walletAddress || !walletSignature) {
        throw new Error('Wallet authentication required');
      }
      
      requestHeaders['X-Wallet-Address'] = walletAddress;
      requestHeaders['X-Wallet-Signature'] = walletSignature;
    }

    // Sanitize request body if it exists
    let sanitizedBody = body;
    if (body && typeof body === 'string') {
      try {
        const parsedBody = JSON.parse(body);
        const sanitized = Object.entries(parsedBody).reduce((acc, [key, value]) => {
          acc[key] = typeof value === 'string' ? sanitizeInput(value) : value;
          return acc;
        }, {} as Record<string, any>);
        sanitizedBody = JSON.stringify(sanitized);
      } catch (e) {
        // If body is not JSON, leave it as is
        sanitizedBody = body;
      }
    }

    // Create the request
    const request = new Request(`${this.baseUrl}${endpoint}`, {
      ...restOptions,
      headers: requestHeaders,
      body: sanitizedBody,
    });

    const validation = validateApiRequest(request);
    if (!validation.isValid) {
      throw new Error(validation.error);
    }

    try {
      const response = await fetch(request);
      return this.handleResponse(response);
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  // HTTP Methods
  async get(endpoint: string, options: ApiOptions = {}) {
    return this.makeRequest(endpoint, { ...options, method: 'GET' });
  }

  async post(endpoint: string, data: any, options: ApiOptions = {}) {
    return this.makeRequest(endpoint, {
      ...options,
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async put(endpoint: string, data: any, options: ApiOptions = {}) {
    return this.makeRequest(endpoint, {
      ...options,
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async delete(endpoint: string, options: ApiOptions = {}) {
    return this.makeRequest(endpoint, { ...options, method: 'DELETE' });
  }
}

export const api = new SecureApiClient(); 
