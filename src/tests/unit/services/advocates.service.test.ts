import { AdvocateService } from '../../../services/advocates/service';
import { AdvocateRepository } from '../../../repositories/advocates/repository';
import { PaginationParams } from '../../../types/common/pagination';

// Repository mock
jest.mock('../../../repositories/advocates/repository');

describe('AdvocateService', () => {
  let service: AdvocateService;
  let mockRepository: jest.Mocked<AdvocateRepository>;

  // Test data
  const mockAdvocateData = {
    id: 1,
    firstName: 'John',
    lastName: 'Doe',
    city: 'New York',
    degree: 'MD',
    specialties: ['Cardiology', 'Internal Medicine'],
    yearsOfExperience: 10,
    phoneNumber: 1234567890,
    createdAt: new Date('2023-01-01').toISOString()
  };

  beforeEach(() => {
    // Clear all mocks between tests
    jest.clearAllMocks();
    
    // Configure repository mock
    mockRepository = {
      findAll: jest.fn(),
      findWithFilters: jest.fn(),
      countWithFilters: jest.fn(),
      findById: jest.fn(),
    } as unknown as jest.Mocked<AdvocateRepository>;
    
    // Get AdvocateRepository class to replace with our mock
    const RepositoryMock = AdvocateRepository as jest.MockedClass<typeof AdvocateRepository>;
    RepositoryMock.mockImplementation(() => mockRepository);
    
    // Create service instance with mocked repository
    service = new AdvocateService();
  });

  describe('getAdvocates', () => {
    it('should validate and normalize pagination parameters', async () => {
      // Set up repository mock responses
      mockRepository.findWithFilters.mockResolvedValue([mockAdvocateData]);
      mockRepository.countWithFilters.mockResolvedValue(1);

      // Call method with invalid parameters to test normalization
      const params: PaginationParams = {
        page: -1,  // Invalid value that should be normalized to 1
        limit: 1000, // Invalid value that should be limited to API_MAX_PAGE_SIZE
        search: 'test',
        specialty: 'Cardiology',
        city: 'New York'
      };

      const result = await service.getAdvocates(params);

      // Verify response contains normalized data
      expect(result.pagination.page).toBe(1); // Should be normalized to 1
      expect(result.pagination.limit).toBeLessThanOrEqual(100); // Maximum value
      expect(result.data).toHaveLength(1);
      expect(result.data[0]).toHaveProperty('firstName', 'John');
    });

    it('should handle empty filter parameters correctly', async () => {
      // Set up repository mock responses
      mockRepository.findWithFilters.mockResolvedValue([mockAdvocateData]);
      mockRepository.countWithFilters.mockResolvedValue(1);

      // Call method with minimal parameters
      const params: PaginationParams = {
        page: 1,
        limit: 10
      };

      const result = await service.getAdvocates(params);

      // Verify the response is correct
      expect(result.pagination.total).toBe(1);
      expect(result.pagination.page).toBe(1);
      expect(result.data).toHaveLength(1);
    });
  });

  describe('getAdvocatesFromRequest', () => {
    it('should extract query parameters correctly from request', async () => {
      // Set up repository mock responses
      mockRepository.findWithFilters.mockResolvedValue([mockAdvocateData]);
      mockRepository.countWithFilters.mockResolvedValue(1);

      // Create a Request mock with URL and searchParams
      const mockRequest = {
        url: 'http://localhost:3000/api/advocates?page=2&limit=5&search=John&specialty=Cardiology&city=New%20York'
      } as Request;

      const result = await service.getAdvocatesFromRequest(mockRequest);

      // Verify parameters were extracted correctly
      expect(mockRepository.findWithFilters).toHaveBeenCalled();
      expect(result.pagination.page).toBe(2);
      expect(result.pagination.limit).toBe(5);
      expect(result.data).toHaveLength(1);
    });

    it('should handle requests with no query parameters', async () => {
      // Set up repository mock responses
      mockRepository.findWithFilters.mockResolvedValue([mockAdvocateData]);
      mockRepository.countWithFilters.mockResolvedValue(1);

      // Create a Request mock without query parameters
      const mockRequest = {
        url: 'http://localhost:3000/api/advocates'
      } as Request;

      const result = await service.getAdvocatesFromRequest(mockRequest);

      // Verify default values were used
      expect(result.pagination.page).toBe(1); // Default value
      expect(result.pagination.limit).toBe(10); // Default value
      expect(result.data).toHaveLength(1);
    });
  });

  describe('formatAdvocateData', () => {
    it('should format database records correctly', async () => {
      // Create object with database format that needs normalization
      const dbRecord = {
        id: 1,
        firstName: 'John',
        lastName: 'Doe',
        city: 'New York',
        degree: 'MD',
        specialties: JSON.stringify(['Cardiology', 'Internal Medicine']), // JSON string instead of array
        yearsOfExperience: 10,
        phoneNumber: 1234567890,
        createdAt: new Date('2023-01-01')
      };

      // Access private method using testing technique
      const result = (service as any).formatAdvocateData(dbRecord);

      // Verify data was normalized correctly
      expect(result.id).toBe(1);
      expect(result.firstName).toBe('John');
      expect(result.lastName).toBe('Doe');
      expect(Array.isArray(result.specialties)).toBe(true);
      expect(result.createdAt).toBe('2023-01-01T00:00:00.000Z');
    });

    it('should handle null or undefined values', async () => {
      // Create object with some null or undefined values
      const dbRecord = {
        id: 1,
        firstName: 'John',
        lastName: 'Doe',
        city: 'New York',
        degree: 'MD',
        specialties: null, // Null value
        yearsOfExperience: 10,
        phoneNumber: 1234567890,
        createdAt: undefined // Undefined value
      };

      // Access private method
      const result = (service as any).formatAdvocateData(dbRecord);

      // Verify data was normalized correctly handling null values
      expect(result.id).toBe(1);
      expect(Array.isArray(result.specialties)).toBe(true);
      expect(result.specialties).toHaveLength(0); // Empty array for null
      expect(result.createdAt).toBeUndefined(); // undefined for undefined
    });
  });
});
