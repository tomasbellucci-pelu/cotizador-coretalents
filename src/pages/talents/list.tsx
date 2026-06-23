import { Users } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { PlatformIcon } from "@/components/composed/platform-icon";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { VERTICALS } from "@/data/benchmarks";
import { CRM_TALENTS, type CrmTalent, fullName, initials } from "@/data/mock-talents";
import { fmtARS, fmtFollowers, type Platform } from "@/lib/cotizador";

function verticalLabel(key: string): string {
  return VERTICALS.find((v) => v.key === key)?.label ?? key;
}

function PlatformCell({ talent, platform }: { talent: CrmTalent; platform: Platform }) {
  const p = talent.platforms[platform];
  if (!p) return <span className="text-xs text-slate-300">—</span>;
  return (
    <div className="flex items-center gap-2">
      <PlatformIcon platform={platform} size="md" />
      <div>
        <div className="text-xs text-slate-600">@{p.handle}</div>
        <div className="text-sm font-bold tabular-nums text-slate-900">
          {fmtFollowers(p.followers)}
        </div>
      </div>
    </div>
  );
}

export function TalentosPage() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col">
      <header className="mb-6 animate-fade-in-up flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center shrink-0 mt-0.5">
            <Users className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-[26px] font-bold text-slate-900 tracking-tight leading-tight">
              Talentos
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              CRM de creadores. Estos son los perfiles que usa el Cotizador en el flujo "Talento
              existente".
            </p>
          </div>
        </div>
        <Button variant="primary" onClick={() => navigate("/cotizador")}>
          <span className="material-symbols-rounded text-[18px]">request_quote</span>
          Cotizar un perfil
        </Button>
      </header>

      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-100">
              <th className="ct-table-header text-left px-5 py-3">Talento</th>
              <th className="ct-table-header text-left px-5 py-3">Instagram</th>
              <th className="ct-table-header text-left px-5 py-3 hidden md:table-cell">TikTok</th>
              <th className="ct-table-header text-left px-5 py-3 hidden lg:table-cell">Vertical</th>
              <th className="ct-table-header text-right px-5 py-3 hidden xl:table-cell">
                Post IG actual
              </th>
            </tr>
          </thead>
          <tbody>
            {CRM_TALENTS.map((t) => (
              <tr
                key={t.id}
                className="border-b border-slate-50 last:border-0 hover:bg-slate-50/60 transition-colors"
              >
                <td className="px-5 py-3">
                  <div className="flex items-center gap-3">
                    <Avatar initials={initials(t)} color={t.avatarColor} size="sm" />
                    <div className="min-w-0">
                      <div className="text-sm font-semibold text-slate-900">{fullName(t)}</div>
                      {t.nickname ? (
                        <div className="text-[11px] text-slate-500">{t.nickname}</div>
                      ) : null}
                    </div>
                  </div>
                </td>
                <td className="px-5 py-3">
                  <PlatformCell talent={t} platform="instagram" />
                </td>
                <td className="px-5 py-3 hidden md:table-cell">
                  <PlatformCell talent={t} platform="tiktok" />
                </td>
                <td className="px-5 py-3 hidden lg:table-cell">
                  <Badge variant="lime" withDot>
                    {verticalLabel(t.vertical)}
                  </Badge>
                </td>
                <td className="px-5 py-3 text-right hidden xl:table-cell tabular-nums text-sm font-semibold text-slate-700">
                  {t.currentTariffs.postInstagram ? fmtARS(t.currentTariffs.postInstagram) : "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
