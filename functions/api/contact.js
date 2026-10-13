const reply = (status, error) => Response.json(error ? { error } : { ok: true }, { status, headers: { 'Cache-Control': 'no-store' } });
export async function onRequestPost({ request, env }) {
  const origin = new URL(request.url);
  if (request.headers.get('Origin') !== origin.origin) return reply(403, 'origin');
  if (!request.headers.get('Content-Type')?.startsWith('application/json')) return reply(415, 'format');
  if (!env.RESEND_API_KEY || !env.CONTACT_FROM || !env.TURNSTILE_SECRET_KEY) return reply(503, 'unavailable');
  let body;
  try {
    const reader = request.body.getReader();
    let size = 0;
    const chunks = [];
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > 24000) { await reader.cancel(); return reply(413, 'size'); }
      chunks.push(value);
    }
    body = JSON.parse(await new Blob(chunks).text());
  } catch { return reply(400, 'format'); }
  if (!body || typeof body !== 'object') return reply(400, 'fields');
  const { name, email, topic, message, token } = body;
  if (typeof name !== 'string' || !name.trim() || name.length > 100 || /[\r\n]/.test(name)
    || typeof email !== 'string' || email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    || !['work', 'collaboration', 'research', 'other'].includes(topic)
    || typeof message !== 'string' || !message.trim() || message.length > 5000
    || typeof token !== 'string' || !token || token.length > 2048) return reply(400, 'fields');
  try {
    const verification = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, signal: AbortSignal.timeout(10000),
      body: JSON.stringify({ secret: env.TURNSTILE_SECRET_KEY, response: token, remoteip: request.headers.get('CF-Connecting-IP') || undefined }),
    });
    if (!verification.ok) return reply(502, 'verification');
    const result = await verification.json();
    if (!result.success || result.hostname !== origin.hostname || result.action !== 'contact') return reply(403, 'verification');
    const sent = await fetch('https://api.resend.com/emails', {
      method: 'POST', signal: AbortSignal.timeout(10000),
      headers: { Authorization: `Bearer ${env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ from: env.CONTACT_FROM, to: ['contact@munhof.com.ar'], reply_to: email,
        subject: `[Portfolio / ${topic}] ${name.trim()}`,
        text: `Name: ${name.trim()}\nEmail: ${email}\nTopic: ${topic}\n\n${message.trim()}` }),
    });
    if (!sent.ok || !(await sent.json()).id) return reply(502, 'delivery');
    return reply(200);
  } catch { return reply(502, 'unavailable'); }
}
export function onRequestGet({ env }) {
  const ready = Boolean(env.TURNSTILE_SITE_KEY && env.TURNSTILE_SECRET_KEY && env.RESEND_API_KEY && env.CONTACT_FROM);
  return Response.json({ siteKey: ready ? env.TURNSTILE_SITE_KEY : null }, { headers: { 'Cache-Control': 'no-store' } });
}
