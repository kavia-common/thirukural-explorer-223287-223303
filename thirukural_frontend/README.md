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

Ensure the backend provides endpoints:
- GET /api/random
- GET /health (for backend readiness)

## Frontend Health
Vite dev server exposes a health endpoint for readiness:
- GET /health -> { "status": "ok" }
- You can customize the path via env var REACT_APP_HEALTHCHECK_PATH (default "/health").

Note: A separate custom dev-server is not required and has been removed to avoid conflicts.

## Run
1. cd thirukural_frontend
2. npm install
3. npm start
4. Open http://localhost:3000

Make sure the backend is running on http://localhost:3001.
