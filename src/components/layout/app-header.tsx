import { Avatar } from "@/components/ui/avatar";

interface AppHeaderProps {
  onMobileMenuToggle: () => void;
}

export function AppHeader({ onMobileMenuToggle }: AppHeaderProps) {
  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-100 flex items-center justify-between px-8 h-14">
      <div className="flex items-center gap-3">
        {/* Mobile menu toggle */}
        <button
          type="button"
          className="md:hidden w-9 h-9 rounded-lg hover:bg-slate-100 flex items-center justify-center text-slate-500 transition-colors"
          onClick={onMobileMenuToggle}
        >
          <span
            className="material-symbols-rounded text-[20px]"
            style={{ fontVariationSettings: "'wght' 400" }}
          >
            menu
          </span>
        </button>

        {/* Search trigger (decorativo en el prototipo) */}
        <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 rounded-lg border border-slate-200">
          <span
            className="material-symbols-rounded text-slate-400 text-[16px]"
            style={{ fontVariationSettings: "'wght' 400" }}
          >
            search
          </span>
          <span className="text-sm text-slate-400 w-56 text-left hidden sm:block">
            Buscar leads, talentos, clientes...
          </span>
          <kbd className="hidden sm:inline-flex items-center gap-0.5 text-[10px] font-medium text-slate-400 bg-white border border-slate-200 rounded px-1.5 py-0.5 ml-2">
            <span>⌘</span>K
          </kbd>
        </div>
      </div>

      {/* Right: notifications + user */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          className="w-9 h-9 rounded-lg hover:bg-slate-100 flex items-center justify-center text-slate-500 hover:text-slate-900 transition-colors"
        >
          <span
            className="material-symbols-rounded text-[20px]"
            style={{ fontVariationSettings: "'wght' 400" }}
          >
            notifications
          </span>
        </button>

        <div className="h-5 w-px bg-slate-200" />

        <div className="flex items-center gap-2 px-2 py-1.5 rounded-xl">
          <Avatar initials="MB" size="xs" color="#4F46E5" />
          <div className="hidden sm:block text-left">
            <p className="text-xs font-semibold text-slate-900 leading-none">Media Lab</p>
          </div>
        </div>
      </div>
    </header>
  );
}
