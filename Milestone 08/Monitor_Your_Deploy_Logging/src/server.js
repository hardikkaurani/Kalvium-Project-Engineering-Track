import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import morgan from 'morgan';
import productRoutes from './routes/productRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// STEP 4: Add Morgan Logging
// Using 'combined' format for production and 'dev' for others
const logFormat = process.env.NODE_ENV === 'production' ? 'combined' : 'dev';
app.use(morgan(logFormat));

app.use(cors());
app.use(express.json());

app.use('/api/products', productRoutes);

// Database connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/stockapi')
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => {
      console.log(`?? Server running on port ${PORT}`);
    });
  })
  .catch(err => {
    // STEP 4: Add Error Logging in catch blocks
    console.error('FATAL: Database connection failed:', err.message);
    process.exit(1);
  });
