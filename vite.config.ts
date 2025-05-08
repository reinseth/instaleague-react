import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig((config) => ({
  base: config.mode === "production" ? "/instaleague-react" : undefined,
  plugins: [react(), tailwindcss()],
}));
