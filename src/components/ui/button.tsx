import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-xl font-medium transition-all duration-200 focus-visible:ring-2 focus-visible:ring-indigo-500/20 focus-visible:ring-offset-2 active:scale-[0.97] select-none disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-slate-900 text-white hover:bg-slate-700",
        primary: "bg-indigo-600 text-white hover:bg-indigo-700",
        indigo: "bg-indigo-50 text-indigo-700 hover:bg-indigo-100",
        secondary: "bg-slate-100 text-slate-700 hover:bg-slate-200",
        outline: "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50",
        ghost: "bg-transparent text-slate-600 hover:bg-slate-100",
        danger: "bg-rose-50 text-rose-700 hover:bg-rose-100",
        accent: "bg-orange-500 text-white hover:bg-orange-600",
        link: "bg-transparent text-indigo-600 hover:underline underline-offset-4 p-0 h-auto",
        // backward-compat aliases
        destructive: "bg-rose-50 text-rose-700 hover:bg-rose-100",
      },
      size: {
        sm: "h-8 px-3 text-xs",
        default: "h-10 px-4 text-sm",
        lg: "h-12 px-6 text-base",
        icon: "h-10 w-10 p-0",
        "icon-sm": "h-8 w-8 p-0",
        "icon-xs": "h-6 w-6 p-0",
        "icon-lg": "h-12 w-12 p-0",
        xs: "h-7 px-2.5 text-xs",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild: _asChild, ...props }, ref) => {
    return (
      <button ref={ref} className={cn(buttonVariants({ variant, size, className }))} {...props} />
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
