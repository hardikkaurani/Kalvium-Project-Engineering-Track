import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

import { authMiddleware } from './middleware/auth.js';
import { rateLimitMiddleware } from './middleware/rateLimit.js';
import { validateMiddleware } from './middleware/validate.js';
import { analyzeDiff } from './services/aiService.js';
import { buildRiskAnalyzerPrompt } from './src/utils/promptBuilder.js';

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

// ROUTE ORDER: auth -> rateLimit -> validate -> controller
app.post('/api/analyze', authMiddleware, rateLimitMiddleware, validateMiddleware, async (req, res) => {
  try {
    const { diff, context } = req.body;
    const promptObj = buildRiskAnalyzerPrompt(diff, context);
    const result = await analyzeDiff(promptObj);
    
    if (result && result.fallback) {
      return res.status(503).json(result);
    }
    
    res.json({ success: true, data: result });
  } catch (err) {
    console.error('Analysis error:', err.message);
    res.status(500).json({ success: false, error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(🚀 Backend server running on http://localhost: + PORT);
});
