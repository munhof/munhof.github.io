import { test } from 'node:test';
import assert from 'node:assert/strict';
import { sendSmtp } from '../lib/smtp.js';
const config = { host: 'smtp.zoho.com', port: 465, user: 'owner@example.com', password: 'app-password', from: 'Portfolio <contact@example.com>' };
const mail = { to: 'contact@munhof.com.ar', replyTo: 'visitor@example.com', subject: 'Consulta de Muñó', text: 'Hola\n.\nOtra línea' };
function server({ rejectAuth = false, rejectData = false, disconnect = false } = {}) {
  const commands = [];
  let controller, stage = 0, closed = false;
  const socket = {
    opened: Promise.resolve(),
    readable: new ReadableStream({ start(c) { controller = c; c.enqueue(new TextEncoder().encode('220 ready\r\n')); } }),
    writable: new WritableStream({ write(bytes) {
      const command = new TextDecoder().decode(bytes); commands.push(command);
      if (disconnect) { controller.close(); return; }
      const replies = ['250-hello\r\n250 AUTH LOGIN\r\n', '334 username\r\n', '334 password\r\n', rejectAuth ? '535 rejected\r\n' : '235 authenticated\r\n', '250 sender\r\n', '250 recipient\r\n', '354 data\r\n', rejectData ? '550 rejected\r\n' : '250 queued\r\n'];
      const reply = replies[stage++];
      // Deliberately fragment all responses, including multiline EHLO.
      controller.enqueue(new TextEncoder().encode(reply.slice(0, 5)));
      controller.enqueue(new TextEncoder().encode(reply.slice(5)));
    } }),
    close() { closed = true; return Promise.resolve(); },
  };
  return { commands, socket, isClosed: () => closed, connect(address, options) {
    assert.deepEqual(address, { hostname: config.host, port: 465 });
    assert.equal(options.secureTransport, 'on'); return socket;
  } };
}
test('SMTP uses TLS, authentication and MIME-safe content; waits for DATA acceptance', async () => {
  const fake = server();
  await sendSmtp(config, mail, fake.connect);
  assert.equal(fake.commands[4], 'MAIL FROM:<contact@example.com>\r\n');
  assert.equal(fake.commands[5], 'RCPT TO:<contact@munhof.com.ar>\r\n');
  assert.match(fake.commands[7], /Reply-To: visitor@example.com\r\n/);
  assert.match(fake.commands[7], /Subject: =\?UTF-8\?B\?/);
  assert.match(fake.commands[7], /Content-Transfer-Encoding: base64/);
  assert.ok(fake.commands[7].endsWith('\r\n.\r\n'));
  assert.ok(fake.isClosed());
});
for (const scenario of ['rejectAuth', 'rejectData', 'disconnect']) test(`SMTP fails and closes on ${scenario}`, async () => {
  const fake = server({ [scenario]: true });
  await assert.rejects(sendSmtp(config, mail, fake.connect));
  assert.ok(fake.isClosed());
});
test('rejects header injection and insecure ports before connecting', async () => {
  const connect = () => { assert.fail('must not connect'); };
  await assert.rejects(sendSmtp(config, { ...mail, replyTo: 'a@example.com\r\nBcc: b@example.com' }, connect));
  await assert.rejects(sendSmtp({ ...config, port: 25 }, mail, connect));
});
