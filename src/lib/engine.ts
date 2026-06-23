// ─────────────────────────────────────────────────────────────────────────────
// Motor del Cotizador: combina posteos + reach + demografía + benchmarks → tarifas.
// Función pura, una corrida por plataforma.
// ─────────────────────────────────────────────────────────────────────────────

import type { VerticalKey } from "@/data/benchmarks";
import type { BrandedPost } from "@/data/mock-posts";
import {
  compareReach,
  computeReach,
  computeTariffPost,
  getCpm,
  getReachBenchmark,
  median,
  type Platform,
  type ReachVerdict,
  roundTariff,
  STORY_DIVISOR,
  tierForFollowers,
  TIER_RANGE_LABEL,
} from "@/lib/cotizador";
import type { ReachBenchmarkResult } from "@/lib/cotizador";
import type { Tier } from "@/data/benchmarks";

export interface PlatformInput {
  platform: Platform;
  handle: string;
  followers: number;
  posts: BrandedPost[];
  demArPct: number; // 0–100
  vertical: VerticalKey | null; // null = todavía no se eligió la vertical
}

export interface PlatformResult {
  platform: Platform;
  handle: string;
  followers: number;
  tier: Tier;
  tierRange: string;
  totalPosts: number;
  postsSinPauta: number;
  medianViewsSinPauta: number;
  reachFrac: number; // reach calculado = mediana(sin pauta) / followers
  demArPct: number;
  cpm: number | null;
  benchReach: ReachBenchmarkResult; // reach benchmark (scope Post) — para comparar
  reachVerdict: ReachVerdict | null;
  tariffPost: number | null; // tarifa post (redondeada)
  tariffStory: number | null; // sólo Instagram (post / 3)
}

export function computePlatformResult(input: PlatformInput): PlatformResult {
  const { platform, handle, followers, posts, demArPct, vertical } = input;

  // A4 — mediana de views considerando SOLO posteos sin pauta.
  const sinPauta = posts.filter((p) => !p.hasPaid);
  const medianViews = median(sinPauta.map((p) => p.views));
  const reachFrac = computeReach(medianViews, followers);

  // Tier automático por followers.
  const tier = tierForFollowers(followers);

  // A5 — comparación de reach puro vs benchmark (scope Post, sin demografía).
  // Sin vertical elegida todavía no hay benchmark ni tarifa (sólo mediana/reach/tier).
  const benchReach: ReachBenchmarkResult = vertical
    ? getReachBenchmark(platform, vertical, tier, "Post")
    : { pct: null, isFallback: false, usedVertical: "Other" };
  const reachVerdict: ReachVerdict | null =
    benchReach.pct != null ? compareReach(reachFrac, benchReach.pct) : null;

  // A6 — tarifas.
  const cpm = vertical ? getCpm(platform, vertical, tier) : null;
  const rawPost = cpm != null ? computeTariffPost(reachFrac, demArPct, followers, cpm) : null;
  const tariffPost = rawPost != null ? roundTariff(rawPost) : null;
  const tariffStory =
    platform === "instagram" && tariffPost != null
      ? roundTariff(tariffPost / STORY_DIVISOR)
      : null;

  return {
    platform,
    handle,
    followers,
    tier,
    tierRange: TIER_RANGE_LABEL[tier],
    totalPosts: posts.length,
    postsSinPauta: sinPauta.length,
    medianViewsSinPauta: medianViews,
    reachFrac,
    demArPct,
    cpm,
    benchReach,
    reachVerdict,
    tariffPost,
    tariffStory,
  };
}
