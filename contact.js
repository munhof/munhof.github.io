const messages = {
  es: { loading: 'Preparando el formulario…', unavailable: 'El formulario no está disponible ahora. Podés escribirme por email.', ready: '', sending: 'Enviando…', sent: 'Tu mensaje fue aceptado para el envío. Gracias por escribirme.', error: 'No pudimos confirmar el envío. Conservamos tu mensaje; podés reintentar o escribirme por email.', verify: 'Completá la verificación para enviar.' },
  en: { loading: 'Preparing the form…', unavailable: 'The form is currently unavailable. You can email me directly.', ready: '', sending: 'Sending…', sent: 'Your message was accepted for sending. Thanks for getting in touch.', error: 'We could not confirm sending. Your message is preserved; try again or email me directly.', verify: 'Complete the verification to send.' },
};
export async function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;
  const status = document.getElementById('contact-status');
  const button = form.querySelector('button[type=submit]');
  let token = '', widget, busy = false, current = 'loading';
  const show = (key) => {
    current = key;
    status.textContent = (messages[document.documentElement.lang] || messages.es)[key];
  };
  new MutationObserver(() => show(current)).observe(document.documentElement, { attributes: true, attributeFilter: ['lang'] });
  show('loading');
  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (busy) return;
    if (!token) { show('verify'); return; }
    busy = true;
    button.disabled = true;
    form.setAttribute('aria-busy', 'true');
    show('sending');
    const data = Object.fromEntries(new FormData(form));
    try {
      const response = await fetch('/api/contact', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...data, token }), signal: AbortSignal.timeout(30000) });
      const result = await response.json();
      if (!response.ok || result.ok !== true) throw new Error('Send failed');
      form.reset();
      show('sent');
    } catch { show('error'); }
    finally {
      busy = false;
      token = '';
      form.setAttribute('aria-busy', 'false');
      window.turnstile.reset(widget);
    }
  });
  try {
    const response = await fetch('/api/contact', { signal: AbortSignal.timeout(10000) });
    if (!response.ok) throw new Error('Unavailable');
    const { siteKey } = await response.json();
    if (!siteKey) throw new Error('Unavailable');
    await new Promise((resolve, reject) => {
      const script = document.createElement('script');
      const timeout = setTimeout(() => reject(new Error('Timeout')), 15000);
      script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
      script.onload = () => { clearTimeout(timeout); resolve(); };
      script.onerror = () => { clearTimeout(timeout); reject(new Error('Unavailable')); };
      document.head.append(script);
    });
    widget = window.turnstile.render('#contact-verification', {
      sitekey: siteKey, action: 'contact', size: 'flexible',
      callback: (value) => { token = value; button.disabled = busy; },
      'expired-callback': () => { token = ''; button.disabled = true; },
      'error-callback': () => { token = ''; button.disabled = true; show('unavailable'); },
    });
    show('ready');
  } catch { show('unavailable'); }
}
