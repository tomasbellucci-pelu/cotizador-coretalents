import { PlatformIcon } from "@/components/composed/platform-icon";
import { fmtARS, fmtFollowers, fmtPct, type Platform } from "@/lib/cotizador";
import type { PlatformResult } from "@/lib/engine";

export interface TariffCardData {
  key: string;
  platform: Platform;
  contentLabel: string;
  amount: number | null;
  breakdown: string;
}

/** Arma las cards de tarifas a partir de los resultados por plataforma. */
export function buildTariffCards(
  results: Partial<Record<Platform, PlatformResult>>,
): TariffCardData[] {
  const cards: TariffCardData[] = [];
  const ig = results.instagram;
  const tt = results.tiktok;

  if (ig) {
    cards.push({
      key: "post-ig",
      platform: "instagram",
      contentLabel: "Post / Reel",
      amount: ig.tariffPost,
      breakdown: `${fmtPct(ig.reachFrac)} × ${ig.demArPct}% AR × ${fmtFollowers(ig.followers)} / 1000 × CPM`,
    });
    cards.push({
      key: "story-ig",
      platform: "instagram",
      contentLabel: "Story",
      amount: ig.tariffStory,
      breakdown: "Tarifa Post IG ÷ 3",
    });
  }
  if (tt) {
    cards.push({
      key: "post-tt",
      platform: "tiktok",
      contentLabel: "Posteo",
      amount: tt.tariffPost,
      breakdown: `${fmtPct(tt.reachFrac)} × ${tt.demArPct}% AR × ${fmtFollowers(tt.followers)} / 1000 × CPM`,
    });
  }
  return cards;
}

function TariffCard({ data }: { data: TariffCardData }) {
  return (
    <div className="relative bg-white rounded-2xl border border-slate-200/80 shadow-sm p-5 card-lift overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-1 premium-gradient" />
      <div className="flex items-center gap-2.5 mb-4">
        <PlatformIcon platform={data.platform} size="lg" />
        <div>
          <p className="text-sm font-bold text-slate-900 leading-tight">{data.contentLabel}</p>
          <p className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold">
            {data.platform === "instagram" ? "Instagram" : "TikTok"}
          </p>
        </div>
      </div>
      <p className="text-3xl font-bold text-slate-900 tabular-nums tracking-tight leading-none">
        {data.amount != null ? fmtARS(data.amount) : "—"}
      </p>
      <div className="mt-3 rounded-lg bg-slate-50 border border-slate-100 px-3 py-2">
        <p className="text-[10px] text-slate-500 leading-relaxed">{data.breakdown}</p>
      </div>
    </div>
  );
}

export function TariffSummary({
  results,
}: {
  results: Partial<Record<Platform, PlatformResult>>;
}) {
  const cards = buildTariffCards(results);
  if (cards.length === 0) return null;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {cards.map((c) => (
        <TariffCard key={c.key} data={c} />
      ))}
    </div>
  );
}
