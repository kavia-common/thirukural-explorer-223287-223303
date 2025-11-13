# Thirukural Frontend

Minimal React app (Vite) for displaying a random Thirukural and its meaning.

## Scripts
- npm run start (or npm run dev): Start Vite on port 3000, host 0.0.0.0
- npm run build: Build production bundle
- npm run preview: Preview build on port 3000

## API
The app fetches a random kural from:
- /api/random (proxied to http://localhost:3001 via vite.config.js)
- Falls back to http://localhost:3001/api/random if proxy is unavailable.

Ensure the backend provides an endpoint compatible with one of these.

## Health
A lightweight dev health server is included:
- node dev-server.js -> exposes GET /health returning {status:"ok"} on port 3000

This is optional for local development; use Vite for the app.

## Run
1. cd thirukural_frontend
2. npm install
3. npm start
4. Open http://localhost:3000

Make sure the backend is running on http://localhost:3001.
