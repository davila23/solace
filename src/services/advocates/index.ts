import { AdvocateService } from './service';

// Export singleton instance for use across the application
export const advocateService = new AdvocateService();

// Re-export types from the service domain
export * from '../../types/advocates';
