const jwt = require('jsonwebtoken');

// Load secret from environment or throw error
const SECRET = process.env.JWT_SECRET;

if (!SECRET) {
  console.error('FATAL ERROR: JWT_SECRET is not defined in environment variables.');
  process.exit(1);
}

const signToken = (payload) => {
  // FIX 1: Added 1h expiry for better security
  return jwt.sign(payload, SECRET, { expiresIn: '1h' });
};

const verifyToken = (token) => {
  return jwt.verify(token, SECRET);
};

module.exports = { signToken, verifyToken, SECRET };
