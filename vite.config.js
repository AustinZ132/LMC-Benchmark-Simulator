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
        manualChunks(id) {
          if (!id.includes('node_modules')) return undefined;
          if (id.includes('html2canvas')) return 'export-image';
          if (id.includes('jspdf')) return 'export-pdf';
          if (id.includes('dompurify')) return 'export-sanitize';
          if (id.includes('react') || id.includes('scheduler')) return 'react-vendor';
          if (id.includes('chart.js') || id.includes('chartjs-plugin-zoom')) return 'charts';
          if (id.includes('lucide-react')) return 'icons';
          if (id.includes('gsap')) return 'animation';
          if (id.includes('ua-parser-js')) return 'system-info';
          return 'vendor';
        }
      }
    }
  },
  server: {
    port: 3000,
    host: '0.0.0.0',
    open: false
  },
  css: {
    devSourcemap: true
  }
});
