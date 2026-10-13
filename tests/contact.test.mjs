import { test } from 'node:test';
import assert from 'node:assert/strict';
import { onRequestPost } from '../functions/api/contact.js';
const env = { RESEND_API_KEY: 'test', CONTACT_FROM: 'Website <website@munhof.com.ar>', TURNSTILE_SECRET_KEY: 'test' };
const body = { name: 'Visitor', email: 'visitor@example.com', topic: 'collaboration', message: 'Hello from the portfolio', token: 'token' };
const request = (data = body) => new Request('https://example.com/api/contact', { method: 'POST', headers: { 'Content-Type': 'application/json', Origin: 'https://example.com' }, body: JSON.stringify(data) });
test('rejects invalid email before calling any external service', async () => {
  const response = await onRequestPost({ request: request({ ...body, email: 'bad\naddress' }), env });
  assert.equal(response.status, 400);
});
test('fails closed without credentials', async () => {
  assert.equal((await onRequestPost({ request: request(), env: {} })).status, 503);
});
test('does not send when Turnstile rejects the token', async (t) => {
  let calls = 0;
  t.mock.method(globalThis, 'fetch', async () => { calls++; return Response.json({ success: false }); });
  assert.equal((await onRequestPost({ request: request(), env })).status, 403);
  assert.equal(calls, 1);
});
test('sends only to contact with visitor as reply-to after verification', async (t) => {
  const calls = [];
  t.mock.method(globalThis, 'fetch', async (url, options) => {
    calls.push({ url, data: JSON.parse(options.body) });
    return Response.json(calls.length === 1 ? { success: true, hostname: 'example.com', action: 'contact' } : { id: 'accepted' });
  });
  assert.equal((await onRequestPost({ request: request(), env })).status, 200);
  assert.deepEqual(calls[1].data.to, ['contact@munhof.com.ar']);
  assert.equal(calls[1].data.reply_to, body.email);
});
test('provider failure is not reported as success', async (t) => {
  let calls = 0;
  t.mock.method(globalThis, 'fetch', async () => ++calls === 1
    ? Response.json({ success: true, hostname: 'example.com', action: 'contact' })
    : Response.json({ error: 'unavailable' }, { status: 500 }));
  assert.equal((await onRequestPost({ request: request(), env })).status, 502);
});
test('rejects tokens issued for another hostname', async (t) => {
  let calls = 0;
  t.mock.method(globalThis, 'fetch', async () => {
    calls++;
    return Response.json({ success: true, hostname: 'another.example.com', action: 'contact' });
  });
  assert.equal((await onRequestPost({ request: request(), env })).status, 403);
  assert.equal(calls, 1);
});
test('rejects oversized requests before provider access', async () => {
  assert.equal((await onRequestPost({ request: request({ ...body, message: 'a'.repeat(25000) }), env })).status, 413);
});
