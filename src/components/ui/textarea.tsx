import type * as React from "react";
import { cn } from "@/lib/utils";

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      className={cn(
        "min-h-[80px] w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 resize-y disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-150 [field-sizing:content]",
        className,
      )}
      {...props}
    />
  );
}

export { Textarea };
