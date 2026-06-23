import { cn } from "@/lib/utils";

interface SwitchProps {
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  disabled?: boolean;
  className?: string;
}

function Switch({ checked = false, onCheckedChange, disabled, className }: SwitchProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => onCheckedChange?.(!checked)}
      className={cn(
        "h-6 w-11 rounded-full border transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-indigo-500/20 focus-visible:ring-offset-2 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed relative shrink-0",
        checked ? "bg-indigo-500 border-indigo-500" : "bg-white border-slate-200",
        className,
      )}
    >
      <span
        className={cn(
          "inline-block h-4 w-4 rounded-full bg-white shadow-sm transition-transform duration-200",
          checked ? "translate-x-5" : "translate-x-0.5",
        )}
      />
    </button>
  );
}

export { Switch };
