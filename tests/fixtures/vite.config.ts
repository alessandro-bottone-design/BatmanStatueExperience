import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { fileURLToPath } from "node:url";
export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    outDir: "/tmp/batman87-figma-ds-fixture",
    emptyOutDir: true,
    minify: "esbuild",
    rolldownOptions: {
      input: fileURLToPath(new URL("./ds.html", import.meta.url)),
    },
  },
});
