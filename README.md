# DATEX

¿El clima está cambiando de verdad? DATEX separa el cambio real de las falsas alarmas con 40 años de datos de la NASA.

Hecho por Boreal Labs para el NASA Space Apps Challenge 2026.

## Desarrollo

```bash
npm install
npm run dev
```

Abre http://localhost:5173. Sin backend, la app funciona con los datos precalculados de `public/static-api`.
Para usar un backend propio, copia `.env.example` a `.env.local` y define `VITE_API_URL`.

## Producción

```bash
npm run build
npm run preview
```

El sitio queda en `dist/` y es estático: sirve en GitHub Pages, Netlify, Vercel o cualquier hosting de archivos.
