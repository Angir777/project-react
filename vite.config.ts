import path from 'node:path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// https://vite.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(import.meta.dirname, 'src/app'),
      '@environments': path.resolve(import.meta.dirname, 'src/environments'),
    },
  },
  server: {
    port: 4200,
  },
  build: {
    // Same output layout as the Angular project (dist/<env>-dailo-app/browser),
    // so build/post-build.cjs can replace {{APP_VERSION_TO_REPLACE}}.
    outDir: mode === 'dev' ? 'dist/dev-dailo-app/browser' : 'dist/prod-dailo-app/browser',
    emptyOutDir: true,
  },
}));
