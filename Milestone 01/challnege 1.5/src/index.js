const express = require('express');
const callAI = require('./callAI');
require('dotenv').config();

const app = express();
app.use(express.json());

// Review endpoint
app.post('/review', async (req, res) => {
  try {
    const { code } = req.body;

    if (!code) {
      return res.status(400).json({ error: 'Code is required' });
    }

    // Call AI with the code for review
    const review = await callAI.reviewCode(code);

    res.json({
      code_length: code.length,
      review: review.content,
      tokens_used: review.tokens,
      model: process.env.MODEL,
    });
  } catch (error) {
    console.error('Review error:', error.message);
    res.status(500).json({ error: 'Failed to review code' });
  }
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', service: 'Code Review API' });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Code Review API running on port ${PORT}`);
  console.log(`Model: ${process.env.MODEL}`);
});

module.exports = app;
