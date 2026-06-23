import { cva, type VariantProps } from "class-variance-authority";
import type * as React from "react";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1 px-2 py-[1px] text-[10px] font-semibold rounded-full ring-1 ring-inset",
  {
    variants: {
      variant: {
        success: "bg-emerald-50 text-emerald-700 ring-emerald-200",
        warning: "bg-amber-50 text-amber-700 ring-amber-200",
        danger: "bg-rose-50 text-rose-700 ring-rose-200",
        info: "bg-blue-50 text-blue-700 ring-blue-200",
        pending: "bg-slate-100 text-slate-600 ring-slate-200",
        neutral: "bg-slate-100 text-slate-600 ring-slate-200",
        ink: "bg-slate-900 text-white ring-slate-700",
        lime: "bg-indigo-50 text-indigo-700 ring-indigo-200",
        // backward-compat aliases
        outline: "bg-white text-slate-600 ring-slate-200",
        default: "bg-slate-100 text-slate-600 ring-slate-200",
        secondary: "bg-slate-100 text-slate-600 ring-slate-200",
        destructive: "bg-rose-50 text-rose-700 ring-rose-200",
      },
    },
    defaultVariants: {
      variant: "neutral",
    },
  },
);

const dotColors: Record<string, string> = {
  success: "bg-emerald-400",
  warning: "bg-amber-400",
  danger: "bg-rose-400",
  info: "bg-blue-400",
  pending: "bg-slate-400",
  neutral: "bg-slate-400",
  ink: "bg-slate-400",
  lime: "bg-indigo-400",
};

interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {
  withDot?: boolean;
}

function Badge({ className, variant = "neutral", withDot, children, ...props }: BadgeProps) {
  return (
    <span className={cn(badgeVariants({ variant }), className)} {...props}>
      {withDot ? (
        <span
          className={cn(
            "inline-block h-[5px] w-[5px] rounded-full",
            dotColors[variant ?? "neutral"],
          )}
        />
      ) : null}
      {children}
    </span>
  );
}

export { Badge, badgeVariants };
