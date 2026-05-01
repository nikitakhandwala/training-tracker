export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'ANTHROPIC_API_KEY not configured on server' });
  }

  try {
    const { image } = req.body || {};
    if (!image) return res.status(400).json({ error: 'No image provided' });

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 500,
        messages: [{
          role: 'user',
          content: [
            { type: 'image', source: { type: 'base64', media_type: 'image/jpeg', data: image } },
            { type: 'text', text: `Analyze this meal photo for a 55kg woman training for muscle gain. Daily protein target: 100–120g. Per-meal target: ~25–30g.

Respond ONLY with a valid JSON object (no markdown fences, no preamble):
{"proteinG": <number>, "sufficient": <boolean, true if >=25g>, "foods": "<short description, max 8 words>", "note": "<one short, kind sentence — what's good or what to add for more protein>"}` }
          ]
        }]
      })
    });

    if (!response.ok) {
      const err = await response.text();
      return res.status(response.status).json({ error: 'Claude API error', detail: err });
    }

    const data = await response.json();
    const text = data.content
      .filter(c => c.type === 'text')
      .map(c => c.text)
      .join('')
      .replace(/```json/g, '')
      .replace(/```/g, '')
      .trim();

    const parsed = JSON.parse(text);
    return res.status(200).json(parsed);
  } catch (e) {
    console.error('Analyze meal error:', e);
    return res.status(500).json({ error: e.message });
  }
}
