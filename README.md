# Estudio-3d
## Sonidos

La carpeta `sonidos/` contiene 12 efectos WAV que la IA puede usar en cada plano (campo `sfx` en `shots`). El catálogo (id, descripción y cuándo usarlo) está en `js/app.js`, en la sección «Biblioteca de sonidos».

Para que los efectos suenen, el proyecto debe abrirse desde un servidor local, porque el navegador no permite cargar archivos de la carpeta si abres `index.html` con doble clic. Por ejemplo, desde esta carpeta: `python3 -m http.server 8000` y luego abre http://localhost:8000.

El motor local (sin IA) todavía no usa estos efectos; solo los usan los motores con IA.
