import { test } from 'node:test';
import assert from 'node:assert/strict';
import { handleContactPost, onRequestGet } from '../functions/api/contact.js';
const env = { SMTP_HOST: 'smtp.zoho.com', SMTP_PORT: '465', SMTP_USER: 'owner@example.com', SMTP_PASSWORD: 'test', CONTACT_FROM: 'Website <website@munhof.com.ar>', TURNSTILE_SECRET_KEY: 'test' };
const body = { name: 'Visitor', email: 'visitor@example.com', topic: 'collaboration', message: 'Hello from the portfolio', token: 'token' };
const request = (data = body) => new Request('https://example.com/api/contact', { method: 'POST', headers: { 'Content-Type': 'application/json', Origin: 'https://example.com' }, body: JSON.stringify(data) });
test('rejects invalid email before calling any external service', async () => {
  const response = await handleContactPost({ request: request({ ...body, email: 'bad\naddress' }), env });
  assert.equal(response.status, 400);
});
test('fails closed without credentials', async () => {
  assert.equal((await handleContactPost({ request: request(), env: {} })).status, 503);
});
test('does not send when Turnstile rejects the token', async (t) => {
  let calls = 0;
  t.mock.method(globalThis, 'fetch', async () => { calls++; return Response.json({ success: false }); });
  assert.equal((await handleContactPost({ request: request(), env })).status, 403);
  assert.equal(calls, 1);
});
test('sends only to contact with visitor as reply-to after verification', async (t) => {
  t.mock.method(globalThis, 'fetch', async () => Response.json({ success: true, hostname: 'example.com', action: 'contact' }));
  let sent;
  const response = await handleContactPost({ request: request(), env }, async (config, mail) => { sent = { config, mail }; });
  assert.equal(response.status, 200);
  assert.equal(sent.config.host, 'smtp.zoho.com');
  assert.equal(sent.config.port, 465);
  assert.equal(sent.mail.to, 'contact@munhof.com.ar');
  assert.equal(sent.mail.replyTo, body.email);
});
test('SMTP rejection is not reported as success or leaked to client', async (t) => {
  t.mock.method(globalThis, 'fetch', async () => Response.json({ success: true, hostname: 'example.com', action: 'contact' }));
  const response = await handleContactPost({ request: request(), env }, async () => { throw new Error('secret SMTP details'); });
  assert.equal(response.status, 502);
  assert.deepEqual(await response.json(), { error: 'unavailable' });
});
test('readiness requires SMTP credentials and exposes only the public site key', async () => {
  const ready = { ...env, TURNSTILE_SITE_KEY: 'public-key' };
  assert.deepEqual(await onRequestGet({ env: ready }).json(), { siteKey: 'public-key' });
  for (const key of Object.keys(ready)) {
    assert.deepEqual(await onRequestGet({ env: { ...ready, [key]: '' } }).json(), { siteKey: null });
  }
});
test('rejects tokens issued for another hostname', async (t) => {
  let calls = 0;
  t.mock.method(globalThis, 'fetch', async () => {
    calls++;
    return Response.json({ success: true, hostname: 'another.example.com', action: 'contact' });
  });
  assert.equal((await handleContactPost({ request: request(), env })).status, 403);
  assert.equal(calls, 1);
});
test('rejects oversized requests before provider access', async () => {
  assert.equal((await handleContactPost({ request: request({ ...body, message: 'a'.repeat(25000) }), env })).status, 413);
});
