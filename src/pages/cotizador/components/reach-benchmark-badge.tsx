import { ArrowDownRight, ArrowUpRight, Info, Minus } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { fmtPct } from "@/lib/cotizador";
import { cn } from "@/lib/utils";
import type { PlatformResult } from "@/lib/engine";

/**
 * Badge visual de A5: compara el % de Reach calculado vs el % de Reach Performance
 * benchmark (reach puro, SIN demografía). Verde = por encima, rojo = por debajo.
 */
export function ReachBenchmarkBadge({ result }: { result: PlatformResult }) {
  const { benchReach, reachVerdict, reachFrac } = result;

  if (benchReach.pct == null) {
    // Con vertical elegida siempre hay benchmark (Industria cae a "Otro"), así que
    // este estado significa: todavía no se eligió la vertical.
    return (
      <span className="inline-flex items-center gap-1.5 text-xs font-medium text-indigo-600 bg-indigo-50 rounded-full px-2.5 py-1 ring-1 ring-inset ring-indigo-200">
        <Info className="h-3.5 w-3.5" />
        Elegí la vertical para comparar
      </span>
    );
  }

  const cfg = {
    above: {
      cls: "bg-emerald-50 text-emerald-700 ring-emerald-200",
      icon: <ArrowUpRight className="h-3.5 w-3.5" />,
      label: "Por encima del benchmark",
    },
    below: {
      cls: "bg-rose-50 text-rose-700 ring-rose-200",
      icon: <ArrowDownRight className="h-3.5 w-3.5" />,
      label: "Por debajo del benchmark",
    },
    on_par: {
      cls: "bg-slate-100 text-slate-600 ring-slate-200",
      icon: <Minus className="h-3.5 w-3.5" />,
      label: "En línea con el benchmark",
    },
  }[reachVerdict ?? "on_par"];

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <span
        className={cn(
          "inline-flex items-center gap-1.5 text-xs font-semibold rounded-full px-2.5 py-1 ring-1 ring-inset",
          cfg.cls,
        )}
      >
        {cfg.icon}
        {cfg.label}
      </span>
      <span className="text-[11px] text-slate-500 tabular-nums">
        {fmtPct(reachFrac)} vs <span className="font-semibold">{fmtPct(benchReach.pct)}</span> bmk
      </span>
      {benchReach.isFallback ? (
        <Tooltip>
          <TooltipTrigger
            render={
              <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-amber-600 bg-amber-50 ring-1 ring-inset ring-amber-200 rounded-full px-1.5 py-[1px] cursor-help">
                <Info className="h-3 w-3" />
                proxy "Otro"
              </span>
            }
          />
          <TooltipContent className="max-w-[240px] text-center">
            {/* Fallback Industria: REACH_BENCHMARK no tiene la vertical "Industria",
                así que usamos "Otro" como proxy para la comparación. */}
            La vertical <strong>Industria</strong> no tiene benchmark de reach. Usamos{" "}
            <strong>"Otro"</strong> como proxy para esta comparación.
          </TooltipContent>
        </Tooltip>
      ) : null}
    </div>
  );
}
