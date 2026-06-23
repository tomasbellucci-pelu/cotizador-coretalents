# DESIGN_NOTES — Cotizador (prototipo)

De dónde sale cada decisión visual. Todo se extrajo del repo **solo lectura**
`medialab-agency/core-talents` (carpeta `app/`, stack Vite + React 19 + Tailwind v4 +
shadcn sobre Base UI). El objetivo fue que el Cotizador se sienta una sección más de la
plataforma, no un proyecto aparte.

> ⚠️ El repo `core-talents` es **solo lectura**. Se clonó/leyó únicamente para entender el
> diseño. Este prototipo es un proyecto **independiente** y no toca ese repo.

## Stack replicado

| Pieza | Core Talents (`app/`) | Este prototipo |
|---|---|---|
| Bundler | Vite | Vite |
| UI | React 19 + TS | React 19 + TS |
| Estilos | Tailwind v4 (`@tailwindcss/vite`) | igual |
| Componentes | shadcn `style: base-nova` sobre **@base-ui/react** | mismas primitivas (copiadas) |
| Íconos | `lucide-react` + **Material Symbols Rounded** | igual |
| Tipografía | system stack → Inter | igual (Inter + Material Symbols por Google Fonts) |
| Routing | `react-router-dom` v7 | igual |
| Toasts | `sonner` | igual |

Las primitivas de `src/components/ui/*` (button, card, badge, switch, input, label, select,
tabs, tooltip, textarea, separator, avatar, sonner, skeleton) y los compuestos
`section-title`, `kpi-card`, `page-header`, `page`, `empty-state`, `form-section` se
**copiaron tal cual** del repo para garantizar fidelidad. `src/index.css` es el theme del repo
con un único agregado (`@theme inline`) que reemplaza el `@import "shadcn/tailwind.css"`.

## Design tokens (de `app/src/index.css`)

- **Primario / brand**: indigo `#4f46e5` (`--primary`, `--ring`). Acento cálido naranja
  `#f97316` / `#f59e0b` (barra activa del sidebar, botón "add", CTA "Dar de alta").
- **Neutrales**: escala `slate` (`#0f172a` texto, `#64748b` secundario, `#e2e8f0` bordes,
  `#fafafa` fondo de app y contenido).
- **Semáforo**: success `#10b981`, warning `#f59e0b`, danger `#f43f5e`, info `#3b82f6`.
- **Radios**: `--radius: 0.5rem`; cards `rounded-2xl` (1rem); inputs/botones `rounded-xl`.
- **Sombras "editorial"**: `--shadow-editorial*` (ring sutil + blur), usadas en popovers/cards.
- **Gradientes**: `.premium-gradient` (indigo) usado como acento superior en las cards de
  tarifa; `.warm-gradient` (naranja).
- **Animaciones**: `animate-fade-in-up`, `animate-fade-in`, `card-lift` (hover de cards),
  `ct-scrollbar`, `ct-table-header` (headers de tabla en mayúsculas, 10px, tracking).

## Patrones de layout (de `app/src/components/layout/*`)

- **Shell**: `flex h-screen`, sidebar fija `w-60` blanca con `border-r`, main `ml-60`,
  `px-8 py-7`, `max-w-[1400px] mx-auto`, fondo `#FAFAFA`.
- **Sidebar**: logo "CT" (cuadrado `rounded-xl bg-slate-900`), labels de sección en mayúsculas
  10px, ítems con ícono Material Symbols + barra activa naranja a la izquierda + fondo
  `slate-100`. Replicamos el nav real (Leads, Campañas, Talentos, Clientes) y agregamos la
  sección **Herramientas → Cotizador** (con badge "Nuevo").
- **Header**: sticky `h-14`, trigger de búsqueda (⌘K), notificaciones, chip de usuario.
- **PageHeader / KpiCard / SectionTitle**: reutilizados del repo para que títulos y métricas
  se vean idénticos.

## El modal "Nuevo talento" (A7)

`src/pages/cotizador/components/alta-dialog.tsx` replica visualmente
`app/src/pages/talents/create-dialog.tsx`: overlay `bg-slate-900/50 backdrop-blur-sm`, panel
blanco `rounded-2xl` con header + botón cerrar, bloques de redes, país/vertical y checkbox
"Exclusivo Core Talents". La diferencia: viene **pre-cargado** por el cotizador (handles,
followers, reach post/story, demografía y tarifas) y al confirmar muestra estado de éxito.

## El único componente "nuevo" de diseño

`platform-icon.tsx`: el repo trae un `PlatformIcon` con labels de texto ("IG"/"TT"). Para esta
herramienta el equipo pidió **logos reales** de Instagram y TikTok, así que se reemplazó por
SVGs de marca (glifos de simple-icons) sobre el gradiente oficial de Instagram y el negro de
TikTok. Se usan junto a los inputs de handle (A1) y en todos los headers de plataforma.

## Decisión documentada: Story = Post / 3

La plataforma productiva (`app/src/lib/pricing.ts`) modela la story con un multiplicador de
**3.16** sobre el *reach de story*. El spec de **este** Cotizador definió el modelo simplificado
**Story IG = Tarifa Post IG / 3**. El prototipo implementa el modelo del spec y lo deja anotado
con un comentario `// PROD:` en `src/lib/cotizador.ts` para que el equipo decida en producción.
