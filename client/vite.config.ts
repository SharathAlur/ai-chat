import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 8080, // Change to your desired port
    strictPort: true, // Optional: prevents Vite from automatically trying the next port if 3000 is busy
    proxy: {
      "/api": "http://localhost:3001",
    },
  },
});
