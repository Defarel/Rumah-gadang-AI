import { HOME_HTML } from './home/index.js';
import { AI_HTML } from './ai/index.js';

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const p = url.pathname;

    if (p.startsWith('/ai/') && p.includes('.')) {
      return env.ASSETS.fetch(request);
    }

    if (p === '/api/ai') {
      const body = await request.json();
      const key = env.GROQ_API_KEY;
      const r = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + key
        },
        body: JSON.stringify({
          model: 'openai/gpt-oss-20b',
          messages: [
            { role: 'system', content: 'Kamu Rumah Gadang AI' },
            { role: 'user', content: body.prompt }
          ]
        })
      });
      const j = await r.json();
      return new Response(JSON.stringify({ reply: j.choices[0].message.content }), { headers: { 'Content-Type': 'application/json' } });
    }

    if (p === '/ai' || p.startsWith('/ai')) {
      return new Response(AI_HTML, { headers: { 'Content-Type': 'text/html' } });
    }

    return new Response(HOME_HTML, { headers: { 'Content-Type': 'text/html' } });
  }
}
