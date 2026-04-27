const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));

/**
 * POST /generate
 * Accepts code changes and generates conventional commit messages
 */
app.post('/generate', async (req, res) => {
  try {
    const { codeChanges } = req.body;

    if (!codeChanges || codeChanges.trim().length === 0) {
      return res.status(400).json({ error: 'Code changes required' });
    }

    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey) {
      console.error('Missing OPENROUTER_API_KEY');
      return res.status(500).json({ error: 'API configuration error' });
    }

    // Craft prompt for conventional commits
    const systemPrompt = `You are a Git commit message expert. Analyze the code changes and generate 3 conventional commit messages.

Rules:
1. Follow conventional commits (https://www.conventionalcommits.org/)
2. Format: type(scope): subject
3. Types: feat, fix, docs, style, refactor, perf, test, chore, ci
4. Subject: lowercase, imperative, no period, max 50 chars
5. Generate 3 DIFFERENT options (different types/perspectives)
6. Return ONLY JSON, no markdown:

{
  "commits": [
    { "type": "feat", "scope": "auth", "subject": "add password reset via email", "full": "feat(auth): add password reset via email" },
    { "type": "fix", "scope": "db", "subject": "fix connection pool timeout", "full": "fix(db): fix connection pool timeout" },
    { "type": "refactor", "scope": "api", "subject": "restructure error handling middleware", "full": "refactor(api): restructure error handling middleware" }
  ]
}`;

    const userPrompt = `Analyze these code changes and generate 3 conventional commit messages:\n\n${codeChanges}`;

    // Call OpenRouter API
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
        'HTTP-Referer': process.env.REFERER_URL || 'http://localhost:3000',
        'X-Title': 'CommitMaster',
      },
      body: JSON.stringify({
        model: 'openai/gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
        temperature: 0.7,
        max_tokens: 500,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('OpenRouter error:', errorData);
      return res.status(500).json({
        error: 'Failed to generate commits',
        details: errorData.error?.message,
      });
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      return res.status(500).json({ error: 'Empty response from AI' });
    }

    // Parse JSON response
    let commits;
    try {
      // Extract JSON from response (in case there's extra text)
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (!jsonMatch) throw new Error('No JSON found');
      commits = JSON.parse(jsonMatch[0]);
    } catch (parseError) {
      console.error('Parse error:', parseError, 'Content:', content);
      return res.status(500).json({ error: 'Failed to parse AI response' });
    }

    res.json({ commits: commits.commits || [] });
  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * GET /health
 */
app.get('/health', (req, res) => {
  res.json({ status: 'OK', service: 'CommitMaster' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ CommitMaster Backend running on port ${PORT}`);
  console.log(`📝 POST /generate - Generate commit messages`);
  console.log(`🏥 GET /health - Health check`);
});

module.exports = app;
