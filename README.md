# DATEX

¿El clima está cambiando de verdad? DATEX separa el cambio real de las falsas alarmas con 40 años de datos de la NASA.

Hecho por Boreal Labs para el NASA Space Apps Challenge 2026.

**Web publicada:** https://jamesjsfouam.github.io/Datexv2/

## Qué incluye

- Veredicto honesto de tendencia climática para cualquier punto del planeta (NASA POWER, 17 variables mensuales desde 1981).
- Comparación de lugares, imágenes satelitales, población de la ONU frente al ritmo lineal y relación clima–sociedad.
- **Ciudad 3D:** escenario de crecimiento urbano por celdas de 100 m (Managua), con población urbana, ingreso y clima como impulsores. Es un escenario, no una predicción: ver `public/static-api/city/`.
- Datos del Banco Mundial completos para Nicaragua, México, Brasil y Argelia.

## Créditos

Base de la web: [Jose21NC/datex](https://github.com/Jose21NC/datex). Datos: NASA POWER (MERRA-2 y CERES), NASA GIBS, Landsat y Sentinel-2 vía Microsoft Planetary Computer, ONU (World Population Prospects) vía Our World in Data, Banco Mundial, Open-Meteo, Esri/Impact Observatory (cobertura del suelo) y Copernicus DEM.

Partes del código y de la documentación se generaron con ayuda de IA (Claude, de Anthropic) y fueron revisadas por el equipo.

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
