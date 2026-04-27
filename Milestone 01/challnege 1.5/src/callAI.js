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
const PROMPT_TOKEN_RATE_PER_1K = 0.0005;
const COMPLETION_TOKEN_RATE_PER_1K = 0.0015;

function estimateCost(usage = {}) {
  const promptTokens = Number(usage.prompt_tokens) || 0;
  const completionTokens = Number(usage.completion_tokens) || 0;

  return (
    (promptTokens / 1000) * PROMPT_TOKEN_RATE_PER_1K +
    (completionTokens / 1000) * COMPLETION_TOKEN_RATE_PER_1K
  );
}

// Review code using AI
async function reviewCode(code) {
  try {
    if (!API_KEY) {
      throw new Error('OPENROUTER_API_KEY is not set.');
    }

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

    const usage = response.data.usage || {};
    const estimatedCost = estimateCost(usage);

    console.log('Token usage:');
    console.log(`  prompt_tokens: ${usage.prompt_tokens || 0}`);
    console.log(`  completion_tokens: ${usage.completion_tokens || 0}`);
    console.log(`  total_tokens: ${usage.total_tokens || 0}`);
    console.log(`  estimated_cost: $${estimatedCost.toFixed(6)}`);

    return {
      content: response.data.choices[0].message.content,
      tokens: usage.total_tokens || 0,
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
