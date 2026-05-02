import fetch from 'node-fetch';

/**
 * Service to handle OpenAI interactions securely on the server-side.
 * The API key is read from environment variables and never sent to the client.
 */
export async function summarizeNotes(notes) {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    throw new Error('OPENAI_API_KEY is not configured on the server.');
  }

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
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
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error?.message || 'OpenAI API call failed');
  }

  const data = await response.json();
  
  // Return ONLY the content string as per requirement
  return data.choices[0].message.content;
}
