import db from "../../db";
import { advocates } from "../../db/schema";
import { eq, sql } from "drizzle-orm";
import { Advocate, AdvocateQueryResult } from "../../types/advocates";
import { PaginationParams } from "../../types/common/pagination";
import { API_DEFAULT_PAGE_SIZE, API_MAX_PAGE_SIZE } from "../../lib/env";

/**
 * Repository class for advocate data operations
 * Handles database interactions and data retrieval
 */
export class AdvocateRepository {
  /**
   * Find all advocates in the database
   * This is a simplified method that just returns all advocates
   * The filtering, sorting, and pagination is handled at the service layer
   * @returns {Promise<any[]>} Raw database records for advocates
   */
  async findAll(): Promise<any[]> {
    try {
      return await db.select().from(advocates).execute();
    } catch (error) {
      throw new Error(`Error retrieving advocates: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
  
  /**
   * Execute a query with where conditions
   * @param whereClause - SQL where clause
   * @param limit - Number of records to return
   * @param offset - Offset for pagination
   * @returns {Promise<any[]>} - Raw advocate database records
   */
  async findWithFilters(whereClause: any, limit: number, offset: number): Promise<any[]> {
    try {
      return await db.select()
        .from(advocates)
        .where(whereClause || undefined)
        .limit(limit)
        .offset(offset)
        .execute();
    } catch (error) {
      throw new Error(`Error retrieving advocates with filters: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
  
  /**
   * Count advocates matching a where clause
   * @param whereClause - SQL where clause
   * @returns {Promise<number>} - Count of matching records
   */
  async countWithFilters(whereClause: any): Promise<number> {
    try {
      const result = await db.select({ count: sql`count(*)` })
        .from(advocates)
        .where(whereClause || undefined)
        .execute();
      
      return Number(result[0]?.count || 0);
    } catch (error) {
      throw new Error(`Error counting advocates: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
  
  /**
   * Find advocate by ID
   * @param {number} id - Advocate ID
   * @returns {Promise<Advocate | null>} Advocate data or null if not found
   */
  async findById(id: number): Promise<Advocate | null> {
    try {
      const result = await db.select()
        .from(advocates)
        .where(eq(advocates.id, id))
        .execute();
      
      if (result.length === 0) {
        return null;
      }
      
      const advocate = result[0];
      
      // Normalize specialties field
      return {
        id: advocate.id,
        firstName: advocate.firstName,
        lastName: advocate.lastName,
        city: advocate.city,
        degree: advocate.degree,
        specialties: Array.isArray(advocate.specialties) 
          ? advocate.specialties 
          : typeof advocate.specialties === 'string' 
            ? [advocate.specialties] 
            : [],
        yearsOfExperience: advocate.yearsOfExperience,
        phoneNumber: advocate.phoneNumber,
        createdAt: advocate.createdAt instanceof Date
          ? advocate.createdAt.toISOString()
          : advocate.createdAt
            ? new Date(advocate.createdAt).toISOString()
            : undefined
      };
    } catch (error) {
      console.error("Database error:", error);
      throw new Error(`Error finding advocate with ID ${id}: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
  

}
