const axios = require('axios');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

// Read system prompt
const systemPromptPath = path.join(__dirname, '../prompts/system-prompt.txt');
const systemPrompt = fs.readFileSync(systemPromptPath, 'utf8');

const API_URL = 'https://openrouter.ai/api/v1/chat/completions';
const API_KEY = process.env.OPENROUTER_API_KEY;
const MODEL = process.env.MODEL || 'openai/gpt-3.5-turbo';

// Review code using AI
async function reviewCode(code) {
  try {
    const response = await axios.post(
      API_URL,
      {
        model: MODEL,
        messages: [
          {
            role: 'system',
            content: systemPrompt,
          },
          {
            role: 'user',
            content: `Please review the following code:\n\n${code}`,
          },
        ],
        temperature: 0.7,
        max_tokens: 1000,
      },
      {
        headers: {
          'Authorization': `Bearer ${API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    return {
      content: response.data.choices[0].message.content,
      tokens: response.data.usage.total_tokens,
      model: MODEL,
    };
  } catch (error) {
    console.error('AI API Error:', error.message);
    throw new Error(`Failed to get AI review: ${error.message}`);
  }
}

module.exports = {
  reviewCode,
};
