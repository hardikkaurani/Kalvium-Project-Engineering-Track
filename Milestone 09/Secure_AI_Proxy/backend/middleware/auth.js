export const authMiddleware = (req, res, next) => {
  req.user = { id: 'usr_abc123' }; // Mock auth
  next();
};
