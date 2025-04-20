import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [
    react(),
  ],
  base: '/', // Asegura que las rutas sean relativas a la raíz
  build: {
    chunkSizeWarningLimit: 1000, // Agregamos esto para evitar la advertencia de chunks
  },
});