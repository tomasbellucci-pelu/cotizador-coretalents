import { cn } from "@/lib/utils";

// Logos de marca reales. El equipo pidió explícitamente ver el logo correcto de
// cada plataforma junto al handle.
// - Instagram: glifo de cámara en outline blanco sobre el gradiente oficial.
// - TikTok: nota musical (path simple-icons) en blanco sobre negro.

const SIZES: Record<string, { box: string; glyph: number }> = {
  sm: { box: "w-5 h-5 rounded-md", glyph: 14 },
  md: { box: "w-6 h-6 rounded-[7px]", glyph: 17 },
  lg: { box: "w-8 h-8 rounded-[9px]", glyph: 22 },
  xl: { box: "w-10 h-10 rounded-xl", glyph: 28 },
};

// Gradiente oficial de Instagram (radial desde abajo-izquierda).
const IG_GRADIENT =
  "radial-gradient(circle at 30% 107%, #fdf497 0%, #fdf497 5%, #fd5949 45%, #d6249f 60%, #285AEB 90%)";

const TIKTOK_PATH =
  "M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z";

export type IconPlatform = "instagram" | "tiktok";

export function PlatformIcon({
  platform,
  size = "md",
  className,
}: {
  platform: IconPlatform;
  size?: keyof typeof SIZES;
  className?: string;
}) {
  const s = SIZES[size];
  const isIg = platform === "instagram";

  return (
    <span
      className={cn(
        "inline-flex items-center justify-center text-white shrink-0 shadow-sm",
        s.box,
        isIg ? "" : "bg-slate-900",
        className,
      )}
      style={isIg ? { background: IG_GRADIENT } : undefined}
      aria-label={isIg ? "Instagram" : "TikTok"}
    >
      {isIg ? (
        // Cámara de Instagram en outline blanco (silueta reconocible).
        <svg
          width={s.glyph}
          height={s.glyph}
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden="true"
          role="img"
        >
          <rect x="5.4" y="5.4" width="13.2" height="13.2" rx="4.2" stroke="#fff" strokeWidth="1.9" />
          <circle cx="12" cy="12" r="3.3" stroke="#fff" strokeWidth="1.9" />
          <circle cx="16.8" cy="7.2" r="1.15" fill="#fff" />
        </svg>
      ) : (
        <svg
          width={s.glyph}
          height={s.glyph}
          viewBox="0 0 24 24"
          fill="currentColor"
          aria-hidden="true"
          role="img"
        >
          <path d={TIKTOK_PATH} />
        </svg>
      )}
    </span>
  );
}
