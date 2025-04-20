import { AdvocateRepository } from './repository';

// Export singleton instance for use across the application
export const advocateRepository = new AdvocateRepository();

// Re-export types from repository
export * from '../../types/advocates';
