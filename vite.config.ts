import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import path from "node:path";
import { defineConfig } from "vite";

const plugins = [react(), tailwindcss()];

export default defineConfig({
  plugins,
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
      "@assets": path.resolve(import.meta.dirname, "attached_assets"),
    },
  },
  envDir: path.resolve(import.meta.dirname),
  root: path.resolve(import.meta.dirname, "client"),
  publicDir: path.resolve(import.meta.dirname, "client", "public"),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true,
    chunkSizeWarningLimit: 600,
    rollupOptions: {
      output: {
        // Chunk strategy: split the largest, most-cacheable vendor libs into
        // their own chunks, but keep React + small uncategorised libs in
        // Vite's default vendor split. A previous strategy that pulled
        // /react/ into "vendor-react" alongside a catchall "vendor" chunk
        // created a circular import that left React undefined for
        // next-themes' top-level createContext call (blank-page in prod).
        manualChunks(id) {
          if (id.includes("node_modules")) {
            if (id.includes("@radix-ui")) return "vendor-radix";
            if (id.includes("lucide-react")) return "vendor-lucide";
            if (id.includes("recharts")) return "vendor-recharts";
            if (id.includes("react-day-picker") || id.includes("date-fns")) return "vendor-dates";
            if (id.includes("@tanstack")) return "vendor-react-query";
            if (id.includes("@trpc")) return "vendor-trpc";
            if (id.includes("framer-motion")) return "vendor-motion";
            if (id.includes("/gsap/") || id.includes("\\gsap\\") || id.endsWith("gsap")) return "vendor-gsap";
            if (id.includes("embla-carousel")) return "vendor-embla";
            if (id.includes("react-hook-form") || id.includes("@hookform") || id.includes("zod")) return "vendor-forms";
            // Intentionally NOT splitting react / react-dom / small libs:
            // letting Vite decide avoids the circular-chunk hazard above.
          }
          // Heavy generated product manifest in its own chunk so it's cacheable
          if (id.includes("/data/products.generated")) return "data-products";
        },
      },
    },
  },
  server: {
    host: true,
    allowedHosts: ["localhost", "127.0.0.1"],
    fs: {
      strict: true,
      deny: ["**/.*"],
    },
  },
});
