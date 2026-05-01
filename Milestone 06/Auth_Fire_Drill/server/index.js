const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const fragmentRoutes = require('./routes/fragments');

const app = express();
const PORT = 5001;

// FIX 5: Hardened CORS and CSRF protection foundation
// Restricting to trusted frontend origin and adding custom header requirement
app.use(cors({ 
  origin: 'http://localhost:5173', // Vite default port
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

app.use(express.json());

// Simple custom header check for CSRF prevention on non-GET requests
app.use((req, res, next) => {
  if (req.method !== 'GET' && !req.headers['x-requested-with']) {
    return res.status(403).json({ error: 'CSRF Protection: Missing custom header' });
  }
  next();
});

app.use('/api/auth', authRoutes);
app.use('/api/fragments', fragmentRoutes);

app.get('/', (req, res) => {
  res.send('Fragments API Running (Secured)');
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
