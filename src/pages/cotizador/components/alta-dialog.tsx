import { CheckCircle2, X } from "lucide-react";
import { useState } from "react";
import { PlatformIcon } from "@/components/composed/platform-icon";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { VERTICALS, type VerticalKey } from "@/data/benchmarks";
import { fmtARS, fmtFollowers, fmtPct, type Platform } from "@/lib/cotizador";

export interface AltaPlatformPrefill {
  platform: Platform;
  handle: string;
  followers: number;
  reachPost: number; // fracción
  reachStory?: number; // fracción (IG)
  demArPct: number;
}

export interface AltaPrefill {
  platforms: AltaPlatformPrefill[];
  vertical: VerticalKey | null;
  tariffs: {
    postInstagram?: number | null;
    storyInstagram?: number | null;
    postTiktok?: number | null;
  };
}

const COUNTRIES = [
  { value: "AR", label: "Argentina" },
  { value: "MX", label: "México" },
  { value: "CO", label: "Colombia" },
  { value: "CL", label: "Chile" },
  { value: "UY", label: "Uruguay" },
];

function PrefillRow({ p }: { p: AltaPlatformPrefill }) {
  return (
    <div className="flex items-center gap-3 rounded-lg border border-slate-200 bg-slate-50/50 px-3 py-2">
      <PlatformIcon platform={p.platform} size="lg" />
      <div className="flex-1 min-w-0">
        <p className="text-xs font-semibold text-slate-800">@{p.handle.replace(/^@/, "")}</p>
        <p className="text-[10px] text-slate-500 tabular-nums">
          {fmtFollowers(p.followers)} seg · {p.demArPct}% AR
        </p>
      </div>
      <div className="text-right">
        <p className="text-[10px] text-slate-500">
          Reach post <span className="font-semibold text-slate-700">{fmtPct(p.reachPost)}</span>
        </p>
        {p.reachStory != null ? (
          <p className="text-[10px] text-slate-500">
            Reach story <span className="font-semibold text-slate-700">{fmtPct(p.reachStory)}</span>
          </p>
        ) : null}
      </div>
    </div>
  );
}

export function AltaDialog({
  prefill,
  onClose,
  onConfirmed,
}: {
  prefill: AltaPrefill;
  onClose: () => void;
  onConfirmed: () => void;
}) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [nickname, setNickname] = useState("");
  const [country, setCountry] = useState("AR");
  const [vertical, setVertical] = useState<string>(prefill.vertical ?? "");
  const [exclusivo, setExclusivo] = useState(false);
  const [done, setDone] = useState(false);

  const canSubmit = firstName.trim().length > 0 && lastName.trim().length > 0;
  const tf = prefill.tariffs;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl border border-slate-200 max-w-lg w-full shadow-xl animate-in zoom-in-95 fade-in duration-150 max-h-[92vh] overflow-y-auto ct-scrollbar"
        onClick={(e) => e.stopPropagation()}
      >
        {done ? (
          // ── Estado de éxito ──────────────────────────────────────────────
          <div className="p-8 text-center">
            <div className="w-16 h-16 rounded-2xl bg-emerald-50 flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="h-9 w-9 text-emerald-500" />
            </div>
            <h2 className="text-xl font-bold text-slate-900">¡Talento dado de alta!</h2>
            <p className="text-sm text-slate-500 mt-2 max-w-sm mx-auto">
              {firstName} {lastName} se creó en el CRM con las redes, demografía y tarifas que
              calculó el cotizador.
            </p>
            {/* PROD: acá se haría POST /api/v1/talents con platforms + métricas + tarifas. */}
            <Button variant="primary" className="mt-6" onClick={onConfirmed}>
              Listo
            </Button>
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="p-6 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white">
              <div>
                <h2 className="text-lg font-bold text-slate-900">Nuevo talento</h2>
                <p className="text-xs text-slate-500 mt-1">
                  Pre-cargado por el Cotizador. Completá nombre y confirmá.
                </p>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="w-8 h-8 rounded-lg hover:bg-slate-100 flex items-center justify-center text-slate-500"
                aria-label="Cerrar"
              >
                <X className="h-[18px] w-[18px]" />
              </button>
            </div>

            <div className="p-6 space-y-5">
              {/* Nombre */}
              <div>
                <Label htmlFor="alta_first">
                  Nombre completo <span className="text-rose-500">*</span>
                </Label>
                <div className="grid grid-cols-2 gap-2 mt-1">
                  <Input
                    id="alta_first"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="Nombre"
                  />
                  <Input
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Apellido"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="alta_nick">Apodo / nombre fantasía</Label>
                <Input
                  id="alta_nick"
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  placeholder="Ej: Cami Beauty"
                  className="mt-1"
                />
              </div>

              {/* Redes pre-cargadas */}
              <div>
                <Label className="mb-1.5">Redes (pre-cargadas del cotizador)</Label>
                <div className="space-y-2">
                  {prefill.platforms.map((p) => (
                    <PrefillRow key={p.platform} p={p} />
                  ))}
                </div>
              </div>

              {/* País + Vertical */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>País</Label>
                  <Select value={country} onValueChange={(v) => v && setCountry(v)}>
                    <SelectTrigger className="mt-1 w-full">
                      <SelectValue>
                        {(value: string) =>
                          COUNTRIES.find((c) => c.value === value)?.label ?? value
                        }
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      {COUNTRIES.map((c) => (
                        <SelectItem key={c.value} value={c.value}>
                          {c.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Vertical</Label>
                  <Select value={vertical} onValueChange={(v) => v && setVertical(v)}>
                    <SelectTrigger className="mt-1 w-full">
                      <SelectValue>
                        {(value: string) =>
                          VERTICALS.find((v) => v.key === value)?.label ?? "Elegir…"
                        }
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      {VERTICALS.map((v) => (
                        <SelectItem key={v.key} value={v.key}>
                          {v.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Tarifas pre-cargadas */}
              <div>
                <Label className="mb-1.5">Tarifas (calculadas por el cotizador)</Label>
                <div className="rounded-lg border border-slate-200 divide-y divide-slate-100">
                  {tf.postInstagram != null ? (
                    <TariffLine label="Post Instagram" value={tf.postInstagram} />
                  ) : null}
                  {tf.storyInstagram != null ? (
                    <TariffLine label="Story Instagram" value={tf.storyInstagram} />
                  ) : null}
                  {tf.postTiktok != null ? (
                    <TariffLine label="Post TikTok" value={tf.postTiktok} />
                  ) : null}
                </div>
              </div>

              <label className="flex items-center gap-2 text-sm text-slate-700">
                <input
                  type="checkbox"
                  checked={exclusivo}
                  onChange={(e) => setExclusivo(e.target.checked)}
                  className="w-4 h-4 rounded accent-indigo-600"
                />
                Exclusivo Core Talents
              </label>

              <div className="flex justify-end gap-2 pt-1">
                <Button type="button" variant="outline" onClick={onClose}>
                  Cancelar
                </Button>
                <Button type="button" disabled={!canSubmit} onClick={() => setDone(true)}>
                  Dar de alta
                </Button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function TariffLine({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex items-center justify-between px-3 py-2">
      <span className="text-xs text-slate-600">{label}</span>
      <span className="text-sm font-bold text-slate-900 tabular-nums">{fmtARS(value)}</span>
    </div>
  );
}
