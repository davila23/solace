/**
 * Environment variables configuration
 * 
 * Centralized environment variable management following Next.js best practices
 * This helps with type safety and organizing all environment access in one place
 */

// Database Configuration
export const DATABASE_URL = process.env.DATABASE_URL || 'postgresql://postgres:password@localhost/solaceassignment';
export const RESET_DATABASE = process.env.RESET_DATABASE === 'true';

// Authentication Configuration
export const JWT_SECRET = process.env.JWT_SECRET || 'solace-assignment-secret-key';
export const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '24h';

// API Configuration
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '';
export const API_DEFAULT_PAGE_SIZE = 10;
export const API_MAX_PAGE_SIZE = 100;

// Environment Detection
export const IS_DEVELOPMENT = process.env.NODE_ENV === 'development';
export const IS_PRODUCTION = process.env.NODE_ENV === 'production';
export const IS_TEST = process.env.NODE_ENV === 'test';

/**
 * Validate required environment variables
 * Important for catching configuration issues early
 */
export function validateEnvironment(): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  // Add critical checks here if needed
  // Example: if (!DATABASE_URL) errors.push('DATABASE_URL is required');
  
  return {
    valid: errors.length === 0,
    errors
  };
}
