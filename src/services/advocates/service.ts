import { Advocate, AdvocateQueryResult } from '../../types/advocates';
import { PaginationParams } from '../../types/common/pagination';
import db from '../../db';
import { advocates } from '../../db/schema';
import { sql, and, or, eq, ilike } from 'drizzle-orm';
import { createServiceError } from '../../utils/error-handler';
import { AdvocateRepository } from '../../repositories/advocates/repository';

// Type for creating a new advocate (omit generated fields)
type AdvocateData = Omit<Advocate, 'id' | 'createdAt'>;

// Type for updating an advocate (all fields optional)
type UpdateAdvocateData = Partial<AdvocateData>;

export class AdvocateService {
  private advocateRepository = new AdvocateRepository();
  
  /**
   * Get a specific advocate by ID
   * @param {number} id - Advocate ID
   * @returns {Promise<Advocate | null>} Advocate or null if not found
   */
  async getAdvocateById(id: number): Promise<Advocate | null> {
    try {
      return await this.advocateRepository.findById(id);
    } catch (error) {
      throw createServiceError('find advocate by ID', error, { id });
    }
  }
  
  /**
   * Extracts query parameters from request and fetches advocates
   * @param {Request} request - HTTP request object
   * @returns {Promise<AdvocateQueryResult>} Paginated advocates result
   */
  async getAdvocatesFromRequest(request: Request): Promise<AdvocateQueryResult> {
    // Parses and validates URL query parameters
    const params = this.extractQueryParams(request);
    
    // Executes main advocate search method
    return this.getAdvocates(params);
  }
  
  /**
   * Extracts and validates query parameters from a request URL
   * @param {Request} request - The HTTP request object
   * @returns {PaginationParams} Validated pagination parameters
   */
  private extractQueryParams(request: Request): PaginationParams {
    const { searchParams } = new URL(request.url);
    
    // Retrieves query parameters from URL
    const params: PaginationParams = {
      page: parseInt(searchParams.get('page') || '1'),
      limit: parseInt(searchParams.get('limit') || '10'),
      search: searchParams.get('search') || '',
      specialty: searchParams.get('specialty') || '',
      city: searchParams.get('city') || '',
      sortBy: searchParams.get('sortBy') || 'lastName',
      sortOrder: (searchParams.get('sortOrder') || 'asc') as 'asc' | 'desc'
    };
    
    // Validate and normalize parameters
    return this.validateQueryParams(params);
  }
  /**
   * Get advocates with filtering and pagination
   */
  async getAdvocates(params: PaginationParams): Promise<AdvocateQueryResult> {
    try {
      // Validate and normalize parameters
      const validParams = this.validateQueryParams(params);
      const { page, limit, search, specialty, city, sortBy, sortOrder } = validParams;
      const offset = (page - 1) * limit;
      
      // Build the where conditions array
      const conditions = [];
      
      if (search) {
        conditions.push(
          or(
            ilike(advocates.firstName, `%${search}%`),
            ilike(advocates.lastName, `%${search}%`)
          )
        );
      }
      
      if (specialty) {
        conditions.push(sql`${advocates.specialties}::text ILIKE ${`%${specialty}%`}`);
      }
      
      if (city) {
        conditions.push(ilike(advocates.city, `%${city}%`));
      }
      
      // Combine all conditions with AND logic
      const whereClause = conditions.length > 0 ? and(...conditions) : undefined;
      
      // Use the repository to get data and count
      const [advocateRecords, total] = await Promise.all([
        this.advocateRepository.findWithFilters(whereClause, limit, offset),
        this.advocateRepository.countWithFilters(whereClause)
      ]);
      
      // Format the data for API consumption
      const data = advocateRecords.map((item: any) => this.formatAdvocateData(item));
      
      return {
        data,
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit) || 1
        }
      };
    } catch (error) {
      throw createServiceError('retrieve advocates', error, { params });
    }
  }
  
  /**
   * Creates a new advocate
   */
  async createAdvocate(advocateData: AdvocateData): Promise<Advocate> {
    try {
      // Insert with Drizzle ORM
      const result = await db.insert(advocates).values({
        firstName: advocateData.firstName,
        lastName: advocateData.lastName,
        city: advocateData.city,
        degree: advocateData.degree,
        specialties: advocateData.specialties,
        yearsOfExperience: advocateData.yearsOfExperience,
        phoneNumber: advocateData.phoneNumber,
        createdAt: new Date()
      }).returning().execute();
      
      // Format response for API
      return this.formatAdvocateData(result[0]);
    } catch (error) {
      throw createServiceError('create advocate', error);
    }
  }
  
  /**
   * Updates an existing advocate
   */
  async updateAdvocate(id: number, updateData: UpdateAdvocateData): Promise<Advocate> {
    try {
      // If no fields to update, return existing advocate
      if (Object.keys(updateData).length === 0) {
        const result = await db.select().from(advocates).where(eq(advocates.id, id)).execute();
        if (!result[0]) {
          throw new Error(`Advocate with ID ${id} not found`);
        }
        return this.formatAdvocateData(result[0]);
      }
      
      const result = await db.update(advocates)
        .set(updateData)
        .where(eq(advocates.id, id))
        .returning()
        .execute();
      
      if (!result[0]) {
        throw new Error(`Advocate with ID ${id} not found`);
      }
      
      return this.formatAdvocateData(result[0]);
    } catch (error) {
      throw createServiceError('update advocate', error, { id });
    }
  }
  
  /**
   * Deletes an advocate by ID
   */
  async deleteAdvocate(id: number): Promise<boolean> {
    try {
      const result = await db.delete(advocates)
        .where(eq(advocates.id, id))
        .returning({ id: advocates.id })
        .execute();
        
      return result.length > 0;
    } catch (error) {
      throw createServiceError('delete advocate', error, { id });
    }
  }
  
  /**
   * Helper to format database records into Advocate API type
   */
  private formatAdvocateData(record: any): Advocate {
    return {
      ...record,
      specialties: Array.isArray(record.specialties) ? record.specialties : [],
      createdAt: record.createdAt ? new Date(record.createdAt).toISOString() : undefined
    } as Advocate;
  }

  /**
   * Validates and normalizes pagination parameters
   */
  private validateQueryParams(params: PaginationParams): PaginationParams {
    const validParams: PaginationParams = { ...params };
    
    // Safety bounds for pagination
    validParams.page = Math.max(1, Number(validParams.page) || 1);
    validParams.limit = Math.min(Math.max(1, Number(validParams.limit) || 10), 100);
    
    // Sanitize search inputs
    if (validParams.search) validParams.search = String(validParams.search).trim();
    if (validParams.specialty) validParams.specialty = String(validParams.specialty).trim();
    if (validParams.city) validParams.city = String(validParams.city).trim();
    
    return validParams;
  }
}
