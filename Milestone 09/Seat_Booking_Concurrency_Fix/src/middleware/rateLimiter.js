const rateLimit = require("express-rate-limit");

const bookingRateLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: "Too many booking requests. Please try again later.",
  },
  statusCode: 429,
});

module.exports = bookingRateLimiter;
