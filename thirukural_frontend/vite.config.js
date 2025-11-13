import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// PUBLIC_INTERFACE
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    host: '0.0.0.0',
    proxy: {
      // Proxy API calls to the backend for local dev
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
        // Do not rewrite so frontend calls /api/* directly
        // If backend serves at /api/random, this works as-is.
        // If backend serves at /random, uncomment the rewrite below.
        // rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  },
  preview: {
    port: 3000,
    host: '0.0.0.0'
  }
});
