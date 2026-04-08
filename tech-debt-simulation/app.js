// Tech Debt Simulation - Main Application File
// This is a placeholder application for the tech debt simulation challenge

const express = require('express');
const app = express();

// Middleware
app.use(express.json());

// Routes
const routes = require('./routes');
app.use('/api', routes);

// Error handling
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Internal Server Error' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;
