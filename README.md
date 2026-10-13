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

## Formulario de contacto (Cloudflare Pages)

El formulario ES/EN envía a `contact@munhof.com.ar`. La Function
`functions/api/contact.js` valida los datos y Turnstile antes de enviar mediante
Resend; el email del visitante se usa como Reply-To. No almacena consultas.
Un envío aceptado por el proveedor no garantiza entrega en bandeja de entrada.

Configurar en el proyecto Pages, para cada entorno que deba enviar:

- `TURNSTILE_SITE_KEY`: clave pública del widget, con los dominios del sitio autorizados.
- `TURNSTILE_SECRET_KEY`: secreto de validación del mismo widget.
- `RESEND_API_KEY`: secreto de Resend con permiso de envío para el dominio verificado.
- `CONTACT_FROM`: remitente autorizado, por ejemplo `Portfolio <website@munhof.com.ar>`.

Verificar el dominio de envío en Resend siguiendo sus registros DNS; conservar
los MX de recepción de Zoho. No colocar secretos en archivos públicos ni Git.
Redeployar Pages después de configurar variables. No se requiere npm build.
GitHub Pages y `python -m http.server` no ejecutan Functions: el formulario queda
inhabilitado y ofrece el enlace de email. Sin credenciales también falla cerrado.

Validación local: `node --test tests/contact.test.mjs`,
`python3 -B -m unittest discover -s tests`, `python3 scripts/validate_profile.py`,
`node --check script.js` y `node --check contact.js`.
Las pruebas usan servicios simulados y no mandan correos. Antes de publicar,
probar ES/EN en móvil y escritorio, Turnstile, fallos de conexión y un envío real
con respuesta desde Zoho. Verificar que el mensaje conserva el Reply-To correcto.
