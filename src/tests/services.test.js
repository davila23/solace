/**
 * @jest-environment node
 */

import { findAllAdvocates, findAdvocateById } from '../services/advocates';
import { advocateRepository } from '../repositories/advocates';

// Mock repositories to avoid actual database calls
jest.mock('../repositories/advocates', () => ({
  advocateRepository: {
    findAll: jest.fn(),
    findById: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  }
}));

describe('Advocate Services', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('findAllAdvocates', () => {
    test('should return paginated advocates with proper filtering', async () => {
      // Mock data
      const mockAdvocates = [
        { id: 1, firstName: 'John', lastName: 'Doe', specialties: ['Cardiology'] },
        { id: 2, firstName: 'Jane', lastName: 'Smith', specialties: ['Oncology'] }
      ];
      
      const mockPagination = {
        total: 2,
        page: 1,
        limit: 10,
        totalPages: 1
      };
      
      // Setup mock response
      advocateRepository.findAll.mockResolvedValue({
        data: mockAdvocates,
        pagination: mockPagination
      });
      
      // Execute service
      const result = await findAllAdvocates({
        page: 1,
        limit: 10,
        search: '',
        specialty: '',
        city: ''
      });
      
      // Assertions
      expect(advocateRepository.findAll).toHaveBeenCalledTimes(1);
      expect(advocateRepository.findAll).toHaveBeenCalledWith({
        page: 1,
        limit: 10,
        search: '',
        specialty: '',
        city: ''
      });
      expect(result).toEqual({
        data: mockAdvocates,
        pagination: mockPagination
      });
    });
    
    test('should handle empty result set properly', async () => {
      // Setup mock response for empty results
      advocateRepository.findAll.mockResolvedValue({
        data: [],
        pagination: {
          total: 0,
          page: 1,
          limit: 10,
          totalPages: 0
        }
      });
      
      // Execute service with search that will find nothing
      const result = await findAllAdvocates({
        page: 1,
        limit: 10,
        search: 'NonExistingName',
      });
      
      // Assertions
      expect(result.data).toHaveLength(0);
      expect(result.pagination.total).toBe(0);
    });
  });
  
  describe('findAdvocateById', () => {
    test('should return advocate when found by ID', async () => {
      const mockAdvocate = {
        id: 1,
        firstName: 'John',
        lastName: 'Doe',
        specialties: ['Cardiology'],
        city: 'New York',
        degree: 'MD',
        yearsOfExperience: 10,
        phoneNumber: 1234567890
      };
      
      // Setup mock
      advocateRepository.findById.mockResolvedValue(mockAdvocate);
      
      // Execute service
      const result = await findAdvocateById(1);
      
      // Assertions
      expect(advocateRepository.findById).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockAdvocate);
    });
    
    test('should return null when advocate not found', async () => {
      // Setup mock for not found
      advocateRepository.findById.mockResolvedValue(null);
      
      // Execute service
      const result = await findAdvocateById(999);
      
      // Assertions
      expect(advocateRepository.findById).toHaveBeenCalledWith(999);
      expect(result).toBeNull();
    });
  });
});
