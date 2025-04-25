/**
 * Shared authentication utilities
 * @module lib/auth/utils
 */

/**
 * Creates a simple password hash
 * Note: This is a simplified version for demo purposes
 * In production, use proper hashing with bcrypt
 * @param password Plain text password
 * @returns Hashed password
 */
function hashPassword(password: string): string {
  // Simple hash for demo (do NOT use in production)
  return Buffer.from(`hash_${password}`).toString('base64');
}

/**
 * Verify if a password hash matches a provided password
 * @param password The plain text password to verify
 * @param hash The stored hash
 * @returns true if the password matches the hash
 */
function verifyPassword(password: string, hash: string): boolean {
  const calculatedHash = hashPassword(password);
  return calculatedHash === hash;
}

module.exports = {
  hashPassword,
  verifyPassword
};
