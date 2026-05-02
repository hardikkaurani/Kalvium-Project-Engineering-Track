const { verifyToken } = require("../auth/jwt");

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token provided" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = verifyToken(token);
    req.user = decoded;
    next();
  } catch (err) {
    // FIX 1: Detect TokenExpiredError and return 401
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token expired" });
    }
    
    // For other JWT errors, also return 401 as per standard practices
    res.status(401).json({ message: "Invalid token", error: err.message });
  }
};

module.exports = authMiddleware;
