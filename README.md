# munhof.com.ar

Portafolio bilingüe y CV web de Facundo Munhó, publicado como sitio estático en
GitHub Pages.

## Una sola fuente de información

`data/profile.json` contiene los datos compartidos, la experiencia, la
formación, los proyectos y los textos en español e inglés. Tanto `index.html`
como `cv.html` se renderizan desde ese archivo.

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
