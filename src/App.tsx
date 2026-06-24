import { BrowserRouter, Navigate, Outlet, Route, Routes } from "react-router-dom";
import { AppLayout } from "@/components/layout/app-layout";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { CotizadorPage } from "@/pages/cotizador";
import { PlaceholderPage } from "@/pages/placeholder";
import { TalentosPage } from "@/pages/talents/list";

function Shell() {
  return (
    <AppLayout>
      <Outlet />
    </AppLayout>
  );
}

export default function App() {
  return (
    <TooltipProvider>
      <BrowserRouter basename={import.meta.env.BASE_URL.replace(/\/$/, "")}>
        <Routes>
          <Route element={<Shell />}>
            <Route index element={<Navigate to="/cotizador" replace />} />
            <Route path="/cotizador" element={<CotizadorPage />} />
            <Route path="/talentos" element={<TalentosPage />} />
            <Route
              path="/leads"
              element={<PlaceholderPage title="Leads" icon="outgoing_mail" />}
            />
            <Route
              path="/campanas"
              element={<PlaceholderPage title="Campañas" icon="campaign" />}
            />
            <Route
              path="/clientes"
              element={<PlaceholderPage title="Clientes" icon="business" />}
            />
            <Route path="*" element={<Navigate to="/cotizador" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
      <Toaster />
    </TooltipProvider>
  );
}
