# Cotizador · Core Talents (prototipo)

Prototipo **navegable** de la nueva sección **Cotizador** para la plataforma Core Talents de
Media Lab. Sirve como **referencia visual y funcional** para el equipo de desarrollo: se ve y se
comporta como real, pero los datos del scrapeo son mockeados.

El Cotizador calcula **cuánto debería cobrar un perfil** (nuevo o ya en el CRM) a partir de la
performance real de sus posteos de marca, la demografía de la audiencia y los benchmarks de
CPM / Reach por plataforma, tier y vertical.

## Cómo correrlo

```bash
npm install
npm run dev      # http://localhost:5174
```

Build de producción:

```bash
npm run build    # typecheck + bundle a /dist
npm run preview
```

Requiere Node 20+ (probado con Node 24).

## Qué hace

Todo pasa en **una sola página**: arriba elegís el tipo de perfil y, a medida que completás
cada paso, la información va apareciendo más abajo (no te lleva a secciones nuevas).

**Paso 1 — selector:** elegís entre **Talento nuevo** o **Talento existente** (es una selección,
no dos herramientas distintas).

### Flujo A — Talento nuevo
1. Cargás handle de Instagram y/o TikTok (con el logo de cada red) + ventana 30/60/90 días.
2. "Calcular" → estado de carga → listado de posteos de **marca** por red (fecha, link, views,
   marca, copy).
3. Marcás **pauta sí/no** por posteo (toggle).
4. Calcula **mediana de views sin pauta** → **reach = mediana / followers**. Completás el
   **% de audiencia AR** (botón *Estimar* mock, o *Manual*), independiente por plataforma.
5. Elegís la **vertical**: badge verde/rojo si el reach está por encima/por debajo del benchmark
   (reach puro, sin demografía). El **tier** sale automático de los followers.
6. **Tarifas**: Post IG, Story IG (= Post IG / 3) y Post TikTok, cada una con su CPM.
7. **Dar de alta**: abre el modal "Nuevo talento" precargado (redes, followers, reach por
   post/story, demografía y tarifas) y confirma con estado de éxito.

### Flujo B — Talento existente
Igual que A, pero (1) buscás y seleccionás un talento del CRM (demografía precargada, editable);
y (2) al final ves una **tabla comparativa** Tarifa actual vs recomendada vs Δ (y %) por tipo,
con sugerencia de ajuste y botón **"Actualizar tarifas"**.

## Real vs mock

**Funciona de verdad (sobre la data mock):** mediana, reach, tier automático, comparación vs
benchmark, cálculo de tarifas, story = post/3, y la comparación de tarifas del Flujo B.

**Mockeado (lo que en prod viene de una API):**
- El **listado de posteos de marca** → en prod lo provee el scrapeador **Influencers Club**
  (ya tenemos tokens). El mock devuelve la misma forma.
- La **estimación de demografía** y los **followers** → scrapeador.
- El **alta** y el **update de tarifas** → no persisten (sólo muestran confirmación).

Cada simulación está marcada con un comentario `// PROD:` en el código indicando qué se
reemplaza. Los benchmarks (`src/data/benchmarks.ts`) están embebidos tal cual la fuente.

## Estructura

```
src/
  data/         benchmarks.ts (CPM/Reach), mock-posts.ts (scrapeo), mock-talents.ts (CRM)
  lib/          cotizador.ts (tiers, reach, tarifas, formato), engine.ts (motor por plataforma)
  components/   ui/* y composed/* (copiados del repo) · layout/* (shell) · platform-icon (logos)
  pages/
    cotizador/  index.tsx, flow-new.tsx, flow-existing.tsx, use-cotizador.ts, components/*
    talents/    list.tsx (lista de referencia del CRM)
```

Ver [`DESIGN_NOTES.md`](./DESIGN_NOTES.md) para el detalle de tokens y patrones replicados.

## ⚠️ Recordatorio importante

El repo original **`medialab-agency/core-talents` es SOLO LECTURA**. Se usó únicamente para
entender el diseño y el sistema de componentes. **Este prototipo es un proyecto independiente** y
no debe integrarse ni pushearse a ese repo.
