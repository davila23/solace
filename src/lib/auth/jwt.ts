/**
 * JWT utilities for authentication
 * @module lib/auth/jwt
 */

// This is a placeholder implementation since we couldn't install the jsonwebtoken package
// Normally we would use the actual library, but for demonstration purposes we'll implement a simplified version
// In a real application, please use the proper jsonwebtoken library

import { AuthToken } from './types';
import { JWT_SECRET, JWT_EXPIRES_IN } from '../env';

// Convert JWT_EXPIRES_IN from string format (like '24h') to seconds
const expiresInSeconds = (): number => {
  const expiresIn = JWT_EXPIRES_IN;
  if (typeof expiresIn === 'string') {
    if (expiresIn.endsWith('h')) {
      return parseInt(expiresIn, 10) * 3600; // hours to seconds
    } else if (expiresIn.endsWith('m')) {
      return parseInt(expiresIn, 10) * 60; // minutes to seconds
    } else if (expiresIn.endsWith('d')) {
      return parseInt(expiresIn, 10) * 86400; // days to seconds
    } else {
      return parseInt(expiresIn, 10); // assume seconds
    }
  }
  return 86400; // default: 24 hours in seconds
}

/**
 * Generate a JWT token for authentication
 * @param payload User data to encode in the token
 * @returns JWT token string
 */
export const generateToken = (payload: AuthToken): string => {
  try {
    // Simple base64 encoding for demo purposes
    // In production, use proper JWT library
    const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
    const now = Math.floor(Date.now() / 1000);
    const encodedPayload = btoa(JSON.stringify({
      ...payload,
      iat: now,
      exp: now + expiresInSeconds()
    }));
    
    // Create a more secure signature (still simplified for demo)
    const dataToSign = `${header}.${encodedPayload}`;
    const signature = btoa(
      JSON.stringify({ 
        secret: JWT_SECRET,
        data: dataToSign,
        timestamp: now
      })
    );
    
    return `${header}.${encodedPayload}.${signature}`;
  } catch (error) {
    console.error('Error generating token:', error);
    throw new Error('Failed to generate authentication token');
  }
};

/**
 * Verify a JWT token
 * @param token JWT token string
 * @returns Decoded token payload or null if invalid
 */
export const verifyToken = (token: string): AuthToken | null => {
  try {
    // Simple verification for demo purposes
    // In production, use proper JWT library
    const [header, payload, signature] = token.split('.');
    if (!header || !payload || !signature) {
      return null;
    }
    
    // Decode payload
    const decodedPayload = JSON.parse(atob(payload)) as AuthToken;
    
    // Check expiration
    if (decodedPayload.exp && decodedPayload.exp < Math.floor(Date.now() / 1000)) {
      return null; // Token expired
    }
    
    return decodedPayload;
  } catch (error) {
    console.error('Error verifying token:', error);
    return null;
  }
};

/**
 * Verify a request's auth token and return the decoded token
 * @param request The Next.js request object
 * @returns Object with success status and decoded token if successful
 */
export const verifyAuth = async (request: { cookies: { get: (name: string) => { value?: string } | undefined } }) => {
  try {
    // Get token from cookies
    const tokenCookie = request.cookies.get('auth-token');
    if (!tokenCookie || !tokenCookie.value) {
      return { success: false, token: null };
    }
    
    // Verify token
    const token = verifyToken(tokenCookie.value);
    if (!token) {
      return { success: false, token: null };
    }
    
    return { success: true, token };
  } catch (error) {
    console.error('Auth verification error:', error);
    return { success: false, token: null };
  }
};

// Helper function for browser environment
function btoa(str: string): string {
  if (typeof window !== 'undefined') {
    return window.btoa(str);
  }
  return Buffer.from(str).toString('base64');
}

// Helper function for browser environment
function atob(str: string): string {
  if (typeof window !== 'undefined') {
    return window.atob(str);
  }
  return Buffer.from(str, 'base64').toString();
}
