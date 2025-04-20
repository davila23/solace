import { AuthService } from './service';

// Export singleton instance for use across the application
export const authService = new AuthService();

// Re-export types
export * from '../../types/users';
