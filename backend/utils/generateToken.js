const jwt = require('jsonwebtoken');

/**
 * Generates a signed JWT for authenticated users
 * @param {string} id - User ObjectId
 * @param {string} role - User role ('student' | 'admin')
 * @returns {string} Signed JWT token string
 */
const generateToken = (id, role = 'student') => {
  return jwt.sign(
    { id, role },
    process.env.JWT_SECRET || 'campusride_jwt_super_secret_key_2026_dev',
    { expiresIn: '7d' }
  );
};

module.exports = generateToken;
