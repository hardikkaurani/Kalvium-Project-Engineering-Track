require('dotenv').config();
const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');

const app = express();
const PORT = process.env.PORT || 3001;

// GAP 3 FIX - CORS hardened for production (Item 05)
// Now correctly uses CORS_ORIGIN from env, or falls back to localhost only in dev.
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

app.use(express.json());

// GAP 1 FIX - Health endpoint implemented (Item 08)
// Essential for container orchestration and uptime monitoring.
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Main App Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);

// Default Catch-all
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

app.listen(PORT, () => {
  console.log(`?? LaunchPad API Server running on port ${PORT}`);
  console.log(`?? Allowed Origin: ${process.env.CORS_ORIGIN || 'http://localhost:5173'}`);
});
