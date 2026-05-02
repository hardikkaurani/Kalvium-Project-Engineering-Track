import fetch from 'node-fetch';

export async function analyzeDiff(promptObj) {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    console.error('[AI_ERROR] API key is not configured.');
    return {
      success: false,
      fallback: true,
      message: 'Analysis unavailable. Please try again shortly.'
    };
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 15000);

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': \Bearer \\,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: \\\n\n\\n\n\\n\n\\
          },
          {
            role: 'user',
            content: promptObj.input,
          },
        ],
      }),
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || 'AI API call failed');
    }

    const data = await response.json();
    const usage = data.usage;
    
    if (usage) {
      console.log('[AI_USAGE]', JSON.stringify({
        timestamp: new Date().toISOString(),
        model: 'gpt-4o-mini',
        promptTokens: usage.prompt_tokens,
        completionTokens: usage.completion_tokens,
        totalTokens: usage.total_tokens
      }));
    }

    return JSON.parse(data.choices[0].message.content);
  } catch (err) {
    clearTimeout(timeoutId);
    
    if (err.name === 'AbortError') {
      console.error('[AI_TIMEOUT] Request timed out after 15s');
    } else {
      console.error('[AI_ERROR]', err.message);
    }

    return {
      success: false,
      fallback: true,
      message: 'Analysis unavailable. Please try again shortly.'
    };
  }
}
