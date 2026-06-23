import type * as React from "react";
import { cn } from "@/lib/utils";

function Label({ className, ...props }: React.ComponentProps<"label">) {
  return (
    // biome-ignore lint/a11y/noLabelWithoutControl: generic label component, htmlFor passed via props
    <label
      className={cn("text-xs font-medium text-slate-500 mb-1.5 block select-none", className)}
      {...props}
    />
  );
}

export { Label };
