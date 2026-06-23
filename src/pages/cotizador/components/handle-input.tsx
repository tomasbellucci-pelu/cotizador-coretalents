import { Sparkles } from "lucide-react";
import { PlatformIcon } from "@/components/composed/platform-icon";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Platform } from "@/lib/cotizador";
import { WindowToggle } from "./window-toggle";

function HandleField({
  platform,
  value,
  onChange,
}: {
  platform: Platform;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <p className="text-xs font-medium text-slate-500 mb-1.5">
        {platform === "instagram" ? "Instagram" : "TikTok"}{" "}
        <span className="text-slate-400 font-normal">(opcional)</span>
      </p>
      <div
        className={cn(
          "flex items-center gap-2 h-11 rounded-xl border border-slate-200 bg-white px-2 pr-3 transition-colors focus-within:ring-2 focus-within:ring-indigo-500/20 focus-within:border-indigo-500",
        )}
      >
        <PlatformIcon platform={platform} size="lg" />
        <span className="text-slate-400 text-sm">@</span>
        <input
          value={value.replace(/^@/, "")}
          onChange={(e) => onChange(e.target.value)}
          placeholder="usuario"
          className="flex-1 min-w-0 bg-transparent text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none"
        />
      </div>
    </div>
  );
}

export function HandleInput({
  igHandle,
  ttHandle,
  windowDays,
  analyzed,
  onIg,
  onTt,
  onWindow,
  onCalculate,
}: {
  igHandle: string;
  ttHandle: string;
  windowDays: number;
  analyzed: boolean;
  onIg: (v: string) => void;
  onTt: (v: string) => void;
  onWindow: (d: number) => void;
  onCalculate: () => void;
}) {
  const hasAny = igHandle.trim().length > 0 || ttHandle.trim().length > 0;

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <HandleField platform="instagram" value={igHandle} onChange={onIg} />
        <HandleField platform="tiktok" value={ttHandle} onChange={onTt} />
      </div>

      <div className="flex flex-col sm:flex-row sm:items-end gap-4 mt-5 pt-5 border-t border-slate-100">
        <div>
          <p className="text-xs font-medium text-slate-500 mb-1.5">¿Cuánto tiempo miramos?</p>
          <WindowToggle value={windowDays} onChange={onWindow} />
        </div>
        <div className="flex items-center gap-3 sm:ml-auto">
          {!hasAny ? (
            <span className="text-xs text-slate-400">Cargá al menos un usuario.</span>
          ) : null}
          <Button variant="primary" size="lg" disabled={!hasAny} onClick={onCalculate}>
            <Sparkles className="h-4 w-4" />
            {analyzed ? "Recalcular" : "Calcular tarifas"}
          </Button>
        </div>
      </div>
      {/* PROD: al calcular, el scrapeador (Influencers Club) trae followers + posteos de marca. */}
    </div>
  );
}
