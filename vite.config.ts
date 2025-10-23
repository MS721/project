import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

export default defineConfig({
  server: {
    host: "::",
    port: 8080,
    fs: {
      allow: [
        ".", // project root
        "./src",
        // removed "./client" and "./shared" since those folders don't exist
        path.resolve(__dirname, "node_modules"),
      ],
      deny: [
        ".env",
        ".env.*",
        "*.{crt,pem}",
        "**/.git/**",
      ],
    },
  },
  build: {
    outDir: "dist/spa", // client-only build
  },
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      // removed "@shared" alias
    },
  },
});
