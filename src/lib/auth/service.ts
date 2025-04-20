/**
 * Authentication service
 * Contains business logic for authentication and user management
 */

import { sql } from 'drizzle-orm';
import db from '../../db';
import { users } from '../../db/schema';
import { User, Role } from './types';

/**
 * Service for authentication-related operations
 * Implements business logic for user authentication
 */
export class AuthService {
  /**
   * Get a user by username
   * @param {string} username - Username to search for
   * @returns {Promise<User | null>} User object if found, null otherwise
   */
  async getUserByUsername(username: string): Promise<User | null> {
    try {
      // Utilizar el ORM de manera estándar con un enfoque tipado
      const result = await db
        .select()
        .from(users)
        .where(sql`username = ${username}`)
        .limit(1)
        .execute();
      
      // Normalizar el formato de salida
      if (result.length === 0) {
        return null;
      }
      
      const user = result[0];
      return {
        id: user.id,
        username: user.username,
        passwordHash: user.passwordHash,
        role: user.role as Role, // Asegurar que el tipo coincide con el enum Role
        name: user.name,
        createdAt: user.createdAt instanceof Date 
          ? user.createdAt.toISOString() 
          : typeof user.createdAt === 'string' 
            ? user.createdAt 
            : undefined
      };
    } catch (error) {
      console.error('Error getting user by username:', error);
      return null;
    }
  }
  
  /**
   * Verify a password against a hash
   * @param {string} password - Plain text password
   * @param {string} hash - Password hash to compare against
   * @returns {boolean} True if password matches the hash
   */
  verifyPassword(password: string, hash: string): boolean {
    // In production, this would use bcrypt.compare or similar
    // This is a simplified implementation for demonstration purposes
    const calculatedHash = `hash_${password}`;
    return calculatedHash === hash;
  }
  
  /**
   * Authenticate a user
   * @param {string} username - Username
   * @param {string} password - Plain text password
   * @returns {Promise<User | null>} User object if authentication successful, null otherwise
   */
  async authenticate(username: string, password: string): Promise<User | null> {
    const user = await this.getUserByUsername(username);
    
    if (!user) {
      return null;
    }
    
    const isValid = this.verifyPassword(password, user.passwordHash);
    
    return isValid ? user : null;
  }
}

// Export singleton instance
export const authService = new AuthService();
