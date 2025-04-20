/**
 * Creates a simple password hash
 * Note: This is a simplified version for demo purposes
 * In production, use proper hashing with bcrypt
 * @param {string} password Plain text password
 * @returns {string} Hashed password
 */
function hashPassword(password) {
  // Simple hash for demo (do NOT use in production)
  return Buffer.from(`hash_${password}`).toString('base64');
}

/**
 * Verify if a password hash matches a provided password
 * @param {string} password The plain text password to verify
 * @param {string} hash The stored hash
 * @returns {boolean} true if the password matches the hash
 */
function verifyPassword(password, hash) {
  const calculatedHash = hashPassword(password);
  return calculatedHash === hash;
}

module.exports = {
  hashPassword,
  verifyPassword
};
