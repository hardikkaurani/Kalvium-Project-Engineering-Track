const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Conversation memory (in-memory storage - replace with database for production)
let conversationHistory = [];

/**
 * POST /chat
 * Accepts full conversation history and sends to OpenRouter API
 * Returns AI response and updates conversation
 */
app.post('/chat', async (req, res) => {
  try {
    const { messages } = req.body;

    // Validate input
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: 'Messages array required' });
    }

    // Check for API key
    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey) {
      console.error('Missing OPENROUTER_API_KEY in environment variables');
      return res.status(500).json({ error: 'API configuration error' });
    }

    // Call OpenRouter API
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
        'HTTP-Referer': process.env.REFERER_URL || 'http://localhost:3000',
        'X-Title': 'AI Chatbot',
      },
      body: JSON.stringify({
        model: 'openai/gpt-4o-mini',
        messages: messages,
        temperature: 0.7,
        max_tokens: 1000,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('OpenRouter API Error:', errorData);
      
      // Fallback to Gemini if available
      if (process.env.GEMINI_API_KEY) {
        console.log('Falling back to Gemini API...');
        return await callGeminiAPI(messages, res);
      }
      
      return res.status(response.status).json({
        error: 'Failed to get AI response',
        details: errorData.error?.message || 'Unknown error',
      });
    }

    const data = await response.json();

    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      return res.status(500).json({ error: 'Invalid API response format' });
    }

    const reply = data.choices[0].message.content;

    // Update conversation memory
    conversationHistory = messages;
    conversationHistory.push({
      role: 'assistant',
      content: reply,
    });

    res.json({ reply });
  } catch (error) {
    console.error('Chat endpoint error:', error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * Fallback: Call Gemini API
 */
async function callGeminiAPI(messages, res) {
  try {
    const geminiKey = process.env.GEMINI_API_KEY;
    
    // Format messages for Gemini
    const geminiMessages = messages.map(m => ({
      role: m.role === 'user' ? 'user' : 'model',
      parts: [{ text: m.content }],
    }));

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${geminiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: geminiMessages,
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 1000,
          },
        }),
      }
    );

    const data = await response.json();
    const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || 'No response from Gemini';

    res.json({ reply });
  } catch (error) {
    console.error('Gemini fallback error:', error.message);
    res.status(500).json({ error: 'Both APIs failed' });
  }
}

/**
 * GET /health
 * Health check endpoint
 */
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date() });
});

/**
 * GET /history
 * Retrieve conversation history
 */
app.get('/history', (req, res) => {
  res.json({ history: conversationHistory });
});

/**
 * POST /reset
 * Clear conversation history
 */
app.post('/reset', (req, res) => {
  conversationHistory = [];
  res.json({ message: 'Conversation reset' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Server error:', err.message);
  res.status(500).json({ error: 'Internal server error' });
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ AI Chatbot Backend running on port ${PORT}`);
  console.log(`🔌 POST /chat - Send messages for AI response`);
  console.log(`📊 GET /history - Retrieve conversation history`);
  console.log(`🔄 POST /reset - Clear conversation`);
  console.log(`🏥 GET /health - Health check`);
});

module.exports = app;
