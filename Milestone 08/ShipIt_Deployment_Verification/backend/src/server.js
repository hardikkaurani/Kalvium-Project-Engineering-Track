import express from 'express';
import cors from 'cors';
import itemRoutes from './routes/itemRoutes.js';
import healthRoutes from './routes/healthRoutes.js';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// FIX: Type B - CORS Issue
// Instead of hardcoding localhost, we now use process.env.FRONTEND_URL
// to allow the deployed frontend to communicate with the backend.
const allowedOrigins = [
  'http://localhost:5173',
  process.env.FRONTEND_URL
].filter(Boolean);

app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));

app.use('/health', healthRoutes);
app.use('/api/items', itemRoutes);

app.listen(PORT, () => {
  console.log(`Backend server running on port ${PORT}`);
  console.log(`Allowed Origins: ${allowedOrigins.join(', ')}`);
});
