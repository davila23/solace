/**
 * Role-based permission management
 * @module lib/auth/roles
 */

import { Role } from './types';

/**
 * Permission structure for different actions in the application
 */
interface Permission {
  read: Role[];
  create: Role[];
  update: Role[];
  delete: Role[];
}

/**
 * Permissions configuration for various resources
 * This defines which roles can perform which actions on each resource
 */
export const permissions: Record<string, Permission> = {
  advocates: {
    read: [Role.ADMIN, Role.USER],
    create: [Role.ADMIN],
    update: [Role.ADMIN],
    delete: [Role.ADMIN]
  },
  users: {
    read: [Role.ADMIN],
    create: [Role.ADMIN],
    update: [Role.ADMIN],
    delete: [Role.ADMIN]
  }
};

/**
 * Check if a user has permission for a specific action on a resource
 * @param role User role
 * @param resource Resource name
 * @param action Action type (read, create, update, delete)
 * @returns Boolean indicating if the user has permission
 */
export const hasPermission = (
  role: Role, 
  resource: string, 
  action: keyof Permission
): boolean => {
  const resourcePermissions = permissions[resource];
  if (!resourcePermissions) {
    return false;
  }
  
  return resourcePermissions[action].includes(role);
};

/**
 * Check if a user has one of the specified roles
 * @param token The decoded authentication token containing user role
 * @param allowedRoles Array of roles that are allowed
 * @returns Boolean indicating if the user has one of the allowed roles
 */
export const checkRole = (
  token: { role: Role } | null, 
  allowedRoles: Role[]
): boolean => {
  if (!token || !token.role) {
    return false;
  }
  
  return allowedRoles.includes(token.role);
};
