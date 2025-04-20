/**
 * Authentication and authorization types
 * @module lib/auth/types
 */

/**
 * User roles in the system
 */
export enum Role {
  ADMIN = 'admin',
  USER = 'user'
}

/**
 * User interface for representing system users
 */
export interface User {
  id: number;
  username: string;
  passwordHash: string;
  role: Role;
  name: string;
  createdAt?: string; // Campo opcional para la fecha de creación
}

/**
 * JWT token payload structure
 */
export interface AuthToken {
  userId: number;
  username: string;
  role: Role;
  iat?: number;
  exp?: number;
}
