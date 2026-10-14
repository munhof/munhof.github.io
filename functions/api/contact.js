import { sendSmtp } from '../../lib/smtp.js';
const smtpReady = (env) => Boolean(env.SMTP_HOST && String(env.SMTP_PORT) === '465' && env.SMTP_USER && env.SMTP_PASSWORD && env.CONTACT_FROM);
const reply = (status, error) => Response.json(error ? { error } : { ok: true }, { status, headers: { 'Cache-Control': 'no-store' } });
export function onRequestPost(context) { return handleContactPost(context); }
export async function handleContactPost({ request, env }, send = sendSmtp) {
  const origin = new URL(request.url);
  if (request.headers.get('Origin') !== origin.origin) return reply(403, 'origin');
  if (!request.headers.get('Content-Type')?.startsWith('application/json')) return reply(415, 'format');
  if (!smtpReady(env) || !env.TURNSTILE_SECRET_KEY) return reply(503, 'unavailable');
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
    await send({ host: env.SMTP_HOST, port: Number(env.SMTP_PORT), user: env.SMTP_USER,
      password: env.SMTP_PASSWORD, from: env.CONTACT_FROM }, {
      to: 'contact@munhof.com.ar', replyTo: email,
      subject: `[Portfolio / ${topic}] ${name.trim()}`,
      text: `Name: ${name.trim()}\nEmail: ${email}\nTopic: ${topic}\n\n${message.trim()}`,
    });
    return reply(200);
  } catch { return reply(502, 'unavailable'); }
}
export function onRequestGet({ env }) {
  const ready = Boolean(env.TURNSTILE_SITE_KEY && env.TURNSTILE_SECRET_KEY && smtpReady(env));
  return Response.json({ siteKey: ready ? env.TURNSTILE_SITE_KEY : null }, { headers: { 'Cache-Control': 'no-store' } });
}
