import { cn } from "@/lib/utils";

export function KpiCard({
  label,
  value,
  detail,
  icon,
  trend,
  trendValue,
  accentColor = "default",
  className,
}: {
  label: string;
  value: string | number;
  detail?: string;
  icon?: string;
  trend?: "up" | "down" | "flat";
  trendValue?: string;
  accentColor?: "primary" | "error" | "default";
  className?: string;
}) {
  return (
    <div
      className={cn(
        "bg-white rounded-2xl border border-slate-200 p-6 card-lift relative overflow-hidden",
        accentColor === "primary" && "border-l-4 border-l-indigo-500",
        accentColor === "error" && "border-l-4 border-l-rose-400",
        className,
      )}
    >
      <div className="flex justify-between items-start mb-5">
        {icon ? (
          <div
            className={cn(
              "w-10 h-10 rounded-xl flex items-center justify-center",
              accentColor === "error" ? "bg-rose-50" : "bg-indigo-50",
            )}
          >
            <span
              className={cn(
                "material-symbols-rounded text-[20px]",
                accentColor === "error" ? "text-rose-500" : "text-indigo-500",
              )}
              style={{ fontVariationSettings: "'FILL' 0, 'wght' 300" }}
            >
              {icon}
            </span>
          </div>
        ) : null}

        {trendValue ? (
          <span
            className={cn(
              "text-[10px] font-semibold px-1.5 py-0.5 rounded-full inline-flex items-center gap-1",
              trend === "up" && "bg-emerald-50 text-emerald-700",
              trend === "down" && "bg-rose-50 text-rose-700",
              trend === "flat" && "bg-slate-100 text-slate-500",
            )}
          >
            {trend === "up" ? (
              <span className="material-symbols-rounded text-[12px]">arrow_upward</span>
            ) : trend === "down" ? (
              <span className="material-symbols-rounded text-[12px]">arrow_downward</span>
            ) : (
              <span className="material-symbols-rounded text-[12px]">remove</span>
            )}
            {trendValue}
          </span>
        ) : null}
      </div>

      <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-2">{label}</p>
      <h3 className="text-3xl font-bold text-slate-900 tabular-nums leading-tight tracking-tight">
        {value}
      </h3>
      {detail ? <p className="text-[11px] text-slate-400 mt-1">{detail}</p> : null}
    </div>
  );
}
