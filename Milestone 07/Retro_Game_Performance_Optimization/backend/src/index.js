const express = require('express');
const cors = require('cors');
const compression = require('compression'); // FIX 3: Compression
const scoreRoutes = require('./routes/scores');

const app = express();
const PORT = process.env.PORT || 3001;

// Global Middleware
app.use(compression()); // FIX 3: Enable Gzip compression globally
app.use(cors());
app.use(express.json());

app.use('/api/scores', scoreRoutes);

app.get('/health', (req, res) => {
  res.json({ status: 'ok', optimized: true });
});

app.listen(PORT, () => {
  console.log(`🚀 Optimized Retro Server running on http://localhost:${PORT}`);
});
