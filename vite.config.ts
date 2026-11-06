import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    hmr: process.env.DISABLE_HMR !== "true",
    fs: {
      strict: false,
    },
  },
  build: {
    minify: "esbuild",
    rolldownOptions: { input: { index: "index.html", notFound: "404.html" } },
  },
});
