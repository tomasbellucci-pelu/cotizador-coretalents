import { ArrowDown, ArrowUp, Check, Minus, RefreshCw } from "lucide-react";
import { type ReactNode, useState } from "react";
import { Button } from "@/components/ui/button";
import type { CrmTalent } from "@/data/mock-talents";
import { fmtARS, type Platform } from "@/lib/cotizador";
import type { PlatformResult } from "@/lib/engine";
import { cn } from "@/lib/utils";

interface CompareRow {
  label: string;
  platform: Platform;
  contentLabel: string;
  current: number | null;
  recommended: number | null;
}

type Verdict = "up" | "down" | "ok";

function verdictFor(current: number | null, recommended: number | null): Verdict | null {
  if (current == null || recommended == null) return null;
  if (current === 0) return recommended > 0 ? "up" : "ok";
  const delta = (recommended - current) / current;
  if (Math.abs(delta) < 0.08) return "ok"; // <8% → no vale la pena tocar
  return delta > 0 ? "up" : "down";
}

const VERDICT_CFG: Record<Verdict, { cls: string; icon: React.ReactNode; label: string }> = {
  up: {
    cls: "bg-emerald-50 text-emerald-700 ring-emerald-200",
    icon: <ArrowUp className="h-3 w-3" />,
    label: "Conviene subir",
  },
  down: {
    cls: "bg-rose-50 text-rose-700 ring-rose-200",
    icon: <ArrowDown className="h-3 w-3" />,
    label: "Está por encima",
  },
  ok: {
    cls: "bg-slate-100 text-slate-600 ring-slate-200",
    icon: <Minus className="h-3 w-3" />,
    label: "En línea",
  },
};

export function TariffCompare({
  talent,
  results,
  onUpdated,
  summaryButton,
}: {
  talent: CrmTalent;
  results: Partial<Record<Platform, PlatformResult>>;
  onUpdated: () => void;
  summaryButton?: ReactNode;
}) {
  const [phase, setPhase] = useState<"idle" | "confirming" | "done">("idle");
  const ig = results.instagram;
  const tt = results.tiktok;

  const rows: CompareRow[] = [];
  if (talent.platforms.instagram || ig) {
    rows.push({
      label: "post-ig",
      platform: "instagram",
      contentLabel: "Post Instagram",
      current: talent.currentTariffs.postInstagram ?? null,
      recommended: ig?.tariffPost ?? null,
    });
    rows.push({
      label: "story-ig",
      platform: "instagram",
      contentLabel: "Story Instagram",
      current: talent.currentTariffs.storyInstagram ?? null,
      recommended: ig?.tariffStory ?? null,
    });
  }
  if (talent.platforms.tiktok || tt) {
    rows.push({
      label: "post-tt",
      platform: "tiktok",
      contentLabel: "Post TikTok",
      current: talent.currentTariffs.postTiktok ?? null,
      recommended: tt?.tariffPost ?? null,
    });
  }

  const adjustable = rows.filter((r) => {
    const v = verdictFor(r.current, r.recommended);
    return v === "up" || v === "down";
  }).length;

  const updatableCount = rows.filter((r) => r.recommended != null).length;

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
      <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between gap-3">
        <div>
          <h3 className="text-base font-bold text-slate-900">Tarifa actual vs recomendada</h3>
          <p className="text-xs text-slate-500 mt-0.5">
            {adjustable > 0
              ? `${adjustable} ${adjustable === 1 ? "tarifa conviene" : "tarifas conviene"} ajustar.`
              : "Las tarifas están en línea con la recomendación."}
          </p>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[560px]">
          <thead>
            <tr className="bg-slate-50/70 border-b border-slate-200">
              <th className="ct-table-header text-left px-5 py-2.5">Tipo</th>
              <th className="ct-table-header text-right px-5 py-2.5">Actual</th>
              <th className="ct-table-header text-right px-5 py-2.5">Recomendada</th>
              <th className="ct-table-header text-right px-5 py-2.5">Δ</th>
              <th className="ct-table-header text-center px-5 py-2.5">Sugerencia</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => {
              const v = verdictFor(r.current, r.recommended);
              const delta =
                r.current != null && r.recommended != null ? r.recommended - r.current : null;
              const deltaPct =
                r.current && r.recommended != null ? (r.recommended - r.current) / r.current : null;
              return (
                <tr key={r.label} className="border-b border-slate-50 last:border-0">
                  <td className="px-5 py-3 text-sm font-medium text-slate-700">{r.contentLabel}</td>
                  <td className="px-5 py-3 text-right text-sm tabular-nums text-slate-500">
                    {r.current != null ? fmtARS(r.current) : "—"}
                  </td>
                  <td className="px-5 py-3 text-right text-sm font-bold tabular-nums text-slate-900">
                    {r.recommended != null ? fmtARS(r.recommended) : "—"}
                  </td>
                  <td className="px-5 py-3 text-right tabular-nums">
                    {delta != null ? (
                      <span
                        className={cn(
                          "text-xs font-semibold",
                          delta > 0 ? "text-emerald-600" : delta < 0 ? "text-rose-600" : "text-slate-400",
                        )}
                      >
                        {delta > 0 ? "+" : ""}
                        {fmtARS(delta)}
                        {deltaPct != null ? (
                          <span className="block text-[10px] font-medium opacity-80">
                            {delta > 0 ? "+" : ""}
                            {(deltaPct * 100).toFixed(0)}%
                          </span>
                        ) : null}
                      </span>
                    ) : (
                      <span className="text-xs text-slate-300">—</span>
                    )}
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex justify-center">
                      {v ? (
                        <span
                          className={cn(
                            "inline-flex items-center gap-1 text-[10px] font-semibold rounded-full px-2 py-0.5 ring-1 ring-inset",
                            VERDICT_CFG[v].cls,
                          )}
                        >
                          {VERDICT_CFG[v].icon}
                          {VERDICT_CFG[v].label}
                        </span>
                      ) : (
                        <span className="text-xs text-slate-300">—</span>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="px-5 py-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>{summaryButton}</div>
        <div className="flex items-center justify-end gap-3">
        {phase === "done" ? (
          <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-emerald-600">
            <Check className="h-4 w-4" />
            Tarifas actualizadas en el CRM
          </span>
        ) : phase === "confirming" ? (
          <>
            <span className="text-xs text-slate-500 mr-1">
              Se actualizarán {updatableCount} {updatableCount === 1 ? "tarifa" : "tarifas"} en el
              CRM de {talent.firstName}. ¿Confirmás?
            </span>
            <Button variant="outline" size="sm" onClick={() => setPhase("idle")}>
              Cancelar
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => {
                setPhase("done");
                onUpdated();
              }}
            >
              <Check className="h-4 w-4" />
              Confirmar
            </Button>
          </>
        ) : (
          <Button variant="primary" onClick={() => setPhase("confirming")}>
            <RefreshCw className="h-4 w-4" />
            Actualizar tarifas
          </Button>
        )}
        </div>
      </div>
      {/* PROD: "Actualizar tarifas" hace PATCH de las tarifas unitarias del talento en el CRM. */}
    </div>
  );
}
