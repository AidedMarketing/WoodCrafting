import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
export default defineConfig(({ command, isPreview }) => ({
  base: command === "serve" && !isPreview ? "/" : "/WoodCrafting/",
  plugins: [react()],
  build: { rollupOptions: { output: { manualChunks: { three: ["three"] } } } },
}));
