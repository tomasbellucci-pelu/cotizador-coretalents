import { PlatformIcon } from "@/components/composed/platform-icon";
import { Badge } from "@/components/ui/badge";
import {
  fmtARS,
  fmtCompact,
  fmtFollowers,
  fmtPct,
  PLATFORM_LABEL,
  type Platform,
} from "@/lib/cotizador";
import type { PlatformResult } from "@/lib/engine";
import { cn } from "@/lib/utils";
import type { PlatformFlowState } from "../use-cotizador";
import { DemographicsControl } from "./demographics-control";
import { PostTable } from "./post-table";
import { ReachBenchmarkBadge } from "./reach-benchmark-badge";

function Stat({
  label,
  value,
  sub,
  accent,
  tag,
}: {
  label: string;
  value: string;
  sub?: string;
  accent?: boolean;
  tag?: string;
}) {
  return (
    <div className="flex-1 min-w-0">
      <div className="flex items-center gap-1.5">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">{label}</p>
        {tag ? (
          <span className="text-[8px] font-bold uppercase tracking-wide text-slate-400 bg-slate-100 rounded-full px-1.5 py-[1px]">
            {tag}
          </span>
        ) : null}
      </div>
      <p
        className={cn(
          "text-xl font-bold tabular-nums tracking-tight mt-0.5",
          accent ? "text-indigo-600" : "text-slate-900",
        )}
      >
        {value}
      </p>
      {sub ? <p className="text-[10px] text-slate-400 mt-0.5">{sub}</p> : null}
    </div>
  );
}

export function PlatformPanel({
  platform,
  state,
  result,
  onPauta,
  onDemEstimate,
  onDemChange,
}: {
  platform: Platform;
  state: PlatformFlowState;
  result: PlatformResult;
  onPauta: (postId: string, hasPaid: boolean) => void;
  onDemEstimate: () => void;
  onDemChange: (value: number) => void;
}) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden animate-fade-in-up">
      {/* Header */}
      <div className="flex items-center justify-between gap-3 px-5 py-4 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <PlatformIcon platform={platform} size="xl" />
          <div>
            <p className="text-sm font-bold text-slate-900 leading-tight">
              {PLATFORM_LABEL[platform]}
            </p>
            <p className="text-xs text-slate-500">@{state.handle.replace(/^@/, "")}</p>
          </div>
        </div>
        <div className="text-right">
          <Badge variant="ink">{result.tier}</Badge>
          <p className="text-[10px] text-slate-400 mt-1 tabular-nums">{result.tierRange}</p>
        </div>
      </div>

      {/* Métricas */}
      <div className="px-5 py-4">
        <div className="flex gap-4 flex-wrap">
          <Stat
            label="Seguidores"
            value={fmtFollowers(state.followers)}
            sub="al momento del scrapeo"
            tag="scrapeo"
          />
          <Stat
            label="Mediana views"
            value={fmtCompact(result.medianViewsSinPauta)}
            sub={`${result.postsSinPauta} posteos sin pauta`}
          />
          <Stat
            label="Reach calculado"
            value={fmtPct(result.reachFrac)}
            sub="mediana / seguidores"
            accent
          />
          <Stat
            label="CPM benchmark"
            value={result.cpm != null ? fmtARS(result.cpm) : "—"}
            sub="vertical · tier · plataforma"
          />
        </div>

        {/* Demografía + comparación de reach */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 pt-4 border-t border-slate-100">
          <DemographicsControl
            demArPct={state.demArPct}
            demMode={state.demMode}
            onEstimate={onDemEstimate}
            onChange={onDemChange}
          />
          <div className="flex flex-col justify-center">
            <p className="text-xs font-medium text-slate-500 mb-1.5">Reach vs benchmark</p>
            <ReachBenchmarkBadge result={result} />
          </div>
        </div>
      </div>

      {/* Posteos */}
      <div className="px-5 pb-5">
        <PostTable posts={state.posts} platform={platform} onPautaChange={onPauta} />
      </div>
    </div>
  );
}
