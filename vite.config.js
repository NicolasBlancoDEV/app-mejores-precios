import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import bundleAnalyzer from 'vite-bundle-analyzer';

export default defineConfig({
  plugins: [
    react(),
    bundleAnalyzer(),
  ],
});