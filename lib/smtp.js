// Minimal SMTP submission over implicit TLS (465), using Cloudflare's socket API.
// No credentials or message content are logged or included in errors.
const encode = (value) => btoa(String.fromCharCode(...new TextEncoder().encode(value)));
const mailbox = (value) => {
  if (typeof value !== 'string' || /[\r\n]/.test(value)) throw new Error('Invalid address');
  const match = value.match(/^(?:[^<>]*<)?([^<>\s@]+@[^<>\s@]+\.[^<>\s@]+)>?$/);
  if (!match) throw new Error('Invalid address');
  return match[1];
};
export async function sendSmtp(config, mail, connectSocket) {
  if (!config.host || Number(config.port) !== 465 || !config.user || !config.password) throw new Error('Invalid SMTP configuration');
  const from = mailbox(config.from), to = mailbox(mail.to), replyTo = mailbox(mail.replyTo);
  if (/[\r\n]/.test(mail.subject)) throw new Error('Invalid subject');
  const connect = connectSocket || (await import('cloudflare:sockets')).connect;
  const socket = connect({ hostname: config.host, port: 465 }, { secureTransport: 'on' });
  // Consume connection errors as well as stream errors.
  socket.closed?.catch(() => {});
  const reader = socket.readable.getReader(), writer = socket.writable.getWriter();
  const decoder = new TextDecoder();
  let buffer = '', timer;
  const timeout = new Promise((_, reject) => {
    timer = setTimeout(() => reject(new Error('SMTP timeout')), 15000);
  });
  async function expect(code) {
    let total = 0;
    while (true) {
      let end;
      while ((end = buffer.indexOf('\r\n')) < 0) {
        const { done, value } = await reader.read();
        if (done) throw new Error('SMTP disconnected');
        total += value.byteLength;
        if (total > 65536) throw new Error('SMTP response too large');
        buffer += decoder.decode(value, { stream: true });
      }
      const line = buffer.slice(0, end); buffer = buffer.slice(end + 2);
      if (!/^\d{3}[ -]/.test(line) || Number(line.slice(0, 3)) !== code) throw new Error('SMTP rejected request');
      if (line[3] === ' ') return;
    }
  }
  async function command(text, code) {
    await writer.write(new TextEncoder().encode(`${text}\r\n`));
    await expect(code);
  }
  async function deliver() {
    await socket.opened;
    await expect(220);
    await command('EHLO munhof.com.ar', 250);
    await command('AUTH LOGIN', 334);
    await command(encode(config.user), 334);
    await command(encode(config.password), 235);
    await command(`MAIL FROM:<${from}>`, 250);
    await command(`RCPT TO:<${to}>`, 250);
    await command('DATA', 354);
    const body = encode(mail.text).match(/.{1,76}/g)?.join('\r\n') || '';
    const message = [
      `From: ${config.from}`, `To: ${to}`, `Reply-To: ${replyTo}`,
      `Subject: ${Array.from(mail.subject).join('').match(/.{1,10}/gu).map(part => `=?UTF-8?B?${encode(part)}?=`).join('\r\n ')}`,
      `Date: ${new Date().toUTCString()}`,
      `Message-ID: <${crypto.randomUUID()}@munhof.com.ar>`,
      'MIME-Version: 1.0', 'Content-Type: text/plain; charset=UTF-8',
      'Content-Transfer-Encoding: base64', '', body, '.',
    ].join('\r\n');
    await command(message, 250);
    // Acceptance of DATA is the success boundary, independent of QUIT/close.
  }
  try {
    await Promise.race([deliver(), timeout]);
  } finally {
    clearTimeout(timer);
    await socket.close().catch(() => {});
  }
}
