import { useEffect, useState } from "react";

const STEPS = [
  "Conectando con Influencers Club…",
  "Trayendo posteos de marca…",
  "Filtrando contenido orgánico…",
  "Leyendo views y demografía…",
  "Calculando mediana y reach…",
];

/** Estado "pensando/cargando" mientras se simula el scrapeo. */
export function ScrapingLoader() {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setStep((s) => (s + 1) % STEPS.length), 700);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-10 flex flex-col items-center justify-center text-center max-w-2xl animate-fade-in">
      <div className="relative w-14 h-14 mb-5">
        <div className="absolute inset-0 rounded-full border-[3px] border-indigo-100" />
        <div className="absolute inset-0 rounded-full border-[3px] border-transparent border-t-indigo-600 animate-spin" />
        <div className="absolute inset-0 flex items-center justify-center">
          <span
            className="material-symbols-rounded text-indigo-500 text-[22px]"
            style={{ fontVariationSettings: "'FILL' 1, 'wght' 400" }}
          >
            travel_explore
          </span>
        </div>
      </div>
      <p className="text-sm font-semibold text-slate-900">Analizando el perfil…</p>
      <p className="text-xs text-slate-500 mt-1 h-4 transition-all">{STEPS[step]}</p>
    </div>
  );
}
