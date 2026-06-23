import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

interface AppSidebarProps {
  mobileOpen: boolean;
  onClose: () => void;
}

interface NavItem {
  label: string;
  path: string;
  icon: string;
  badge?: string;
  match: (pathname: string) => boolean;
}

// Herramientas nuevas (donde vive el Cotizador).
const toolItems: NavItem[] = [
  {
    label: "Cotizador",
    path: "/cotizador",
    icon: "request_quote",
    badge: "Nuevo",
    match: (p) => p.startsWith("/cotizador"),
  },
];

// CRM existente (replicado del nav real de Core Talents).
const crmItems: NavItem[] = [
  { label: "Leads", path: "/leads", icon: "outgoing_mail", match: (p) => p.startsWith("/leads") },
  {
    label: "Campañas",
    path: "/campanas",
    icon: "campaign",
    match: (p) => p.startsWith("/campanas"),
  },
  { label: "Talentos", path: "/talentos", icon: "groups", match: (p) => p.startsWith("/talentos") },
  { label: "Clientes", path: "/clientes", icon: "business", match: (p) => p.startsWith("/clientes") },
];

function NavLink({ item, onClose }: { item: NavItem; onClose: () => void }) {
  const location = useLocation();
  const active = item.match(location.pathname);
  return (
    <Link
      to={item.path}
      onClick={onClose}
      className={cn(
        "relative flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 ease-out text-[13px] group",
        active
          ? "text-slate-900 bg-slate-100 font-semibold"
          : "text-slate-500 hover:text-slate-900 hover:bg-slate-50",
      )}
    >
      {active ? (
        <span className="absolute left-0 top-[7px] bottom-[7px] w-[3px] rounded-r-full bg-orange-500" />
      ) : null}
      <span
        className={cn(
          "material-symbols-rounded text-[20px] transition-colors shrink-0",
          active ? "text-slate-900" : "text-slate-400 group-hover:text-slate-600",
        )}
        style={
          active
            ? { fontVariationSettings: "'FILL' 1, 'wght' 500" }
            : { fontVariationSettings: "'FILL' 0, 'wght' 300" }
        }
      >
        {item.icon}
      </span>
      <span className="flex-1">{item.label}</span>
      {item.badge ? (
        <span className="text-[9px] font-bold uppercase tracking-wide text-orange-600 bg-orange-50 ring-1 ring-inset ring-orange-200 rounded-full px-1.5 py-[1px]">
          {item.badge}
        </span>
      ) : null}
    </Link>
  );
}

export function AppSidebar({ mobileOpen, onClose }: AppSidebarProps) {
  return (
    <aside
      className={cn(
        "fixed top-0 left-0 w-60 h-screen bg-white border-r border-slate-200 flex flex-col z-50 overflow-y-auto ct-scrollbar transition-transform duration-200",
        mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0",
      )}
    >
      {/* Logo */}
      <div className="px-5 pt-6 pb-5 border-b border-slate-100">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-slate-900 flex items-center justify-center shrink-0">
            <span className="text-white font-bold text-sm tracking-tight">CT</span>
          </div>
          <div>
            <span className="font-bold text-[15px] text-slate-900 tracking-tight block leading-none">
              Core Talents
            </span>
            <span className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold">
              CRM
            </span>
          </div>
        </div>
      </div>

      {/* Workspace */}
      <div className="px-3 pt-4 pb-2 text-[10px] uppercase tracking-wider text-slate-400 font-semibold">
        Workspace
      </div>
      <nav className="flex flex-col gap-0.5 px-2">
        {crmItems.map((item) => (
          <NavLink key={item.label} item={item} onClose={onClose} />
        ))}
      </nav>

      {/* Herramientas */}
      <div className="px-3 pt-5 pb-2 text-[10px] uppercase tracking-wider text-slate-400 font-semibold">
        Herramientas
      </div>
      <nav className="flex flex-col gap-0.5 flex-1 px-2">
        {toolItems.map((item) => (
          <NavLink key={item.label} item={item} onClose={onClose} />
        ))}

        <div className="mt-auto pt-4 pb-5 px-1">
          <p className="text-[9px] font-medium tracking-wider uppercase text-slate-300 mt-4 px-1">
            Prototipo · Core Talents
          </p>
        </div>
      </nav>
    </aside>
  );
}
