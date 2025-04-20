import { userRepository } from "../../repositories/users";
import { LoginCredentials, User, UserInfo } from "../../types/users";
import { verifyPassword } from "../../lib/auth/utils";

/**
 * Authentication service for user authentication and authorization
 */
export class AuthService {
  /**
   * Authenticate a user with username and password
   * @param {LoginCredentials} credentials - Login credentials
   * @returns {Promise<UserInfo | null>} User info if authenticated, null otherwise
   */
  async authenticate(credentials: LoginCredentials): Promise<UserInfo | null> {
    try {
      const { username, password } = credentials;
      
      // Find user by username
      const user = await userRepository.findByUsername(username);
      
      // If user not found or password invalid, return null
      if (!user) {
        console.log(`Authentication failed: User '${username}' not found`);
        return null;
      }
      
      // Verify password using the shared utility
      const isPasswordValid = verifyPassword(password, user.passwordHash);
      
      if (!isPasswordValid) {
        console.log(`Authentication failed: Invalid password for user '${username}'`);
        return null;
      }
      
      // Return user info without sensitive data
      return this.getUserInfo(user);
    } catch (error) {
      console.error("Authentication error:", error);
      return null;
    }
  }
  
  /**
   * Get user info from user object (removes sensitive data)
   * @param {User} user - User object
   * @returns {UserInfo} User info without sensitive data
   */
  getUserInfo(user: User): UserInfo {
    return {
      id: user.id,
      username: user.username,
      name: user.name,
      role: user.role
    };
  }
}
