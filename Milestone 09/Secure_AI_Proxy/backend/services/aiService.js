import fetch from 'node-fetch';

export async function summarizeNotes(notes) {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    console.error('[AI_ERROR] OPENAI_API_KEY is not configured.');
    return {
      success: false,
      fallback: true,
      message: 'Analysis unavailable. Please try again shortly.'
    };
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 15000); // 15s timeout

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': Bearer $apiKey,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'You are a concise study note summariser. Return a bullet-point summary of the key concepts.',
          },
          {
            role: 'user',
            content: notes,
          },
        ],
      }),
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || 'OpenAI API call failed');
    }

    const data = await response.json();
    
    const usage = data.usage;
    if (usage) {
      console.log('[AI_USAGE]', JSON.stringify({
        timestamp: new Date().toISOString(),
        userId: 'system',
        model: 'openai/gpt-4o-mini',
        promptTokens: usage.prompt_tokens,
        completionTokens: usage.completion_tokens,
        totalTokens: usage.total_tokens,
        endpoint: 'summarize_note'
      }));
    }

    return data.choices[0].message.content;
  } catch (err) {
    clearTimeout(timeoutId);
    
    if (err.name === 'AbortError') {
      console.error('[AI_TIMEOUT] Request to AI service timed out after 15s');
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
