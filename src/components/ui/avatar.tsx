import { cn } from "@/lib/utils";

const sizeClasses = {
  xs: "w-6 h-6 text-[9px]",
  sm: "w-8 h-8 text-xs",
  md: "w-10 h-10 text-sm",
  lg: "w-14 h-14 text-base",
};

interface AvatarProps {
  initials: string;
  color?: string;
  size?: "xs" | "sm" | "md" | "lg";
  className?: string;
}

function Avatar({ initials, color = "#6366F1", size = "sm", className }: AvatarProps) {
  return (
    <span
      className={cn(
        "rounded-full flex items-center justify-center font-semibold text-white select-none shrink-0",
        sizeClasses[size],
        className,
      )}
      style={{ backgroundColor: color }}
    >
      {initials.slice(0, 2).toUpperCase()}
    </span>
  );
}

export { Avatar };
