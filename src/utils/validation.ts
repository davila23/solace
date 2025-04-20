/**
 * Validation utilities
 * Centralized functions for validating data and request payloads
 */

import { NextResponse } from 'next/server';

/**
 * Validate required fields in an object
 * @param data - The data object to validate
 * @param requiredFields - Array of required field names
 * @returns Error response or null if valid
 */
export const validateRequiredFields = (
  data: Record<string, any>, 
  requiredFields: string[]
): { error: NextResponse } | null => {
  const missingFields = requiredFields.filter(field => {
    const value = data[field];
    
    // Check for undefined, null, empty string
    if (value === undefined || value === null || value === '') {
      return true;
    }
    
    // Check for empty arrays
    if (Array.isArray(value) && value.length === 0) {
      return true;
    }
    
    return false;
  });
  
  if (missingFields.length > 0) {
    return {
      error: NextResponse.json(
        { 
          error: 'Missing required fields', 
          fields: missingFields 
        }, 
        { status: 400 }
      )
    };
  }
  
  return null; // No error, validation passed
};

/**
 * Validate advocate data
 * @param data - The advocate data to validate
 * @returns Error response or null if valid
 */
export const validateAdvocateData = (data: Record<string, any>): { error: NextResponse } | null => {
  return validateRequiredFields(
    data, 
    ['firstName', 'lastName', 'city', 'degree', 'specialties', 'yearsOfExperience', 'phoneNumber']
  );
};

/**
 * Validate user data
 * @param data - The user data to validate
 * @returns Error response or null if valid
 */
export const validateUserData = (data: Record<string, any>): { error: NextResponse } | null => {
  return validateRequiredFields(
    data, 
    ['username', 'password', 'name', 'role']
  );
};
