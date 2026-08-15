import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  base: "/incurise-recruit-site/",
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        main: new URL("./index.html", import.meta.url).pathname,
        preview: new URL("./preview/index.html", import.meta.url).pathname,
      },
    },
  },
});
