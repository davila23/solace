import { userRepository } from "../../repositories/users";
import { CreateUserData, UpdateUserData, User, UserInfo } from "../../types/users";
import { hashPassword } from "../../lib/auth/utils";

/**
 * Service class for user-related business logic
 */
export class UserService {
  /**
   * Get all users with pagination and search
   * @param {Object} options - Query options
   * @param {number} options.page - Page number (1-indexed)
   * @param {number} options.limit - Items per page
   * @param {string} options.search - Search term for username or name
   * @returns {Promise<{users: UserInfo[], total: number, page: number, limit: number}>} Paginated users
   */
  async getUsers(options?: { page?: number, limit?: number, search?: string }): Promise<{ users: UserInfo[], total: number, page: number, limit: number }> {
    try {
      const page = options?.page || 1;
      const limit = options?.limit || 10;
      const search = options?.search || '';
      
      // Get all users from the repository
      const users = await userRepository.findAll();
      
      // Apply search filter if provided
      let filteredUsers = users;
      if (search) {
        const searchLower = search.toLowerCase();
        filteredUsers = users.filter(user => 
          user.username.toLowerCase().includes(searchLower) || 
          user.name.toLowerCase().includes(searchLower)
        );
      }
      
      // Calculate pagination
      const total = filteredUsers.length;
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const paginatedUsers = filteredUsers.slice(startIndex, endIndex);
      
      // Return paginated result
      return {
        users: paginatedUsers.map(user => this.getUserInfo(user)),
        total,
        page,
        limit
      };
    } catch (error) {
      console.error("Error getting users:", error);
      return { users: [], total: 0, page: 1, limit: 10 };
    }
  }

  /**
   * Get user information by ID
   * @param {number} id - User ID
   * @returns {Promise<UserInfo | null>} User info if found, null otherwise
   */
  async getUserById(id: number): Promise<UserInfo | null> {
    try {
      const user = await userRepository.findById(id);
      
      if (!user) {
        return null;
      }
      
      // Return user info without sensitive data
      return this.getUserInfo(user);
    } catch (error) {
      console.error("Error getting user by ID:", error);
      return null;
    }
  }
  
  /**
   * Create a new user
   * @param {CreateUserData} userData - User data for creation
   * @returns {Promise<UserInfo>} Created user info
   */
  async createUser(userData: CreateUserData): Promise<UserInfo> {
    try {
      // Hash the password before storing
      const passwordHash = await hashPassword(userData.password);
      
      // Create the user
      const newUser = await userRepository.create({
        username: userData.username,
        passwordHash,
        name: userData.name,
        role: userData.role
      });
      
      return this.getUserInfo(newUser);
    } catch (error) {
      console.error("Error creating user:", error);
      throw error;
    }
  }
  
  /**
   * Update an existing user
   * @param {number} id - User ID to update
   * @param {UpdateUserData} userData - User data for update
   * @returns {Promise<UserInfo>} Updated user info
   */
  async updateUser(id: number, userData: UpdateUserData): Promise<UserInfo> {
    try {
      // Get current user
      const currentUser = await userRepository.findById(id);
      if (!currentUser) {
        throw new Error("User not found");
      }
      
      // Prepare update data
      const updateData: Partial<User> = {};
      
      if (userData.username) updateData.username = userData.username;
      if (userData.name) updateData.name = userData.name;
      if (userData.role) updateData.role = userData.role;
      
      // Hash password if provided
      if (userData.password) {
        updateData.passwordHash = await hashPassword(userData.password);
      }
      
      // Update the user
      const updatedUser = await userRepository.update(id, updateData);
      
      return this.getUserInfo(updatedUser);
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
  async deleteUser(id: number): Promise<boolean> {
    try {
      // Check if this is the last admin
      const user = await userRepository.findById(id);
      if (!user) {
        return false;
      }
      
      if (user.role === 'ADMIN') {
        const admins = await userRepository.findByRole('ADMIN');
        if (admins.length <= 1) {
          throw new Error("Cannot delete the last admin user");
        }
      }
      
      // Delete the user
      await userRepository.delete(id);
      return true;
    } catch (error) {
      console.error(`Error deleting user ${id}:`, error);
      throw error;
    }
  }
  
  /**
   * Get user info from user object (removes sensitive data)
   * @param {User} user - User object
   * @returns {UserInfo} User info without sensitive data
   * @private
   */
  private getUserInfo(user: User): UserInfo {
    return {
      id: user.id,
      username: user.username,
      name: user.name,
      role: user.role
    };
  }
}
