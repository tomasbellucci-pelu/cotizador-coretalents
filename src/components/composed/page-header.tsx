import type { LucideIcon } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

export interface ViewToggleOption {
  id: string;
  icon: LucideIcon;
  tooltip: string;
}

export function PageHeader({
  back,
  title,
  subtitle,
  icon: Icon,
  iconName,
  onAdd,
  addTooltip,
  viewOptions,
  activeView,
  onViewChange,
  onTitleChange,
  actions,
  className,
}: {
  back?: { to: string; label: string };
  title: string;
  subtitle?: string;
  icon?: LucideIcon;
  iconName?: string;
  onAdd?: () => void;
  addTooltip?: string;
  viewOptions?: ViewToggleOption[];
  activeView?: string;
  onViewChange?: (id: string) => void;
  onTitleChange?: (name: string) => void;
  actions?: React.ReactNode;
  className?: string;
}) {
  const hasIcon = iconName || Icon;
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(title);

  return (
    <header className={cn("mb-6 animate-fade-in-up", className)}>
      {/* Back navigation */}
      {back ? (
        <nav className="flex items-center gap-1.5 text-xs text-slate-400 mb-3">
          <Link
            to={back.to}
            className="inline-flex items-center justify-center w-6 h-6 rounded-md hover:bg-slate-100 transition-colors"
          >
            <span className="material-symbols-rounded text-[16px]">arrow_back</span>
          </Link>
          <Link to={back.to} className="hover:text-slate-700 transition-colors">
            {back.label}
          </Link>
        </nav>
      ) : null}

      {/* Title row */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          {hasIcon ? (
            <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center shrink-0 mt-0.5">
              {iconName ? (
                <span
                  className="material-symbols-rounded text-white text-[20px]"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  {iconName}
                </span>
              ) : Icon ? (
                <Icon className="h-5 w-5 text-white" />
              ) : null}
            </div>
          ) : null}

          <div>
            {editing && onTitleChange ? (
              <input
                ref={(el) => el?.focus()}
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onBlur={() => {
                  if (draft.trim() && draft.trim() !== title) {
                    onTitleChange(draft.trim());
                  } else {
                    setDraft(title);
                  }
                  setEditing(false);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.currentTarget.blur();
                  } else if (e.key === "Escape") {
                    setDraft(title);
                    setEditing(false);
                  }
                }}
                className="text-[26px] font-bold text-slate-900 tracking-tight leading-tight bg-transparent border-b-2 border-slate-300 focus:border-slate-900 outline-none w-full"
              />
            ) : (
              <h1
                className={cn(
                  "text-[26px] font-bold text-slate-900 tracking-tight leading-tight",
                  onTitleChange && "cursor-pointer hover:text-slate-600 transition-colors",
                )}
                onClick={
                  onTitleChange
                    ? () => {
                        setDraft(title);
                        setEditing(true);
                      }
                    : undefined
                }
              >
                {title}
              </h1>
            )}
            {subtitle ? <p className="text-sm text-slate-500 mt-1">{subtitle}</p> : null}
          </div>
        </div>

        {/* Right: view toggle + add button + custom actions */}
        <div className="flex items-center gap-2 shrink-0">
          {viewOptions && onViewChange ? (
            <div className="flex items-center gap-0.5 rounded-lg border border-slate-200 bg-white p-0.5">
              {viewOptions.map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  title={opt.tooltip}
                  onClick={() => onViewChange(opt.id)}
                  className={cn(
                    "flex h-7 w-7 items-center justify-center rounded-md transition-colors",
                    activeView === opt.id
                      ? "bg-slate-900 text-white"
                      : "text-slate-500 hover:bg-slate-100",
                  )}
                >
                  <opt.icon className="h-4 w-4" />
                </button>
              ))}
            </div>
          ) : null}

          {actions ? actions : null}

          {onAdd ? (
            <button
              type="button"
              onClick={onAdd}
              className="flex items-center gap-1.5 h-10 px-4 rounded-xl bg-orange-500 text-white text-sm font-semibold hover:bg-orange-600 active:scale-[0.97] shadow-sm transition-all duration-200"
            >
              <span
                className="material-symbols-rounded text-[18px]"
                style={{ fontVariationSettings: "'FILL' 1, 'wght' 600" }}
              >
                add
              </span>
              {addTooltip ? <span>{addTooltip}</span> : null}
            </button>
          ) : null}
        </div>
      </div>
    </header>
  );
}
