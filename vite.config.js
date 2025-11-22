import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
  publicDir: 'static',
  build: {
    outDir: 'dist',
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
        pure_funcs: ['console.log', 'console.info', 'console.debug', 'console.warn'],
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
        index: 'src/index.html',
        projects: 'src/pages/projects/projects.html',
        aboutme: 'src/pages/aboutme/aboutme.html',
        contact: 'src/pages/contact/contact.html',
        learning: 'src/pages/learning/learning.html',
      },
      output: {
        manualChunks: undefined,
      },
    },
    chunkSizeWarningLimit: 14,
  }
});
