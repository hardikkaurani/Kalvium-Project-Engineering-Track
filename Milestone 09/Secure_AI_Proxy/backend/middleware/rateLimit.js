const userLimits = new Map();
export const rateLimitMiddleware = (req, res, next) => {
  const userId = req.user.id;
  const now = Date.now();
  const windowMs = 60000; // 1 minute
  const maxRequests = 5;

  if (!userLimits.has(userId)) {
    userLimits.set(userId, []);
  }

  const timestamps = userLimits.get(userId).filter(t => now - t < windowMs);
  
  if (timestamps.length >= maxRequests) {
    return res.status(429).json({ error: 'Too many requests. Limit 5 per minute to control LLM costs.' });
  }

  timestamps.push(now);
  userLimits.set(userId, timestamps);
  next();
};
