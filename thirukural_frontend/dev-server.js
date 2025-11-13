#!/usr/bin/env node
/**
 * PUBLIC_INTERFACE
 * Dev server with a /health route and static proxy to Vite dev server.
 * Usage:
 *  - node dev-server.js
 *
 * Starts an Express server exposing:
 *  - GET /health -> { status: "ok" }
 * Note: For asset serving and HMR, use `npm run start` which runs Vite.
 */
import express from 'express';

const app = express();
const PORT = process.env.PORT ? Number(process.env.PORT) : 3000;

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.listen(PORT, '0.0.0.0', () => {
  // eslint-disable-next-line no-console
  console.log(`Dev health server running on http://0.0.0.0:${PORT}/health`);
});
