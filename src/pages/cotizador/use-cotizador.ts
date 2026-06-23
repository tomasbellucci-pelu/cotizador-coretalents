import { useCallback, useMemo, useState } from "react";
import type { VerticalKey } from "@/data/benchmarks";
import {
  type BrandedPost,
  estimateArDemographics,
  generateBrandedPosts,
  mockFollowers,
} from "@/data/mock-posts";
import type { CrmTalent } from "@/data/mock-talents";
import { type Platform, PLATFORM_BENCHMARK_KEY } from "@/lib/cotizador";
import { computePlatformResult, type PlatformResult } from "@/lib/engine";

export type DemMode = "estimate" | "manual";

export interface PlatformFlowState {
  active: boolean;
  handle: string;
  followers: number;
  demArPct: number;
  demMode: DemMode;
  posts: BrandedPost[];
}

export interface CotizadorState {
  windowDays: number;
  vertical: VerticalKey | null;
  instagram: PlatformFlowState;
  tiktok: PlatformFlowState;
}

const emptyPlatform = (): PlatformFlowState => ({
  active: false,
  handle: "",
  followers: 0,
  demArPct: 0,
  demMode: "estimate",
  posts: [],
});

const initialState = (): CotizadorState => ({
  windowDays: 90,
  vertical: null,
  instagram: emptyPlatform(),
  tiktok: emptyPlatform(),
});

export function useCotizador() {
  const [state, setState] = useState<CotizadorState>(initialState);

  const patchPlatform = useCallback(
    (platform: Platform, patch: Partial<PlatformFlowState>) => {
      setState((s) => ({ ...s, [platform]: { ...s[platform], ...patch } }));
    },
    [],
  );

  const reset = useCallback(() => setState(initialState()), []);

  const setWindowDays = useCallback((windowDays: number) => setState((s) => ({ ...s, windowDays })), []);
  const setVertical = useCallback((vertical: VerticalKey) => setState((s) => ({ ...s, vertical })), []);
  const setHandle = useCallback(
    (platform: Platform, handle: string) => patchPlatform(platform, { handle }),
    [patchPlatform],
  );

  const setPauta = useCallback((platform: Platform, postId: string, hasPaid: boolean) => {
    setState((s) => ({
      ...s,
      [platform]: {
        ...s[platform],
        posts: s[platform].posts.map((p) => (p.id === postId ? { ...p, hasPaid } : p)),
      },
    }));
  }, []);

  const setDemMode = useCallback(
    (platform: Platform, demMode: DemMode) => patchPlatform(platform, { demMode }),
    [patchPlatform],
  );
  const setDemValue = useCallback(
    (platform: Platform, demArPct: number) =>
      patchPlatform(platform, { demArPct: Math.max(0, Math.min(100, Math.round(demArPct))) }),
    [patchPlatform],
  );

  /** Re-estima la demografía (mock del scrapeador) y la deja en modo "estimate". */
  const estimateDem = useCallback(
    (platform: Platform) => {
      setState((s) => {
        const ps = s[platform];
        return {
          ...s,
          [platform]: {
            ...ps,
            demArPct: estimateArDemographics(ps.handle, platform),
            demMode: "estimate",
          },
        };
      });
    },
    [],
  );

  /** Re-genera los posteos de una plataforma (al cambiar la ventana o re-scrapear). */
  const rescrape = useCallback((platform: Platform) => {
    setState((s) => {
      const ps = s[platform];
      if (!ps.active) return s;
      return {
        ...s,
        [platform]: {
          ...ps,
          posts: generateBrandedPosts(ps.handle, platform, ps.followers, s.windowDays),
        },
      };
    });
  }, []);

  /** Cambia la ventana temporal y re-scrapea las plataformas activas. */
  const setWindowAndRescrape = useCallback((windowDays: number) => {
    setState((s) => {
      const next: CotizadorState = { ...s, windowDays };
      for (const platform of ["instagram", "tiktok"] as Platform[]) {
        const ps = s[platform];
        if (ps.active) {
          next[platform] = {
            ...ps,
            posts: generateBrandedPosts(ps.handle, platform, ps.followers, windowDays),
          };
        }
      }
      return next;
    });
  }, []);

  /**
   * FLUJO A — "Calcular": para cada handle cargado, activa la plataforma,
   * trae followers (mock scrapeo), estima demografía y genera los posteos.
   */
  const calculateNew = useCallback(() => {
    setState((s) => {
      const build = (platform: Platform): PlatformFlowState => {
        const ps = s[platform];
        const handle = ps.handle.replace(/^@/, "").trim();
        if (!handle) return { ...emptyPlatform(), handle: ps.handle };
        const followers = mockFollowers(handle, platform);
        return {
          active: true,
          handle: ps.handle,
          followers,
          demArPct: estimateArDemographics(handle, platform),
          demMode: "estimate",
          posts: generateBrandedPosts(handle, platform, followers, s.windowDays),
        };
      };
      return { ...s, instagram: build("instagram"), tiktok: build("tiktok") };
    });
  }, []);

  /**
   * FLUJO B — inicializa desde un talento del CRM: handles, followers y
   * demografía YA cargados; genera los posteos con el mismo scrapeo.
   */
  const initFromTalent = useCallback((talent: CrmTalent) => {
    setState((s) => {
      const build = (platform: Platform): PlatformFlowState => {
        const p = talent.platforms[platform];
        if (!p) return emptyPlatform();
        return {
          active: true,
          handle: p.handle,
          followers: p.followers,
          demArPct: talent.demographicsAr[platform] ?? estimateArDemographics(p.handle, platform),
          demMode: "manual", // viene del CRM (editable / re-estimable)
          posts: generateBrandedPosts(p.handle, platform, p.followers, s.windowDays),
        };
      };
      return {
        ...s,
        vertical: talent.vertical,
        instagram: build("instagram"),
        tiktok: build("tiktok"),
      };
    });
  }, []);

  // ── Resultados derivados (motor) ───────────────────────────────────────────
  const results = useMemo(() => {
    const out: Partial<Record<Platform, PlatformResult>> = {};
    for (const platform of ["instagram", "tiktok"] as Platform[]) {
      const ps = state[platform];
      if (!ps.active) continue;
      out[platform] = computePlatformResult({
        platform,
        handle: ps.handle,
        followers: ps.followers,
        posts: ps.posts,
        demArPct: ps.demArPct,
        vertical: state.vertical,
      });
    }
    return out;
  }, [state]);

  const activePlatforms = useMemo(
    () => (["instagram", "tiktok"] as Platform[]).filter((p) => state[p].active),
    [state],
  );

  return {
    state,
    results,
    activePlatforms,
    actions: {
      reset,
      setWindowDays,
      setWindowAndRescrape,
      setVertical,
      setHandle,
      setPauta,
      setDemMode,
      setDemValue,
      estimateDem,
      rescrape,
      calculateNew,
      initFromTalent,
    },
  };
}

export const PLATFORM_KEYS: Platform[] = ["instagram", "tiktok"];
export { PLATFORM_BENCHMARK_KEY };
