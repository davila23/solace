import db from "../../db";
import { users } from "../../db/schema";
import { User } from "../../types/users";
import { eq, and, sql } from "drizzle-orm";
import { createServiceError } from "../../utils/error-handler";

/**
 * Repository class for user data operations
 * Handles database interactions and data retrieval for users
 */
export class UserRepository {
  /**
   * Format database user record to match User interface
   * @param {any} record - Database record
   * @returns {User} Formatted user object
   */
  private formatUser(record: any): User {
    return {
      id: record.id,
      username: record.username,
      passwordHash: record.passwordHash,
      name: record.name,
      role: record.role,
      createdAt: record.createdAt instanceof Date
        ? record.createdAt.toISOString()
        : record.createdAt
          ? new Date(record.createdAt).toISOString()
          : undefined
    };
  }
  /**
   * Find all users in the system
   * @returns {Promise<User[]>} Array of users
   */
  async findAll(): Promise<User[]> {
    try {
      // Get all users from the database
      const result = await db.select()
        .from(users)
        .orderBy(users.id);
      
      // Format user data for consistent types
      return result.map(user => this.formatUser(user));
    } catch (error) {
      throw createServiceError('find all users', error);
    }
  }
  
  /**
   * Find users by role
   * @param {string} role - Role to filter by
   * @returns {Promise<User[]>} Array of users with specified role
   */
  async findByRole(role: string): Promise<User[]> {
    try {
      // Find users with the specified role
      const result = await db.select()
        .from(users)
        .where(eq(users.role, role));
      
      // Format user data for consistent types
      return result.map(user => this.formatUser(user));
    } catch (error) {
      throw createServiceError('find users by role', error, { role });
    }
  }

  /**
   * Find a user by username
   * @param {string} username - Username to search for
   * @returns {Promise<User | null>} User if found, null otherwise
   */
  async findByUsername(username: string): Promise<User | null> {
    try {
      // Try to find the user using the ORM
      const result = await db.select()
        .from(users)
        .where(eq(users.username, username))
        .limit(1);
      
      // Return the first user found or null with proper formatting
      return result[0] ? this.formatUser(result[0]) : null;
    } catch (error) {
      throw createServiceError('find user by username', error, { username });
    }
  }
  
  /**
   * Find a user by ID
   * @param {number} id - User ID to search for
   * @returns {Promise<User | null>} User if found, null otherwise
   */
  async findById(id: number): Promise<User | null> {
    try {
      // Try to find the user using the ORM
      const result = await db.select()
        .from(users)
        .where(eq(users.id, id))
        .limit(1);
      
      // Return the first user found or null with proper formatting
      return result[0] ? this.formatUser(result[0]) : null;
    } catch (error) {
      throw createServiceError('find user by ID', error, { id });
    }
  }
  
  /**
   * Create a new user
   * @param {Partial<User>} userData - User data for creation
   * @returns {Promise<User>} Created user
   */
  async create(userData: Partial<User>): Promise<User> {
    try {
      const dbClient = db as any; // Cast to any to bypass type checking issues
      
      // Check if username already exists
      if (userData.username) {
        const existingUser = await this.findByUsername(userData.username);
        if (existingUser) {
          throw new Error(`Username ${userData.username} already exists`);
        }
      }
      
      // Insert the user
      const now = new Date().toISOString();
      const insertResult = await dbClient.insert(users)
        .values({
          ...userData,
          createdAt: now
        })
        .returning();
      
      return insertResult[0];
    } catch (error) {
      console.error("Error creating user:", error);
      throw error;
    }
  }
  
  /**
   * Update an existing user
   * @param {number} id - User ID to update
   * @param {Partial<User>} userData - User data to update
   * @returns {Promise<User>} Updated user
   */
  async update(id: number, userData: Partial<User>): Promise<User> {
    try {
      const dbClient = db as any; // Cast to any to bypass type checking issues
      
      // Check if user exists
      const existingUser = await this.findById(id);
      if (!existingUser) {
        throw new Error(`User with ID ${id} not found`);
      }
      
      // Check username uniqueness if updating username
      if (userData.username && userData.username !== existingUser.username) {
        const usernameExists = await this.findByUsername(userData.username);
        if (usernameExists) {
          throw new Error(`Username ${userData.username} already exists`);
        }
      }
      
      // Update the user
      const updateResult = await dbClient.update(users)
        .set(userData)
        .where(eq(users.id, id))
        .returning();
      
      return updateResult[0];
    } catch (error) {
      console.error(`Error updating user ${id}:`, error);
      throw error;
    }
  }
  
  /**
   * Delete a user by ID
   * @param {number} id - User ID to delete
   * @returns {Promise<boolean>} Success indicator
   */
  async delete(id: number): Promise<boolean> {
    try {
      const dbClient = db as any; // Cast to any to bypass type checking issues
      
      // Check if user exists
      const existingUser = await this.findById(id);
      if (!existingUser) {
        return false;
      }
      
      // Delete the user
      await dbClient.delete(users)
        .where(eq(users.id, id));
      
      return true;
    } catch (error) {
      console.error(`Error deleting user ${id}:`, error);
      throw error;
    }
  }
}
