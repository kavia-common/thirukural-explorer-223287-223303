import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// PUBLIC_INTERFACE
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    // host can be true or a string; true means listen on all addresses
    host: true,
    proxy: {
      // Proxy API calls to the backend for local dev
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
        // Do not rewrite so frontend calls /api/* directly
        // If backend serves at /random (no /api prefix), uncomment the rewrite below.
        // rewrite: (path) => path.replace(/^\/api/, '')
      }
    },
    // Add a lightweight health endpoint for readiness checks
    // PUBLIC_INTERFACE
    // This middleware exposes a configurable health path (default /health)
    // returning { status: "ok" } with 200.
    // Uses REACT_APP_HEALTHCHECK_PATH if provided.
    setup: (server) => {
      const healthPath = process.env.REACT_APP_HEALTHCHECK_PATH || '/health';
      server.middlewares.use((req, res, next) => {
        if (req.url === healthPath && req.method === 'GET') {
          res.setHeader('Content-Type', 'application/json');
          res.statusCode = 200;
          res.end(JSON.stringify({ status: 'ok' }));
          return;
        }
        next();
      });
    }
  },
  preview: {
    port: 3000,
    host: true
  }
});
