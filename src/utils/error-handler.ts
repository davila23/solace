/**
 * Centralized error handling utilities
 */

/**
 * Creates a standardized error with optional context data
 */
export function createServiceError(
  operation: string,
  error: unknown,
  context?: Record<string, any>
): Error {
  const errorMessage = error instanceof Error ? error.message : 'Unknown error';
  const baseMessage = `Failed to ${operation}: ${errorMessage}`;
  
  // Log error with context for better debugging
  console.error(`Service error: ${baseMessage}`, { 
    context,
    originalError: error 
  });
  
  return new Error(baseMessage);
}
