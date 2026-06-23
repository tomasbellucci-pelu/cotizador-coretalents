import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

/** Secciones del CRM presentes sólo para que el shell se sienta completo. */
export function PlaceholderPage({ title, icon }: { title: string; icon: string }) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-24 animate-fade-in-up">
      <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mb-5">
        <span
          className="material-symbols-rounded text-slate-400 text-[30px]"
          style={{ fontVariationSettings: "'FILL' 0, 'wght' 300" }}
        >
          {icon}
        </span>
      </div>
      <h1 className="text-2xl font-bold text-slate-900 tracking-tight">{title}</h1>
      <p className="text-sm text-slate-500 mt-2 max-w-sm">
        Sección del CRM real de Core Talents. En este prototipo está como referencia de
        navegación — la herramienta nueva es el <strong className="text-slate-700">Cotizador</strong>.
      </p>
      <Link to="/cotizador" className="mt-6">
        <Button variant="primary">
          <span className="material-symbols-rounded text-[18px]">request_quote</span>
          Ir al Cotizador
        </Button>
      </Link>
    </div>
  );
}
