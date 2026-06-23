import { Info, UserPlus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { PlatformIcon } from "@/components/composed/platform-icon";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { VERTICALS, type VerticalKey } from "@/data/benchmarks";
import { type CrmTalent, fullName, initials } from "@/data/mock-talents";
import { fmtCompact, type Platform } from "@/lib/cotizador";
import { AltaDialog, type AltaPrefill } from "./components/alta-dialog";
import { HandleInput } from "./components/handle-input";
import { type CotizadorMode, ModeToggle } from "./components/mode-toggle";
import { PlatformPanel } from "./components/platform-panel";
import { ScrapingLoader } from "./components/scraping-loader";
import { StepSection } from "./components/step-section";
import { TalentSearch } from "./components/talent-search";
import { TariffCompare } from "./components/tariff-compare";
import { TariffSummary } from "./components/tariff-summary";
import {
  type SummaryPlatform,
  WhatsappSummaryButton,
} from "./components/whatsapp-summary";
import { WindowToggle } from "./components/window-toggle";
import { useCotizador } from "./use-cotizador";

function verticalLabel(key: string): string {
  return VERTICALS.find((v) => v.key === key)?.label ?? key;
}

export function CotizadorPage() {
  const { state, results, activePlatforms, actions } = useCotizador();
  const [mode, setMode] = useState<CotizadorMode>("new");
  const [analyzed, setAnalyzed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [talent, setTalent] = useState<CrmTalent | null>(null);
  const [showAlta, setShowAlta] = useState(false);

  const changeMode = (m: CotizadorMode) => {
    if (m === mode) return;
    setMode(m);
    actions.reset();
    setAnalyzed(false);
    setLoading(false);
    setTalent(null);
  };

  const scrape = (run: () => void) => {
    run();
    setLoading(true);
    // PROD: el scrapeo (Influencers Club) es async. Acá simulamos el "pensando".
    window.setTimeout(() => {
      setLoading(false);
      setAnalyzed(true);
    }, 1300);
  };

  const handleCalculateNew = () => scrape(actions.calculateNew);
  const handleSelectTalent = (t: CrmTalent) => {
    setTalent(t);
    scrape(() => actions.initFromTalent(t));
  };
  const handleChangeTalent = () => {
    setTalent(null);
    actions.reset();
    setAnalyzed(false);
    setLoading(false);
  };

  const buildPrefill = (): AltaPrefill => {
    const ig = results.instagram;
    const tt = results.tiktok;
    return {
      platforms: activePlatforms.map((p) => {
        const r = results[p]!;
        return {
          platform: p,
          handle: r.handle,
          followers: r.followers,
          reachPost: r.reachFrac,
          reachStory: p === "instagram" ? r.reachFrac / 3 : undefined,
          demArPct: r.demArPct,
        };
      }),
      vertical: state.vertical,
      tariffs: {
        postInstagram: ig?.tariffPost ?? null,
        storyInstagram: ig?.tariffStory ?? null,
        postTiktok: tt?.tariffPost ?? null,
      },
    };
  };

  const showAnalysis = analyzed && !loading;

  // Datos para el resumen de WhatsApp (todos los posteos por red, para que el
  // talento marque cuáles tuvieron pauta).
  const summaryPlatforms: SummaryPlatform[] = activePlatforms.map((p) => ({
    platform: p,
    handle: state[p].handle,
    posts: state[p].posts,
  }));
  const summaryName = mode === "existing" && talent ? talent.firstName : undefined;

  return (
    <div className="flex flex-col gap-8 pb-24 max-w-4xl">
      {/* Header */}
      <header className="animate-fade-in-up">
        <p className="text-xs font-medium text-indigo-500 tracking-wide uppercase mb-1">Cotizador</p>
        <h1 className="text-[28px] font-bold text-slate-900 tracking-tight leading-tight">
          ¿Cuánto debería cobrar este perfil?
        </h1>
        <p className="text-sm text-slate-500 mt-2 max-w-2xl">
          Seguí los pasos y la tarifa recomendada va apareciendo más abajo. Calculamos todo con la
          performance real de los posteos de marca, la demografía de la audiencia y los benchmarks
          de CPM y reach.
        </p>
      </header>

      {/* PASO 1 — tipo */}
      <StepSection n={1} title="¿Qué tipo de perfil querés cotizar?" done>
        <ModeToggle value={mode} onChange={changeMode} />
      </StepSection>

      {/* PASO 2 — perfil */}
      <StepSection
        n={2}
        title={mode === "new" ? "Cargá las redes del perfil" : "Elegí el talento del CRM"}
        description={
          mode === "new"
            ? "Con Instagram, TikTok o las dos. Después apretá Calcular."
            : talent
              ? undefined
              : "Buscalo por nombre o @usuario y seleccionalo."
        }
        done={analyzed}
      >
        {mode === "new" ? (
          <HandleInput
            igHandle={state.instagram.handle}
            ttHandle={state.tiktok.handle}
            windowDays={state.windowDays}
            analyzed={analyzed}
            onIg={(v) => actions.setHandle("instagram", v)}
            onTt={(v) => actions.setHandle("tiktok", v)}
            onWindow={analyzed ? actions.setWindowAndRescrape : actions.setWindowDays}
            onCalculate={handleCalculateNew}
          />
        ) : talent ? (
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-4 flex items-center gap-3 flex-wrap">
            <Avatar initials={initials(talent)} color={talent.avatarColor} size="md" />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <p className="text-sm font-bold text-slate-900">{fullName(talent)}</p>
                <Badge variant="lime">{verticalLabel(talent.vertical)}</Badge>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                {talent.nickname ? `${talent.nickname} · ` : ""}demografía ya cargada en el CRM
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div>
                <p className="text-[10px] font-medium text-slate-400 mb-1">Ventana</p>
                <WindowToggle
                  value={state.windowDays}
                  onChange={actions.setWindowAndRescrape}
                  size="sm"
                />
              </div>
              <button
                type="button"
                onClick={handleChangeTalent}
                className="text-xs font-medium text-slate-400 hover:text-slate-700 transition-colors"
              >
                Cambiar
              </button>
            </div>
          </div>
        ) : (
          <TalentSearch onSelect={handleSelectTalent} />
        )}
      </StepSection>

      {/* Estado de carga */}
      {loading ? (
        <div className="sm:pl-10">
          <ScrapingLoader />
        </div>
      ) : null}

      {/* PASO 3 — análisis */}
      {showAnalysis ? (
        <StepSection
          n={3}
          title="Revisá el análisis"
          description="Elegí la vertical del perfil y marcá qué posteos tuvieron pauta."
          done={!!state.vertical}
        >
          <div className="flex flex-col gap-4">
            {/* Vertical */}
            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-5 flex flex-col sm:flex-row sm:items-end gap-3 justify-between">
              <div className="w-full sm:w-72">
                <p className="text-xs font-medium text-slate-500 mb-1.5">Vertical del perfil</p>
                <Select
                  value={state.vertical ?? ""}
                  onValueChange={(v) => v && actions.setVertical(v as VerticalKey)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue>
                      {(value: string) =>
                        VERTICALS.find((x) => x.key === value)?.label ?? "Elegí una vertical…"
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
              <p className="text-xs text-slate-400 max-w-xs">
                La vertical define el CPM y el reach de referencia. El tier sale automático de los
                seguidores.
              </p>
            </div>

            {!state.vertical ? (
              <div className="flex items-center gap-2 rounded-xl bg-indigo-50 text-indigo-700 px-4 py-3 text-sm">
                <Info className="h-4 w-4 shrink-0" />
                Elegí la <strong>vertical</strong> arriba para calcular la tarifa recomendada.
              </div>
            ) : null}

            {/* Panels por plataforma */}
            <div className="grid grid-cols-1 gap-5">
              {activePlatforms.map((p: Platform) =>
                results[p] ? (
                  <PlatformPanel
                    key={p}
                    platform={p}
                    state={state[p]}
                    result={results[p]!}
                    onPauta={(postId, hasPaid) => actions.setPauta(p, postId, hasPaid)}
                    onDemEstimate={() => actions.estimateDem(p)}
                    onDemChange={(v) => actions.setDemValue(p, v)}
                  />
                ) : null,
              )}
            </div>
          </div>
        </StepSection>
      ) : null}

      {/* PASO 4 — tarifas */}
      {showAnalysis && state.vertical ? (
        <StepSection n={4} title="Tarifas recomendadas" done>
          <div className="flex flex-col gap-5">
            <TariffSummary results={results} />

            {mode === "new" ? (
              <div className="flex flex-col sm:flex-row sm:items-center gap-3 rounded-2xl border border-slate-200/80 bg-white shadow-sm p-5">
                <div className="flex-1">
                  <p className="text-sm font-bold text-slate-900">¿Sumamos este perfil al CRM?</p>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Se carga con las redes, la demografía y estas tarifas ya completadas.
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-2">
                  <WhatsappSummaryButton name={summaryName} platforms={summaryPlatforms} />
                  <Button variant="accent" size="lg" onClick={() => setShowAlta(true)}>
                    <UserPlus className="h-4 w-4" />
                    Dar de alta al talento
                  </Button>
                </div>
              </div>
            ) : talent ? (
              <TariffCompare
                talent={talent}
                results={results}
                onUpdated={() => toast.success(`Tarifas de ${fullName(talent)} actualizadas`)}
                summaryButton={
                  <WhatsappSummaryButton
                    name={summaryName}
                    platforms={summaryPlatforms}
                    size="default"
                  />
                }
              />
            ) : null}
          </div>
        </StepSection>
      ) : null}

      {showAlta ? (
        <AltaDialog
          prefill={buildPrefill()}
          onClose={() => setShowAlta(false)}
          onConfirmed={() => {
            setShowAlta(false);
            toast.success("Talento dado de alta en el CRM");
            actions.reset();
            setAnalyzed(false);
            setLoading(false);
            setTalent(null);
            setMode("new");
          }}
        />
      ) : null}
    </div>
  );
}
