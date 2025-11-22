import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
  root: 'src',
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
        index: '/index.html',
        projects: '/pages/projects/projects.html',
        aboutme: '/pages/aboutme/aboutme.html',
        contact: '/pages/contact/contact.html',
        learning: '/pages/learning/learning.html',
      },
      output: {
        manualChunks: undefined,
      },
    },
    chunkSizeWarningLimit: 14,
  },
  server: {
    open: true
  }
});
