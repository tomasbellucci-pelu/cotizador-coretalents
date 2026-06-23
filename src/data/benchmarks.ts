// ─────────────────────────────────────────────────────────────────────────────
// BENCHMARKS — datos de referencia del Cotizador
//
// Fuente: docs/calculator/Formula.xlsx del repo Core Talents (hojas "BENCHAMRK CPM"
// y "Reach Performance"). Embebidos acá como constantes, fieles al prompt.
//
// Estructura:
//   CPM_BENCHMARK[plataforma][vertical][tier]            → número (CPM neto, ARS / 1.000 imp)
//   REACH_BENCHMARK[plataforma][vertical][scope][tier]   → string porcentaje (ej "22%")
//
// Plataformas: "Instagram" | "Tik Tok"
// Scopes:      "Post" | "Story"   (Story sólo existe en Instagram)
// Tiers:       "Celebrity" | "Mega" | "Macro" | "Mid Tier" | "Micro"
//
// PROD: en producción estas tablas viven en la DB (tablas benchmark_cpm /
// benchmark_reach) y se consultan vía API. El front sólo necesita la misma forma.
// ─────────────────────────────────────────────────────────────────────────────

export type PlatformKey = "Instagram" | "Tik Tok";
export type Tier = "Celebrity" | "Mega" | "Macro" | "Mid Tier" | "Micro";
export type Scope = "Post" | "Story";
export type VerticalKey =
  | "beauty"
  | "foodie"
  | "lifestyle"
  | "humor"
  | "moda"
  | "journalist"
  | "Industria"
  | "Other";

type CpmTable = Record<PlatformKey, Record<string, Record<Tier, number>>>;
type ReachTable = Record<PlatformKey, Record<string, Partial<Record<Scope, Record<Tier, string>>>>>;

export const BENCHMARKS: { cpm: CpmTable; reach: ReachTable } = {
  cpm: {
    Instagram: {
      beauty: { Celebrity: 19780.0, Mega: 22390.0, Macro: 16484.0, "Mid Tier": 48901.0, Micro: 75549.0 },
      foodie: { Celebrity: 8242.0, Mega: 13462.0, Macro: 15522.0, "Mid Tier": 19505.0, Micro: 79945.0 },
      lifestyle: { Celebrity: 21978.0, Mega: 26992.0, Macro: 38187.0, "Mid Tier": 39286.0, Micro: 62637.0 },
      humor: { Celebrity: 19780.0, Mega: 27610.0, Macro: 37637.0, "Mid Tier": 50412.0, Micro: 79945.0 },
      moda: { Celebrity: 19780.0, Mega: 22390.0, Macro: 21978.0, "Mid Tier": 36813.0, Micro: 90659.0 },
      journalist: { Celebrity: 19780.0, Mega: 22390.0, Macro: 30357.0, "Mid Tier": 41484.0, Micro: 94780.0 },
      Other: { Celebrity: 20604.0, Mega: 24863.0, Macro: 18544.0, "Mid Tier": 31593.0, Micro: 109890.0 },
      Industria: { Celebrity: 19780.0, Mega: 22390.0, Macro: 21978.0, "Mid Tier": 36813.0, Micro: 79945.0 },
    },
    "Tik Tok": {
      beauty: { Celebrity: 18132.0, Mega: 28709.0, Macro: 31593.0, "Mid Tier": 49451.0, Micro: 71703.0 },
      foodie: { Celebrity: 16484.0, Mega: 15797.0, Macro: 22390.0, "Mid Tier": 28846.0, Micro: 83104.0 },
      lifestyle: { Celebrity: 18132.0, Mega: 30632.0, Macro: 42445.0, "Mid Tier": 42033.0, Micro: 115934.0 },
      humor: { Celebrity: 18132.0, Mega: 53434.0, Macro: 33516.0, "Mid Tier": 69780.0, Micro: 83104.0 },
      moda: { Celebrity: 18132.0, Mega: 31319.0, Macro: 33516.0, "Mid Tier": 51099.0, Micro: 44231.0 },
      journalist: { Celebrity: 18132.0, Mega: 61401.0, Macro: 48764.0, "Mid Tier": 35027.0, Micro: 83104.0 },
      Other: { Celebrity: 21978.0, Mega: 35714.0, Macro: 23352.0, "Mid Tier": 48077.0, Micro: 71429.0 },
      Industria: { Celebrity: 18132.0, Mega: 31318.0, Macro: 33516.0, "Mid Tier": 41895.0, Micro: 83105.0 },
    },
  },
  reach: {
    Instagram: {
      beauty: {
        Post: { Celebrity: "10%", Mega: "15%", Macro: "20%", "Mid Tier": "22%", Micro: "25%" },
        Story: { Celebrity: "4%", Mega: "5%", Macro: "6%", "Mid Tier": "6%", Micro: "7%" },
      },
      foodie: {
        Post: { Celebrity: "30%", Mega: "14%", Macro: "25%", "Mid Tier": "25%", Micro: "30%" },
        Story: { Celebrity: "4%", Mega: "4%", Macro: "2%", "Mid Tier": "6%", Micro: "9%" },
      },
      lifestyle: {
        Post: { Celebrity: "15%", Mega: "12%", Macro: "11%", "Mid Tier": "24%", Micro: "38%" },
        Story: { Celebrity: "10%", Mega: "7%", Macro: "3%", "Mid Tier": "7%", Micro: "10%" },
      },
      humor: {
        Post: { Celebrity: "10%", Mega: "25%", Macro: "32%", "Mid Tier": "34%", Micro: "30%" },
        Story: { Celebrity: "4%", Mega: "6%", Macro: "8%", "Mid Tier": "8%", Micro: "9%" },
      },
      moda: {
        Post: { Celebrity: "10%", Mega: "15%", Macro: "20%", "Mid Tier": "19%", Micro: "20%" },
        Story: { Celebrity: "4%", Mega: "5%", Macro: "6%", "Mid Tier": "5%", Micro: "9%" },
      },
      journalist: {
        Post: { Celebrity: "10%", Mega: "15%", Macro: "26%", "Mid Tier": "34%", Micro: "30%" },
        Story: { Celebrity: "4%", Mega: "4%", Macro: "6%", "Mid Tier": "8%", Micro: "2%" },
      },
      Other: {
        Post: { Celebrity: "10%", Mega: "13%", Macro: "13%", "Mid Tier": "24%", Micro: "28%" },
        Story: { Celebrity: "4%", Mega: "5%", Macro: "3%", "Mid Tier": "4%", Micro: "5%" },
      },
      // NOTE: no existe "Industria" en REACH_BENCHMARK (ver fallback en lib/cotizador.ts)
    },
    "Tik Tok": {
      beauty: { Post: { Celebrity: "3%", Mega: "4%", Macro: "8%", "Mid Tier": "5%", Micro: "7%" } },
      foodie: { Post: { Celebrity: "10%", Mega: "10%", Macro: "25%", "Mid Tier": "30%", Micro: "15%" } },
      lifestyle: { Post: { Celebrity: "3%", Mega: "3%", Macro: "7%", "Mid Tier": "8%", Micro: "9%" } },
      humor: { Post: { Celebrity: "8%", Mega: "4%", Macro: "8%", "Mid Tier": "30%", Micro: "15%" } },
      moda: { Post: { Celebrity: "3%", Mega: "5%", Macro: "8%", "Mid Tier": "7%", Micro: "15%" } },
      journalist: { Post: { Celebrity: "3%", Mega: "5%", Macro: "4%", "Mid Tier": "3%", Micro: "15%" } },
      Other: { Post: { Celebrity: "3%", Mega: "10%", Macro: "2%", "Mid Tier": "7%", Micro: "15%" } },
      // NOTE: tampoco hay "Industria" para TikTok.
    },
  },
};

// ── Verticales disponibles en el selector (orden de UI) ──────────────────────
export const VERTICALS: { key: VerticalKey; label: string }[] = [
  { key: "beauty", label: "Beauty" },
  { key: "foodie", label: "Foodie" },
  { key: "lifestyle", label: "Lifestyle" },
  { key: "humor", label: "Humor" },
  { key: "moda", label: "Moda" },
  { key: "journalist", label: "Periodismo" },
  { key: "Industria", label: "Industria" },
  { key: "Other", label: "Otro" },
];

export const TIERS: Tier[] = ["Celebrity", "Mega", "Macro", "Mid Tier", "Micro"];

/** "22%" → 0.22 ; null/undefined → null */
export function parsePct(s: string | undefined | null): number | null {
  if (!s) return null;
  const n = Number.parseFloat(s.replace("%", "").trim());
  return Number.isFinite(n) ? n / 100 : null;
}
