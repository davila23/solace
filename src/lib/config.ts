/**
 * Environment configuration
 * 
 * Centralized configuration management following Next.js best practices
 * https://nextjs.org/docs/basic-features/environment-variables
 */

// Database configuration
export const DB_CONFIG = {
  url: process.env.DATABASE_URL || 'postgresql://postgres:password@localhost/solaceassignment',
  reset: process.env.RESET_DATABASE === 'true',
  debug: process.env.DB_DEBUG === 'true',
}

// Authentication configuration
export const AUTH_CONFIG = {
  jwtSecret: process.env.JWT_SECRET || 'solace-assignment-secret-key',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '24h',
  cookieName: 'auth-token',
}

// API configuration
export const API_CONFIG = {
  baseUrl: process.env.NEXT_PUBLIC_API_URL || '',
  defaultPageSize: 10,
  maxPageSize: 100,
}

// Application mode
export const IS_DEVELOPMENT = process.env.NODE_ENV === 'development'
export const IS_PRODUCTION = process.env.NODE_ENV === 'production'
export const IS_TEST = process.env.NODE_ENV === 'test'

/**
 * Safe environment variable getter
 * 
 * @param key Environment variable key
 * @param defaultValue Optional default value
 * @returns Environment variable value or default
 */
export function getEnv(key: string, defaultValue: string = ''): string {
  return process.env[key] || defaultValue;
}

/**
 * Get a required environment variable
 * Throws an error if the variable is not defined
 * 
 * @param key Environment variable key
 * @returns Environment variable value
 * @throws Error if variable is not defined
 */
export function getRequiredEnv(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Environment variable ${key} is required but not defined`);
  }
  return value;
}
