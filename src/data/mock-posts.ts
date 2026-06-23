// ─────────────────────────────────────────────────────────────────────────────
// Mock del scrapeo de posteos de MARCA (Reels IG / posteos TikTok).
//
// PROD: este listado lo provee el scrapeador de Influencers Club (ya tenemos
// tokens). La API real devuelve la MISMA forma que este mock: fecha, link, views,
// marca y copy, ya filtrado a sólo contenido de marca (se excluyen orgánicos).
// Acá generamos data determinística por handle para que la demo sea estable.
// ─────────────────────────────────────────────────────────────────────────────

import { hashString, mulberry32, type Platform } from "@/lib/cotizador";

export interface BrandedPost {
  id: string;
  date: string; // ISO yyyy-mm-dd
  url: string;
  views: number;
  brand: string;
  copy: string;
  platform: Platform;
  /** Marcado por el usuario: ¿el posteo tuvo pauta (paid media) detrás? */
  hasPaid: boolean;
}

// Fecha de referencia del prototipo (today). Mantiene los posteos dentro de la ventana.
const REFERENCE_MS = Date.parse("2026-06-22T12:00:00");

const BRANDS = [
  "Samsung",
  "Coca-Cola",
  "Mercado Libre",
  "Sprite",
  "Renault",
  "L'Oréal Paris",
  "Sedal",
  "Pepsi",
  "Movistar",
  "Personal",
  "Quilmes",
  "Doritos",
  "Rexona",
  "Mercado Pago",
  "McDonald's",
  "Natura",
  "Maybelline",
  "Ualá",
  "Despegar",
  "Cabify",
];

const COPY_TEMPLATES = [
  "Probando lo nuevo de {brand} y no puedo con esto 🙌 #publicidad",
  "Día de campaña con {brand} 🎬 gracias por confiar en mí ✨",
  "Sorteo con {brand}! Mirá cómo participar 👀 #ad",
  "Mi rutina de siempre ahora con {brand} 💛 link en bio",
  "Spoiler: {brand} se lució con esto 🔥 ¿lo probarían?",
  "Colaboración soñada con {brand} 🤝 contame qué te parece",
  "Esto que armé con {brand} me tiene obsesionada 😍 #paid",
  "Unboxing del nuevo lanzamiento de {brand} 📦 #ad",
  "Detrás de cámara del último laburo con {brand} 🎥",
  "Cerramos el año a pura campaña con {brand} 🎉 #publicidad",
];

const PLATFORM_BASE: Record<Platform, string> = {
  instagram: "https://www.instagram.com/reel/",
  tiktok: "https://www.tiktok.com/@",
};

function pick<T>(arr: T[], rng: () => number): T {
  return arr[Math.floor(rng() * arr.length)];
}

function shortId(rng: () => number, len = 9): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz0123456789";
  let s = "";
  for (let i = 0; i < len; i++) s += chars[Math.floor(rng() * chars.length)];
  return s;
}

/**
 * Genera el listado de posteos de marca para un handle/plataforma/ventana.
 * `followers` se usa para que las views sean coherentes con el tamaño del perfil.
 * Los posteos con pauta arrancan marcados (hasPaid=true) para mostrar el mecanismo;
 * todo es editable desde la UI.
 */
export function generateBrandedPosts(
  handle: string,
  platform: Platform,
  followers: number,
  windowDays: number,
): BrandedPost[] {
  const clean = handle.replace(/^@/, "").trim().toLowerCase() || "perfil";
  const rng = mulberry32(hashString(`${clean}|${platform}|${windowDays}`));

  const count = 6 + Math.floor(rng() * 6); // 6..11 posteos
  const baseReach = 0.1 + rng() * 0.22; // reach "real" del perfil 10%..32%

  const posts: BrandedPost[] = [];
  for (let i = 0; i < count; i++) {
    const dayOffset = Math.floor(rng() * windowDays);
    const date = new Date(REFERENCE_MS - dayOffset * 86_400_000).toISOString().slice(0, 10);
    const paid = rng() < 0.32;
    const variance = 0.7 + rng() * 0.6; // 0.7..1.3
    const boost = paid ? 1.8 + rng() * 1.6 : 1; // pauta infla views 1.8x..3.4x
    const views = Math.max(500, Math.round(followers * baseReach * variance * boost));
    const brand = pick(BRANDS, rng);
    const copy = pick(COPY_TEMPLATES, rng).replace("{brand}", brand);
    const slug = shortId(rng);
    const url =
      platform === "instagram"
        ? `${PLATFORM_BASE.instagram}${slug}/`
        : `${PLATFORM_BASE.tiktok}${clean}/video/73${slug.replace(/\D/g, "0").slice(0, 8)}`;

    posts.push({
      id: `${platform}-${i}-${slug}`,
      date,
      url,
      views,
      brand,
      copy,
      platform,
      hasPaid: paid,
    });
  }

  // Garantizamos al menos 3 posteos SIN pauta para que la mediana sea representativa.
  let unpaid = posts.filter((p) => !p.hasPaid).length;
  if (unpaid < 3) {
    const paidSortedByViews = posts.filter((p) => p.hasPaid).sort((a, b) => a.views - b.views);
    for (const p of paidSortedByViews) {
      if (unpaid >= 3) break;
      p.hasPaid = false;
      unpaid++;
    }
  }

  return posts.sort((a, b) => (a.date < b.date ? 1 : -1));
}

// ── Estimación demográfica mock (scrapeador) ─────────────────────────────────
// PROD: lo trae el scrapeador (% de audiencia por país). Acá devolvemos un valor
// plausible y estable por handle+plataforma.
export function estimateArDemographics(handle: string, platform: Platform): number {
  const clean = handle.replace(/^@/, "").trim().toLowerCase() || "perfil";
  const rng = mulberry32(hashString(`dem|${clean}|${platform}`));
  // Perfiles AR: típicamente 60%..92% de audiencia argentina.
  return Math.round(60 + rng() * 32);
}

// ── Followers mock (scrapeador) ──────────────────────────────────────────────
// PROD: followers reales del perfil al momento del scrapeo. Mock estable por handle.
export function mockFollowers(handle: string, platform: Platform): number {
  const clean = handle.replace(/^@/, "").trim().toLowerCase() || "perfil";
  const rng = mulberry32(hashString(`fol|${clean}|${platform}`));
  // Distribución sesgada hacia mid-tier (lo más común en el roster).
  const r = rng();
  let base: number;
  if (r < 0.08) base = 1_200_000 + rng() * 3_500_000; // mega/celebrity
  else if (r < 0.22) base = 520_000 + rng() * 460_000; // macro
  else if (r < 0.8) base = 60_000 + rng() * 420_000; // mid tier (mayoría)
  else base = 12_000 + rng() * 36_000; // micro
  // TikTok suele tener un poco menos en este roster.
  const factor = platform === "tiktok" ? 0.55 + rng() * 0.5 : 1;
  return Math.round((base * factor) / 1000) * 1000;
}
