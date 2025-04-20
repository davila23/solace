/**
 * Authentication middleware utilities
 * Centralized functions for handling authentication and authorization in API routes
 */

import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from './jwt';
import { Role } from './types';

/**
 * Verify if the request is authenticated
 * @param request - The Next.js request object
 * @returns Response with error or null if authenticated
 */
export const requireAuth = (request: NextRequest): { error: NextResponse } | null => {
  const token = request.cookies.get('auth-token')?.value;
  
  if (!token) {
    return {
      error: NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    };
  }
  
  try {
    const decodedToken = verifyToken(token);
    if (!decodedToken) {
      return {
        error: NextResponse.json({ error: 'Invalid authentication token' }, { status: 401 })
      };
    }
    
    return null; // No error, authenticated successfully
  } catch (error) {
    return {
      error: NextResponse.json({ error: 'Authentication failed' }, { status: 401 })
    };
  }
};

/**
 * Verify if the request is from an admin user
 * @param request - The Next.js request object
 * @returns Response with error or null if authorized as admin
 */
export const requireAdmin = (request: NextRequest): { error: NextResponse } | { 
  error: NextResponse, 
  userId?: number 
} | null => {
  // First check authentication
  const authResult = requireAuth(request);
  if (authResult) {
    return authResult;
  }
  
  // Then check admin role
  const token = request.cookies.get('auth-token')?.value;
  const decodedToken = verifyToken(token!);
  
  if (decodedToken?.role !== Role.ADMIN) {
    return {
      error: NextResponse.json(
        { error: 'Forbidden: Admin access required' }, 
        { status: 403 }
      ),
      userId: decodedToken?.userId
    };
  }
  
  return null; // No error, authorized as admin
};

/**
 * Gets the authenticated user ID from a request
 * @param request - The Next.js request object
 * @returns User ID or null if not authenticated
 */
export const getAuthenticatedUserId = (request: NextRequest): number | null => {
  const token = request.cookies.get('auth-token')?.value;
  if (!token) return null;
  
  try {
    const decodedToken = verifyToken(token);
    return decodedToken?.userId || null;
  } catch (error) {
    return null;
  }
};
