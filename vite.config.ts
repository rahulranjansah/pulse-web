import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
//
// `base` controls the URL prefix the built site is served from.
//   - GitHub Pages at <user>.github.io/pulse-web → set BASE_PATH=/pulse-web/
//   - Custom domain or local dev → leave unset (defaults to "/")
// The GitHub Actions workflow sets this env var automatically on deploy.
export default defineConfig({
  plugins: [react()],
  base: process.env.BASE_PATH ?? "/",
  resolve: {
    alias: {
      "@": "/src",
    },
  },
});
