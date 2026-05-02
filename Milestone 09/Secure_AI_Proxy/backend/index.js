import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { summarizeNotes } from './services/aiService.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.use(express.static(path.join(__dirname, '../dist')));

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.post('/api/summarize', async (req, res) => {
  try {
    const { notes } = req.body;

    if (!notes || notes.trim().length === 0) {
      return res.status(400).json({
        error: 'input_required',
        message: 'Notes text is required.'
      });
    }

    if (notes.length > 3000) {
      return res.status(400).json({
        error: 'input_too_long',
        limit: 3000,
        received: notes.length
      });
    }

    const result = await summarizeNotes(notes);
    
    if (result && result.fallback) {
      return res.status(503).json(result);
    }
    
    res.json({
      success: true,
      data: { summary: result }
    });
  } catch (err) {
    console.error('Summarization error:', err.message);
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
});

app.listen(PORT, () => {
  console.log(🚀 Backend server running on http://localhost: + PORT);
});
