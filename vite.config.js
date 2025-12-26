import { defineConfig } from "vite";
import path from "path";

export default defineConfig({
  root: "src",
  publicDir: "static",
  build: {
    outDir: "dist",
    minify: "terser",
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
        pure_funcs: [
          "console.log",
          "console.info",
          "console.debug",
          "console.warn",
        ],
        passes: 2,
      },
      mangle: {
        toplevel: true,
      },
      format: {
        comments: false,
      },
    },
    rollupOptions: {
      input: {
        index: "/index.html",
        grid: "/pages/grid/grid.html",
      },
      output: {
        manualChunks: undefined,
      },
    },
    chunkSizeWarningLimit: 14,
  },
  server: {
    open: true,
  },
});
