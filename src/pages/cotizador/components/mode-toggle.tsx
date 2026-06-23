import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

export type CotizadorMode = "new" | "existing";

const OPTIONS: { key: CotizadorMode; icon: string; label: string; desc: string }[] = [
  {
    key: "new",
    icon: "person_add",
    label: "Talento nuevo",
    desc: "Todavía no está en el CRM. Cargás sus redes.",
  },
  {
    key: "existing",
    icon: "how_to_reg",
    label: "Talento existente",
    desc: "Ya lo tenemos cargado. Lo buscás en el CRM.",
  },
];

/** Selector (radio) entre talento nuevo / existente. No cambia de página: cambia el modo. */
export function ModeToggle({
  value,
  onChange,
}: {
  value: CotizadorMode;
  onChange: (mode: CotizadorMode) => void;
}) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-2xl">
      {OPTIONS.map((o) => {
        const selected = value === o.key;
        return (
          <button
            key={o.key}
            type="button"
            onClick={() => onChange(o.key)}
            aria-pressed={selected}
            className={cn(
              "relative text-left rounded-2xl border-2 p-4 transition-all duration-200 flex items-start gap-3",
              selected
                ? "border-indigo-500 bg-indigo-50/50 shadow-sm"
                : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50",
            )}
          >
            <div
              className={cn(
                "w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors",
                selected ? "bg-indigo-600 text-white" : "bg-slate-100 text-slate-500",
              )}
            >
              <span
                className="material-symbols-rounded text-[22px]"
                style={{ fontVariationSettings: "'FILL' 0, 'wght' 400" }}
              >
                {o.icon}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-slate-900">{o.label}</p>
              <p className="text-xs text-slate-500 mt-0.5 leading-snug">{o.desc}</p>
            </div>
            <span
              className={cn(
                "w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors",
                selected ? "border-indigo-600 bg-indigo-600 text-white" : "border-slate-300",
              )}
            >
              {selected ? <Check className="h-3 w-3" strokeWidth={3} /> : null}
            </span>
          </button>
        );
      })}
    </div>
  );
}
