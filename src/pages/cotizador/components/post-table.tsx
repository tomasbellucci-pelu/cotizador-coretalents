import { ExternalLink } from "lucide-react";
import type { BrandedPost } from "@/data/mock-posts";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import { fmtCompact, type Platform } from "@/lib/cotizador";

const MONTHS = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"];
function fmtDate(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  return `${d} ${MONTHS[m - 1]} ${String(y).slice(2)}`;
}

export function PostTable({
  posts,
  platform,
  onPautaChange,
}: {
  posts: BrandedPost[];
  platform: Platform;
  onPautaChange: (postId: string, hasPaid: boolean) => void;
}) {
  const sinPauta = posts.filter((p) => !p.hasPaid).length;
  const tipo = platform === "instagram" ? "Reels" : "Posteos";

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
          {tipo} de marca · últimos {posts.length}
        </p>
        <p className="text-[11px] text-slate-400">
          <span className="font-semibold text-emerald-600">{sinPauta}</span> sin pauta → mediana
        </p>
      </div>

      <div className="rounded-xl border border-slate-200 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-slate-50/70 border-b border-slate-200">
              <th className="ct-table-header text-left px-3 py-2">Fecha</th>
              <th className="ct-table-header text-left px-3 py-2">Marca</th>
              <th className="ct-table-header text-left px-3 py-2 hidden sm:table-cell">Copy</th>
              <th className="ct-table-header text-right px-3 py-2">Views</th>
              <th className="ct-table-header text-center px-3 py-2 w-10">Link</th>
              <th className="ct-table-header text-center px-3 py-2 w-28">Pauta</th>
            </tr>
          </thead>
          <tbody>
            {posts.map((p) => (
              <tr
                key={p.id}
                className={cn(
                  "border-b border-slate-50 last:border-0 transition-colors",
                  p.hasPaid ? "bg-amber-50/40" : "hover:bg-slate-50/50",
                )}
              >
                <td className="px-3 py-2 text-xs text-slate-500 whitespace-nowrap tabular-nums">
                  {fmtDate(p.date)}
                </td>
                <td className="px-3 py-2">
                  <span className="text-xs font-semibold text-slate-700">{p.brand}</span>
                </td>
                <td className="px-3 py-2 hidden sm:table-cell">
                  <span className="text-xs text-slate-500 line-clamp-1 max-w-[260px] block">
                    {p.copy}
                  </span>
                </td>
                <td
                  className={cn(
                    "px-3 py-2 text-right text-sm font-bold tabular-nums",
                    p.hasPaid ? "text-slate-400 line-through" : "text-slate-900",
                  )}
                >
                  {fmtCompact(p.views)}
                </td>
                <td className="px-3 py-2 text-center">
                  <a
                    href={p.url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center justify-center w-6 h-6 rounded-md text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
                    title="Abrir posteo"
                  >
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                </td>
                <td className="px-3 py-2">
                  <div className="flex items-center justify-center gap-2">
                    <Switch
                      checked={p.hasPaid}
                      onCheckedChange={(v) => onPautaChange(p.id, v)}
                    />
                    <span
                      className={cn(
                        "text-[10px] font-medium w-12",
                        p.hasPaid ? "text-amber-600" : "text-slate-400",
                      )}
                    >
                      {p.hasPaid ? "Con pauta" : "Sin pauta"}
                    </span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* PROD: el listado de posteos de marca lo provee el scrapeador Influencers Club. */}
    </div>
  );
}
