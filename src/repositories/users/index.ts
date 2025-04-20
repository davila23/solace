import { UserRepository } from './repository';

// Export singleton instance for use across the application
export const userRepository = new UserRepository();

// Re-export types
export * from '../../types/users';
