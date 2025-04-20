/**
 * API Response utilities
 * Standardized response formatters for API routes
 */

import { NextResponse } from 'next/server';

/**
 * Create a success response with standardized format
 * @param data - The data to include in the response
 * @param status - HTTP status code (default: 200)
 * @returns Formatted NextResponse
 */
export const successResponse = (data: any, status = 200): NextResponse => {
  return NextResponse.json(
    { success: true, data },
    { status }
  );
};

/**
 * Create an error response with standardized format
 * @param message - Error message
 * @param status - HTTP status code (default: 500)
 * @param details - Optional additional error details
 * @returns Formatted NextResponse
 */
export const errorResponse = (
  message: string, 
  status = 500, 
  details?: Record<string, any>
): NextResponse => {
  return NextResponse.json(
    { 
      success: false, 
      error: {
        message,
        ...(details ? { details } : {})
      }
    },
    { status }
  );
};

/**
 * Handle service errors and convert to appropriate API responses
 * @param error - The caught error
 * @returns Formatted error response
 */
export const handleApiError = (error: unknown): NextResponse => {
  console.error('API Error:', error);
  
  // If it's already an Error object
  if (error instanceof Error) {
    // Check for specific error types from our service layer
    if (error.message.includes('not found')) {
      return errorResponse(error.message, 404);
    }
    
    if (error.message.includes('already exists') || error.message.includes('already taken')) {
      return errorResponse(error.message, 409);
    }
    
    return errorResponse(error.message);
  }
  
  // For non-Error objects
  return errorResponse('An unexpected error occurred');
};
