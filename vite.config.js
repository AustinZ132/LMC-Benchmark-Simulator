import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  root: '.',
  base: './',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    minify: 'esbuild',
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'chart.js'],
          utils: ['html2canvas', 'jspdf']
        }
      }
    }
  },
  server: {
    port: 3000,
    host: '0.0.0.0',
    open: true
  },
  css: {
    devSourcemap: true
  }
});
