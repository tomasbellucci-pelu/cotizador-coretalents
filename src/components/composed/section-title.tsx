import { cn } from "@/lib/utils";

const SIZES = {
  1: "text-2xl",
  2: "text-xl",
  3: "text-lg",
} as const;

export function SectionTitle({
  children,
  level = 2,
  eyebrow,
  description,
  action,
  className,
}: {
  children: React.ReactNode;
  level?: 1 | 2 | 3;
  eyebrow?: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}) {
  const Tag = `h${level}` as "h1" | "h2" | "h3";

  return (
    <div className={cn("flex justify-between items-start gap-4 mb-6", className)}>
      <div>
        {eyebrow ? (
          <p className="text-xs font-medium text-indigo-500 tracking-wide uppercase mb-1">
            {eyebrow}
          </p>
        ) : null}
        <Tag className={cn("font-bold tracking-tight text-slate-900", SIZES[level])}>
          {children}
        </Tag>
        {description ? (
          <p className="text-sm text-slate-500 mt-2 max-w-2xl">{description}</p>
        ) : null}
      </div>
      {action ? <div className="flex-shrink-0">{action}</div> : null}
    </div>
  );
}
