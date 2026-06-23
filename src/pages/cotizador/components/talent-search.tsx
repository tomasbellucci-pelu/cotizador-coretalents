import { Search } from "lucide-react";
import { useMemo, useState } from "react";
import { PlatformIcon } from "@/components/composed/platform-icon";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { VERTICALS } from "@/data/benchmarks";
import { CRM_TALENTS, type CrmTalent, fullName, initials } from "@/data/mock-talents";
import { fmtCompact, type Platform } from "@/lib/cotizador";

function verticalLabel(key: string): string {
  return VERTICALS.find((v) => v.key === key)?.label ?? key;
}

export function TalentSearch({ onSelect }: { onSelect: (talent: CrmTalent) => void }) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return CRM_TALENTS;
    return CRM_TALENTS.filter((t) => {
      const haystack = [
        fullName(t),
        t.nickname ?? "",
        t.platforms.instagram?.handle ?? "",
        t.platforms.tiktok?.handle ?? "",
        verticalLabel(t.vertical),
      ]
        .join(" ")
        .toLowerCase();
      return haystack.includes(q);
    });
  }, [query]);

  return (
    <div className="animate-fade-in-up">
      <div className="relative max-w-md mb-4">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
        <Input
          autoFocus
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar por nombre, @handle o vertical…"
          className="pl-10"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {filtered.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => onSelect(t)}
            className="group text-left flex items-center gap-3 bg-white rounded-2xl border border-slate-200/80 shadow-sm p-4 card-lift"
          >
            <Avatar initials={initials(t)} color={t.avatarColor} size="md" />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <p className="text-sm font-semibold text-slate-900 truncate">{fullName(t)}</p>
                <Badge variant="lime">{verticalLabel(t.vertical)}</Badge>
              </div>
              <div className="flex items-center gap-3 mt-1.5">
                {(["instagram", "tiktok"] as Platform[]).map((pf) => {
                  const p = t.platforms[pf];
                  if (!p) return null;
                  return (
                    <span key={pf} className="inline-flex items-center gap-1.5">
                      <PlatformIcon platform={pf} size="sm" />
                      <span className="text-[11px] text-slate-500 tabular-nums">
                        {fmtCompact(p.followers)}
                      </span>
                    </span>
                  );
                })}
              </div>
            </div>
            <span className="material-symbols-rounded text-slate-300 group-hover:text-indigo-500 transition-colors">
              chevron_right
            </span>
          </button>
        ))}
        {filtered.length === 0 ? (
          <p className="text-sm text-slate-400 col-span-full py-8 text-center">
            No encontramos talentos con "{query}".
          </p>
        ) : null}
      </div>
    </div>
  );
}
