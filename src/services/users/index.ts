import { UserService } from './service';

// Export singleton instance for use across the application
export const userService = new UserService();

// Re-export types
export * from '../../types/users';
