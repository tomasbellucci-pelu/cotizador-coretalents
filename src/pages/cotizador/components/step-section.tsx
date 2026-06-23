import { cn } from "@/lib/utils";

/**
 * Sección numerada del flujo de una sola página. Da una guía clara y secuencial
 * (pensado para usuarios no técnicos: cada paso aparece debajo del anterior).
 */
export function StepSection({
  n,
  title,
  description,
  done,
  children,
  className,
}: {
  n: number;
  title: string;
  description?: string;
  done?: boolean;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("animate-fade-in-up", className)}>
      <div className="flex items-start gap-3 mb-3">
        <span
          className={cn(
            "flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold shrink-0 mt-0.5 transition-colors",
            done ? "bg-emerald-500 text-white" : "bg-slate-900 text-white",
          )}
        >
          {n}
        </span>
        <div>
          <h2 className="text-lg font-bold text-slate-900 tracking-tight leading-tight">{title}</h2>
          {description ? <p className="text-sm text-slate-500 mt-0.5">{description}</p> : null}
        </div>
      </div>
      <div className="sm:pl-10">{children}</div>
    </section>
  );
}
