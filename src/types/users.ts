/**
 * User interface representing application users
 * @interface User
 * @property {number} id - Unique identifier
 * @property {string} username - Username for login
 * @property {string} passwordHash - Hashed password
 * @property {string} name - Display name
 * @property {string} role - User role (admin or user)
 * @property {string} [createdAt] - Creation timestamp
 */
export interface User {
  id: number;
  username: string;
  passwordHash: string;
  name: string;
  role: string;
  createdAt?: string;
}

/**
 * Login credentials for authentication
 * @interface LoginCredentials
 * @property {string} username - Username
 * @property {string} password - Password (plain text)
 */
export interface LoginCredentials {
  username: string;
  password: string;
}

/**
 * User information safe for client-side use (no sensitive data)
 * @interface UserInfo
 * @property {number} id - User ID
 * @property {string} username - Username
 * @property {string} name - Display name
 * @property {string} role - User role
 */
export interface UserInfo {
  id: number;
  username: string;
  name: string;
  role: string;
}

/**
 * Data for creating a new user
 * @interface CreateUserData
 * @property {string} username - Username
 * @property {string} password - Plain text password (will be hashed)
 * @property {string} name - Display name
 * @property {string} role - User role (admin or user)
 */
export interface CreateUserData {
  username: string;
  password: string;
  name: string;
  role: string;
}

/**
 * Data for updating an existing user
 * @interface UpdateUserData
 * @property {string} [username] - Username
 * @property {string} [password] - Plain text password (will be hashed)
 * @property {string} [name] - Display name
 * @property {string} [role] - User role (admin or user)
 */
export interface UpdateUserData {
  username?: string;
  password?: string;
  name?: string;
  role?: string;
}
