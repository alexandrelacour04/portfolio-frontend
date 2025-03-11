import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: './', // Important pour des chemins relatifs
  build: {
    outDir: 'dist',
  },
  plugins: [react()],
});