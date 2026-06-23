import { useState } from "react";
import { AppHeader } from "./app-header";
import { AppSidebar } from "./app-sidebar";

export function AppLayout({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex h-screen bg-[#FAFAFA] overflow-hidden">
      <AppSidebar mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />

      {/* Mobile backdrop */}
      {mobileOpen ? (
        <button
          type="button"
          aria-label="Close menu"
          className="fixed inset-0 z-40 bg-black/20 md:hidden cursor-default"
          onClick={() => setMobileOpen(false)}
        />
      ) : null}

      {/* Main area */}
      <div className="flex flex-col flex-1 ml-0 md:ml-60 overflow-hidden">
        <AppHeader onMobileMenuToggle={() => setMobileOpen((o) => !o)} />
        <main className="flex-1 overflow-y-auto px-8 py-7 max-w-[1400px] mx-auto w-full">
          {children}
        </main>
      </div>
    </div>
  );
}
