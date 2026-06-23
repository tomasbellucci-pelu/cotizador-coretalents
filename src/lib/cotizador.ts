// ─────────────────────────────────────────────────────────────────────────────
// Lógica del Cotizador — TODA real (corre sobre la data mock).
// Lo único mockeado es el scrapeo (posteos, followers, estimación demográfica).
// ─────────────────────────────────────────────────────────────────────────────

import {
  BENCHMARKS,
  type PlatformKey,
  parsePct,
  type Scope,
  type Tier,
  type VerticalKey,
} from "@/data/benchmarks";

export type Platform = "instagram" | "tiktok";

export const PLATFORM_LABEL: Record<Platform, string> = {
  instagram: "Instagram",
  tiktok: "TikTok",
};

/** Mapea la plataforma interna a la clave usada en las tablas de benchmark. */
export const PLATFORM_BENCHMARK_KEY: Record<Platform, PlatformKey> = {
  instagram: "Instagram",
  tiktok: "Tik Tok",
};

// ── Tiers por followers ──────────────────────────────────────────────────────
// Celebrity > 5M | Mega 1–5M | Macro 500k–1M | Mid Tier 50k–500k | Micro 0–50k
export function tierForFollowers(followers: number): Tier {
  if (followers > 5_000_000) return "Celebrity";
  if (followers >= 1_000_000) return "Mega";
  if (followers >= 500_000) return "Macro";
  if (followers >= 50_000) return "Mid Tier";
  return "Micro";
}

export const TIER_RANGE_LABEL: Record<Tier, string> = {
  Celebrity: "> 5M",
  Mega: "1M – 5M",
  Macro: "500k – 1M",
  "Mid Tier": "50k – 500k",
  Micro: "0 – 50k",
};

// ── Estadística ──────────────────────────────────────────────────────────────
/** Mediana de un array de números. Devuelve 0 si está vacío. */
export function median(values: number[]): number {
  if (values.length === 0) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 0 ? (sorted[mid - 1] + sorted[mid]) / 2 : sorted[mid];
}

/** Reach del perfil = mediana de views (sin pauta) / followers. Fracción 0–1. */
export function computeReach(medianViewsSinPauta: number, followers: number): number {
  if (!followers || followers <= 0) return 0;
  return medianViewsSinPauta / followers;
}

// ── Benchmarks ───────────────────────────────────────────────────────────────
export function getCpm(platform: Platform, vertical: VerticalKey, tier: Tier): number | null {
  const pk = PLATFORM_BENCHMARK_KEY[platform];
  return BENCHMARKS.cpm[pk]?.[vertical]?.[tier] ?? null;
}

export interface ReachBenchmarkResult {
  /** Fracción 0–1, o null si no hay dato ni fallback. */
  pct: number | null;
  /** true cuando se usó "Other" como proxy (caso Industria). */
  isFallback: boolean;
  /** Vertical efectivamente usada para la búsqueda. */
  usedVertical: VerticalKey;
}

/**
 * Busca el % de Reach Performance benchmark para platform + vertical + tier + scope.
 *
 * FALLBACK Industria: REACH_BENCHMARK no tiene la vertical "Industria"
 * (sólo CPM_BENCHMARK la tiene). Cuando la vertical es "Industria" usamos
 * "Other" como proxy y marcamos isFallback=true para avisarlo en la UI.
 */
export function getReachBenchmark(
  platform: Platform,
  vertical: VerticalKey,
  tier: Tier,
  scope: Scope = "Post",
): ReachBenchmarkResult {
  const pk = PLATFORM_BENCHMARK_KEY[platform];
  const direct = parsePct(BENCHMARKS.reach[pk]?.[vertical]?.[scope]?.[tier]);
  if (direct != null) return { pct: direct, isFallback: false, usedVertical: vertical };

  // Fallback: Industria (o cualquier vertical sin reach) → Other
  const proxy = parsePct(BENCHMARKS.reach[pk]?.Other?.[scope]?.[tier]);
  if (proxy != null) return { pct: proxy, isFallback: true, usedVertical: "Other" };

  return { pct: null, isFallback: false, usedVertical: vertical };
}

// ── Tarifas ──────────────────────────────────────────────────────────────────
export const STORY_DIVISOR = 3; // Story IG = Tarifa post IG / 3 (según spec del Cotizador).
// PROD: la plataforma productiva usa un multiplicador de 3.16 sobre el reach de
// story (lib/pricing.ts → PLATFORM_CONTENT_TYPES). El Cotizador usa el modelo
// simplificado Post/3 que definió el equipo para esta herramienta.

/**
 * Tarifa de un post.
 *   Tarifa_post = (reachFrac × demArFrac × followers) / 1000 × CPM
 * donde demArPct viene 0–100. Devuelve el valor crudo (sin redondear).
 */
export function computeTariffPost(
  reachFrac: number,
  demArPct: number,
  followers: number,
  cpm: number,
): number {
  return ((reachFrac * (demArPct / 100) * followers) / 1000) * cpm;
}

/** Redondeo de tarifa a los $1.000 más cercanos (presentación). */
export function roundTariff(n: number): number {
  return Math.max(0, Math.round(n / 1000) * 1000);
}

// ── Comparación de reach vs benchmark (reach puro, sin demografía) ───────────
export type ReachVerdict = "above" | "below" | "on_par";

export function compareReach(calcFrac: number, benchFrac: number): ReachVerdict {
  const diff = calcFrac - benchFrac;
  const tol = benchFrac * 0.03; // ±3% relativo se considera "en línea"
  if (diff > tol) return "above";
  if (diff < -tol) return "below";
  return "on_par";
}

// ── Formato ──────────────────────────────────────────────────────────────────
const ARS = new Intl.NumberFormat("es-AR", {
  style: "currency",
  currency: "ARS",
  maximumFractionDigits: 0,
});

export function fmtARS(n: number): string {
  return ARS.format(n);
}

export function fmtPct(frac: number, decimals = 1): string {
  return `${(frac * 100).toFixed(decimals)}%`;
}

export function fmtFollowers(n: number): string {
  return n.toLocaleString("es-AR");
}

export function fmtCompact(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1).replace(/\.0$/, "")}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1).replace(/\.0$/, "")}K`;
  return n.toLocaleString("es-AR");
}

// ── RNG sembrado (mock determinístico por handle) ────────────────────────────
// Sirve para que un mismo handle siempre genere los mismos followers/posteos.
export function hashString(str: string): number {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

export function mulberry32(seed: number): () => number {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
