import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className,
}: {
  icon?: LucideIcon;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 p-12 text-center",
        className,
      )}
    >
      {Icon ? (
        <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center mb-4">
          <Icon className="h-6 w-6 text-slate-400" />
        </div>
      ) : null}
      <h3 className="text-base font-semibold text-slate-900">{title}</h3>
      {description ? <p className="mt-1 text-sm text-slate-500 max-w-xs">{description}</p> : null}
      {action ? <div className="mt-4">{action}</div> : null}
    </div>
  );
}
