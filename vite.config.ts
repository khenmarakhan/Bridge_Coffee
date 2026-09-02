import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  base: "/Bridge_Coffee/",
  plugins: [react()],
  server: {
    allowedHosts: [".muleusercontent.com"],
  },
  build: {
    emptyOutDir: true,
    outDir: "dist",
  },
});
