/**
 * Middleware to restrict access based on user roles
 * @param {...string} allowedRoles - The roles permitted to access the route
 */
export const requireRole = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Not authorized, no user found' });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ 
        message: `Forbidden: Access denied for role '${req.user.role}'` 
      });
    }

    next();
  };
};
