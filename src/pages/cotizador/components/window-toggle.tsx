import { cn } from "@/lib/utils";

const OPTIONS = [30, 60, 90];

export function WindowToggle({
  value,
  onChange,
  size = "default",
}: {
  value: number;
  onChange: (days: number) => void;
  size?: "default" | "sm";
}) {
  return (
    <div className="inline-flex items-center gap-0.5 rounded-xl border border-slate-200 bg-white p-0.5">
      {OPTIONS.map((d) => (
        <button
          key={d}
          type="button"
          onClick={() => onChange(d)}
          className={cn(
            "rounded-lg font-semibold transition-colors tabular-nums",
            size === "sm" ? "px-2.5 py-1 text-xs" : "px-3.5 py-1.5 text-sm",
            value === d
              ? "bg-slate-900 text-white"
              : "text-slate-500 hover:bg-slate-100",
          )}
        >
          {d}d
        </button>
      ))}
    </div>
  );
}
