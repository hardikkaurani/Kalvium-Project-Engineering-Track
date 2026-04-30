const express = require('express');
const confessionRoutes = require('./routes/confessionRoutes');

const app = express();

// ===== MIDDLEWARE =====

// Parse incoming JSON requests
app.use(express.json());

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// ===== ROUTES =====

// Main API routes for confessions
app.use('/api/confessions', confessionRoutes);

// Health check endpoint - verify server is running
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', timestamp: new Date() });
});

// ===== ERROR HANDLING =====

// Catch async errors and pass to error handler
app.use((err, req, res, next) => {
  console.error(`Error occurred: ${err.message}`);
  console.error(err.stack);
  
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error',
    timestamp: new Date(),
  });
});

// 404 handler - route not found
app.use((req, res) => {
  res.status(404).json({
    error: 'Route not found',
    path: req.path,
    method: req.method,
  });
});

module.exports = app;
