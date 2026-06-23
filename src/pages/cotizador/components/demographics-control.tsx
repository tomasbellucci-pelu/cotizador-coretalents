import { Sparkles } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import type { DemMode } from "../use-cotizador";

export function DemographicsControl({
  demArPct,
  demMode,
  onEstimate,
  onChange,
}: {
  demArPct: number;
  demMode: DemMode;
  onEstimate: () => void;
  onChange: (value: number) => void;
}) {
  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <p className="text-xs font-medium text-slate-500">% audiencia argentina</p>
        <span
          className={cn(
            "text-[9px] font-bold uppercase tracking-wide rounded-full px-1.5 py-[1px] ring-1 ring-inset",
            demMode === "estimate"
              ? "bg-indigo-50 text-indigo-600 ring-indigo-200"
              : "bg-slate-100 text-slate-500 ring-slate-200",
          )}
        >
          {demMode === "estimate" ? "Estimado" : "Manual"}
        </span>
      </div>
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Input
            type="number"
            min={0}
            max={100}
            value={demArPct || ""}
            onChange={(e) => onChange(Number(e.target.value))}
            placeholder="0"
            className="pr-7 h-9 tabular-nums font-semibold"
          />
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-slate-400">%</span>
        </div>
        <button
          type="button"
          onClick={onEstimate}
          className="inline-flex items-center gap-1.5 h-9 px-3 rounded-xl bg-indigo-50 text-indigo-700 text-xs font-semibold hover:bg-indigo-100 active:scale-[0.97] transition-all whitespace-nowrap"
          title="Estimar con el scrapeador"
        >
          <Sparkles className="h-3.5 w-3.5" />
          Estimar
        </button>
      </div>
      {/* PROD: "Estimar" llama al scrapeador de demografía. El valor manual es el que
          muchas veces nos pasa el propio perfil. */}
    </div>
  );
}
