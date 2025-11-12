# thirukural-explorer-223287-223303 (Frontend)

This React UI displays a random Thirukural and its English meaning. It also includes an "Explain for Al Ayman" button that calls the backend AI analyzer.

How it works:
- "New Random Kural" loads a fresh couplet from GET /api/v1/thirukural/random
- "Explain for Al Ayman" posts the current couplet to POST /api/v1/thirukural/analyze and shows the returned explanation
- Works without any API key; if no key is configured, the backend returns a deterministic placeholder explanation

Environment:
- Optionally set REACT_APP_API_URL to point to the backend base URL (e.g. http://localhost:3001/api)
- Otherwise, the UI tries (in order): relative '/api', REACT_APP_API_URL, and http(s)://<host>:3001

Accessibility and i18n:
- Tamil content is rendered in a Unicode-safe manner and marked with lang="ta"
- Buttons include aria-labels and busy states

Developer notes:
- Edit src/App.jsx and src/api.js for UI and API integration
- No additional dependencies required
