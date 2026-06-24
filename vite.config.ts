import path from "node:path";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  // En GitHub Pages la app vive en /cotizador-coretalents/. En dev y en Vercel, en la raíz.
  base: process.env.GH_PAGES === "true" ? "/cotizador-coretalents/" : "/",
  plugins: [tailwindcss(), react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    port: 5174,
    host: true,
  },
});
