import { Check, Copy, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import type { BrandedPost } from "@/data/mock-posts";
import type { Platform } from "@/lib/cotizador";
import { cn } from "@/lib/utils";

const MONTHS = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"];
function fmtDay(iso: string): string {
  const [, m, d] = iso.split("-").map(Number);
  return `${d} ${MONTHS[m - 1]}`;
}

const SEP = "━━━━━━━━━━━━";
const PLATFORM_HEADER: Record<Platform, string> = {
  instagram: "📸 *INSTAGRAM*",
  tiktok: "🎵 *TIKTOK*",
};

export interface SummaryPlatform {
  platform: Platform;
  handle: string;
  posts: BrandedPost[];
}

/**
 * Arma el mensaje de WhatsApp para que el talento indique qué posteos tuvieron
 * pauta. Numeración continua entre IG y TikTok (un número = un posteo).
 */
export function buildWhatsappSummary(name: string | undefined, platforms: SummaryPlatform[]): string {
  const greeting = name?.trim() ? `¡Hola ${name.trim()}! 👋` : "¡Hola! 👋";
  const lines: string[] = [
    greeting,
    "Estamos calculando tu *tarifa para marcas* y necesito un favor rápido para calcularla de manera correcta (2 min) 🙌",
    "Necesito saber cuáles de tus últimos posteos *tuvieron pauta* y cuáles fueron orgánicos.",
    "👉 *Decime solo los números de los que tuvieron pauta.*",
  ];

  let n = 1;
  for (const p of platforms) {
    if (!p.posts.length) continue;
    lines.push(SEP);
    lines.push(PLATFORM_HEADER[p.platform]);
    for (const post of p.posts) {
      lines.push(`*${n}.* ${post.brand} · ${fmtDay(post.date)}`);
      lines.push(post.url);
      n++;
    }
  }
  lines.push(SEP);
  lines.push("");
  lines.push("Gracias!");

  return lines.join("\n");
}

/** Renderiza el *negrita* de WhatsApp como bold en el preview (lo copiado mantiene los asteriscos). */
function renderWhatsappBold(text: string) {
  return text.split(/(\*[^*\n]+\*)/g).map((seg, i) => {
    if (seg.length > 2 && seg.startsWith("*") && seg.endsWith("*")) {
      // biome-ignore lint/suspicious/noArrayIndexKey: render estático
      return <strong key={i}>{seg.slice(1, -1)}</strong>;
    }
    // biome-ignore lint/suspicious/noArrayIndexKey: render estático
    return <span key={i}>{seg}</span>;
  });
}

function WhatsappGlyph({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M.057 24l1.687-6.163a11.867 11.867 0 0 1-1.587-5.946C.16 5.335 5.495 0 12.05 0a11.817 11.817 0 0 1 8.413 3.488 11.824 11.824 0 0 1 3.48 8.414c-.003 6.557-5.338 11.892-11.893 11.892a11.9 11.9 0 0 1-5.688-1.448L.057 24zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884a9.86 9.86 0 0 0 1.51 5.26l-.999 3.648 3.477-.607zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.096 3.2 5.077 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
    </svg>
  );
}

export function WhatsappSummaryButton({
  name,
  platforms,
  variant = "outline",
  size = "lg",
  className,
}: {
  name?: string;
  platforms: SummaryPlatform[];
  variant?: "outline" | "secondary";
  size?: "default" | "lg";
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const message = buildWhatsappSummary(name, platforms);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(message);
      setCopied(true);
      toast.success("Mensaje copiado");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("No se pudo copiar — seleccionalo y copialo a mano");
    }
  };

  const openWhatsapp = () => {
    window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, "_blank", "noopener");
  };

  return (
    <>
      <Button
        variant={variant}
        size={size}
        className={cn("gap-2", className)}
        onClick={() => setOpen(true)}
      >
        <WhatsappGlyph className="h-4 w-4 text-emerald-600" />
        Enviar resumen al talento
      </Button>

      {open ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-150"
          onClick={() => setOpen(false)}
        >
          <div
            className="bg-white rounded-2xl border border-slate-200 max-w-md w-full shadow-xl animate-in zoom-in-95 fade-in duration-150 max-h-[92vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-500 flex items-center justify-center">
                  <WhatsappGlyph className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-slate-900 leading-tight">
                    Resumen para el talento
                  </h2>
                  <p className="text-[11px] text-slate-500">
                    Copialo y pegalo en el WhatsApp del perfil.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="w-8 h-8 rounded-lg hover:bg-slate-100 flex items-center justify-center text-slate-500"
                aria-label="Cerrar"
              >
                <X className="h-[18px] w-[18px]" />
              </button>
            </div>

            {/* Preview tipo burbuja de WhatsApp */}
            <div className="p-5 overflow-y-auto ct-scrollbar">
              <div className="rounded-xl bg-[#dcf8c6] border border-emerald-200/60 px-4 py-3 shadow-sm">
                <div className="whitespace-pre-wrap break-words font-sans text-[13px] leading-relaxed text-slate-800">
                  {renderWhatsappBold(message)}
                </div>
              </div>
            </div>

            {/* Acciones */}
            <div className="p-5 border-t border-slate-100 flex items-center justify-end gap-2">
              <Button variant="outline" onClick={openWhatsapp} className="gap-2">
                <WhatsappGlyph className="h-4 w-4 text-emerald-600" />
                Abrir en WhatsApp
              </Button>
              <Button variant="primary" onClick={copy} className="gap-2">
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                {copied ? "Copiado" : "Copiar mensaje"}
              </Button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
