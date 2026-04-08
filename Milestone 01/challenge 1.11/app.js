const express = require('express');
const confessionRoutes = require('./routes/confessionRoutes');

const app = express();

// Middleware
app.use(express.json());

// Routes
app.use('/api/confessions', confessionRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal Server Error' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

module.exports = app;
