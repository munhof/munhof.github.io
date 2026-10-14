# munhof.com.ar

Portafolio bilingüe y CV web de Facundo Munhó, publicado como sitio estático en
GitHub Pages.

## Una sola fuente de información

`data/profile.json` contiene los datos compartidos, la experiencia, la
formación, los proyectos y los textos en español e inglés. Tanto `index.html`
como `cv.html` se renderizan desde ese archivo.

La fuente pública no incluye teléfono ni domicilio exacto. El CV web utiliza
correo, LinkedIn, ubicación general y portafolio como datos de contacto.

Para actualizar la web y ambos CV:

1. Editar `data/profile.json`.
2. Validar estructura y traducciones con `python scripts/validate_profile.py`.
3. Abrir `index.html` mediante un servidor local, por ejemplo:

   ```bash
   python -m http.server 8000
   ```

4. Revisar `/` y `/cv.html?lang=es` y `/cv.html?lang=en`.

Desde la vista del CV, el botón **Guardar como PDF** abre la impresión del
navegador con estilos A4. Esto evita mantener archivos PDF desactualizados: se
generan siempre a partir de la misma información publicada.

## Estructura

- `data/profile.json`: fuente canónica bilingüe.
- `index.html`: portafolio.
- `cv.html`: CV imprimible en español e inglés.
- `script.js`: renderizado, idioma, tema y navegación.
- `style.css`: estilos responsive y de impresión.
- `scripts/validate_profile.py`: verifica que ES/EN compartan los mismos datos.
- `.github/workflows/validate.yml`: ejecuta la validación en cada PR.
- `CNAME`: dominio personalizado de GitHub Pages.

No se cargan repositorios automáticamente. Los proyectos destacados se eligen
en `data/profile.json` para mantener una narrativa profesional consistente.

## Formulario de contacto (Cloudflare Pages + Zoho SMTP)

El formulario ES/EN envía a `contact@munhof.com.ar`. La Function
`functions/api/contact.js` valida los datos y Turnstile antes de enviar por SMTP
con Zoho. El email del visitante se usa como Reply-To; el destinatario es fijo.
`lib/smtp.js` utiliza sockets de Cloudflare con TLS desde el inicio (puerto 465),
autenticación LOGIN, contenido MIME UTF-8 y un timeout total de 15 segundos.
Solo confirma el envío después de la aceptación SMTP del mensaje. Eso no garantiza
la entrega en bandeja de entrada. No requiere Resend ni dependencias de Node.js.

En Cloudflare: Workers & Pages → munhof-portfolio → Settings → Variables and
Secrets. Seleccionar Production: la rama redesign-cv-sync-2026 es la rama de
producción de este proyecto, aunque su dominio sea preview.munhof.com.ar.

| Nombre | Tipo | Valor |
| --- | --- | --- |
| SMTP_HOST | Texto | smtp.zoho.com |
| SMTP_PORT | Texto | 465 |
| SMTP_USER | Texto | facundo.munho@munhof.com.ar |
| SMTP_PASSWORD | Secreto | Contraseña de aplicación generada en Zoho Accounts |
| CONTACT_FROM | Texto | Portfolio <contact@munhof.com.ar> |
| TURNSTILE_SITE_KEY | Texto | Clave pública del widget |
| TURNSTILE_SECRET_KEY | Secreto | Clave privada del mismo widget |

CONTACT_FROM debe ser una dirección o alias autorizado en la cuenta SMTP_USER.
Autorizar los hostnames utilizados en el widget Turnstile. Mantener los registros
MX/SPF/DKIM de Zoho. No colocar secretos en Git, HTML ni JavaScript del navegador.
Eliminar RESEND_API_KEY si se había configurado: ya no se utiliza.

Después de publicar el código y guardar las variables, desplegar nuevamente:

```bash
cf pages deployments create munhof-portfolio --branch redesign-cv-sync-2026
```

GET /api/contact devuelve únicamente la clave pública si las variables necesarias
están configuradas; no valida la contraseña SMTP. Sin configuración, el formulario
queda deshabilitado y ofrece el enlace de correo directo. GitHub Pages y
python -m http.server no ejecutan Functions.

Validación local y CI:

```bash
node --test tests/*.test.mjs
python3 -B -m unittest discover -s tests
python3 scripts/validate_profile.py
node --check script.js
node --check contact.js
node --check functions/api/contact.js
node --check lib/smtp.js
```

Las pruebas simulan Turnstile y SMTP; no mandan correos. Tras desplegar, probar
Turnstile y un envío real desde el formulario, comprobar recepción en Zoho y
que al responder se usa el email del visitante. La limitación de frecuencia de
Cloudflare requiere configuración independiente; este cambio no agrega un cupo
diario ni activa una regla WAF automáticamente.
