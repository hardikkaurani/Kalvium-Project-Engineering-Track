const { verifyToken } = require('../auth/jwt');
const { blacklist } = require('../data/store');

const auth = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  if(!authHeader) return res.status(401).json({ error: 'Unauthorized' });

  const token = authHeader.split(' ')[1];

  // FIX 6: Check if token is blacklisted (logged out)
  if (blacklist.includes(token)) {
    return res.status(401).json({ error: 'Token is no longer valid (logged out)' });
  }

  try {
    const decoded = verifyToken(token);
    // FIX 2: req.user now includes userId and role
    req.user = decoded; 
    next();
  } catch (err) {
    res.status(401).json({ error: 'Auth failed: ' + err.message });
  }
};

module.exports = auth;
