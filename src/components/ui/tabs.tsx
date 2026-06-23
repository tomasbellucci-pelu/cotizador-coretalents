import type * as React from "react";
import { createContext, useContext, useState } from "react";
import { cn } from "@/lib/utils";

interface TabsContextValue {
  value: string;
  setValue: (v: string) => void;
}

const TabsContext = createContext<TabsContextValue | null>(null);

function useTabs() {
  const ctx = useContext(TabsContext);
  if (!ctx) throw new Error("Tabs components must be used within <Tabs>");
  return ctx;
}

interface TabsProps {
  defaultValue?: string;
  value?: string;
  onValueChange?: (v: string) => void;
  className?: string;
  children: React.ReactNode;
}

function Tabs({ defaultValue = "", value, onValueChange, className, children }: TabsProps) {
  const [internal, setInternal] = useState(defaultValue);
  const controlled = value !== undefined;

  const setValue = (v: string) => {
    if (!controlled) setInternal(v);
    onValueChange?.(v);
  };

  return (
    <TabsContext.Provider value={{ value: controlled ? value : internal, setValue }}>
      <div className={cn("w-full", className)}>{children}</div>
    </TabsContext.Provider>
  );
}

function TabsList({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <div className={cn("flex gap-8 border-b border-slate-200 mb-6", className)}>{children}</div>
  );
}

interface TabsTriggerProps {
  value: string;
  className?: string;
  children: React.ReactNode;
  disabled?: boolean;
}

function TabsTrigger({ value, className, children, disabled }: TabsTriggerProps) {
  const { value: active, setValue } = useTabs();
  const isActive = active === value;

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={() => setValue(value)}
      className={cn(
        "pb-3 text-sm font-medium border-b-2 transition-colors duration-150 -mb-px disabled:pointer-events-none disabled:opacity-50",
        isActive
          ? "border-indigo-500 text-slate-900 font-semibold"
          : "border-transparent text-slate-500 hover:text-slate-700",
        className,
      )}
    >
      {children}
    </button>
  );
}

interface TabsContentProps {
  value: string;
  className?: string;
  children: React.ReactNode;
}

function TabsContent({ value, className, children }: TabsContentProps) {
  const { value: active } = useTabs();
  return active === value ? <div className={cn("outline-none", className)}>{children}</div> : null;
}

export { Tabs, TabsContent, TabsList, TabsTrigger };
