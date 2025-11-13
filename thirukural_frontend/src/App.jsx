import React, { useCallback, useEffect, useState } from 'react';

/**
 * PUBLIC_INTERFACE
 * App
 * This is the main UI component for the Thirukural Explorer.
 * - Displays a centered card with a random Thirukural and its meaning.
 * - Provides a "Generate New" button to fetch a new random Thirukural.
 * - Handles loading and error states gracefully.
 *
 * API:
 * - Expects a backend endpoint available at /api/random (proxied to http://localhost:3001).
 *   If your backend exposes a different path, adjust the API_URL constant accordingly.
 *
 * Returns:
 * - A React element representing the application UI.
 */
export default function App() {
  // UI theme constants (light, modern, minimalistic)
  const styles = {
    container: {
      minHeight: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px'
    },
    card: {
      width: '100%',
      maxWidth: '720px',
      backgroundColor: 'var(--card)',
      border: '1px solid var(--border)',
      borderRadius: '16px',
      padding: '28px',
      boxShadow: '0 10px 30px rgba(0,0,0,0.06)'
    },
    header: {
      margin: 0,
      fontSize: '24px',
      lineHeight: 1.2,
      color: 'var(--primary)'
    },
    subheader: {
      margin: '4px 0 0 0',
      color: 'var(--secondary)',
      fontSize: '14px'
    },
    kural: {
      marginTop: '20px',
      fontSize: '18px',
      lineHeight: 1.7
    },
    meaningWrap: {
      marginTop: '16px',
      background: '#f8fafc',
      border: '1px solid var(--border)',
      borderRadius: '12px',
      padding: '16px'
    },
    meaningLabel: {
      margin: 0,
      fontWeight: 600,
      color: '#0f172a',
      fontSize: '14px'
    },
    meaning: {
      margin: '6px 0 0 0',
      color: '#334155',
      fontSize: '15px',
      lineHeight: 1.6
    },
    actions: {
      marginTop: '22px',
      display: 'flex',
      gap: '12px',
      alignItems: 'center'
    },
    button: {
      padding: '10px 16px',
      borderRadius: '10px',
      border: '1px solid #2563eb',
      background: 'linear-gradient(135deg, rgba(59,130,246,0.15), rgba(6,182,212,0.10))',
      color: '#1e40af',
      fontWeight: 600,
      cursor: 'pointer'
    },
    muted: {
      color: '#64748b',
      fontSize: '14px'
    },
    error: {
      color: 'var(--error)',
      fontSize: '14px',
      fontWeight: 600
    }
  };

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Prefer proxy path during dev. If failing, fallback to explicit backend URL.
  const PROXIED_URL = '/api/random';
  const DIRECT_URL = 'http://localhost:3001/api/random';

  const fetchRandom = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      // Try proxied call first
      let res = await fetch(PROXIED_URL, { headers: { 'Accept': 'application/json' } });
      if (!res.ok) {
        // If proxy fails (e.g., not configured), try direct URL
        res = await fetch(DIRECT_URL, { headers: { 'Accept': 'application/json' } });
      }
      if (!res.ok) {
        throw new Error(`API error: ${res.status} ${res.statusText}`);
      }
      const json = await res.json();

      // Normalize expected fields. Backends may differ, so support common variants.
      const kural = json.kural || json.couplet || json.text || '';
      const meaning = json.meaning || json.explanation || json.translation || '';
      const number = json.number || json.id || json.kural_number || null;

      setData({ kural, meaning, number });
    } catch (e) {
      setError(e?.message || 'Failed to load data');
      setData(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRandom();
  }, [fetchRandom]);

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <header>
          <h1 style={styles.header}>Thirukural Explorer</h1>
          <p style={styles.subheader}>Discover timeless couplets with clear English meaning.</p>
        </header>

        <section aria-live="polite">
          {loading && <p className="loading" style={styles.muted}>Loading a random Thirukural…</p>}
          {error && !loading && <p role="alert" style={styles.error}>Error: {error}</p>}
          {!loading && !error && data && (
            <>
              {data.number ? (
                <p style={{ ...styles.muted, margin: '12px 0 0 0' }}>Kural #{data.number}</p>
              ) : null}
              <p style={styles.kural}>{data.kural}</p>

              <div style={styles.meaningWrap}>
                <p style={styles.meaningLabel}>Meaning</p>
                <p style={styles.meaning}>{data.meaning}</p>
              </div>
            </>
          )}
        </section>

        <div style={styles.actions}>
          <button
            type="button"
            style={styles.button}
            onClick={fetchRandom}
            aria-label="Generate a new random Thirukural"
            disabled={loading}
          >
            {loading ? 'Please wait…' : 'Generate New'}
          </button>
          <span style={styles.muted}>API: /api/random → http://localhost:3001</span>
        </div>
      </div>
    </div>
  );
}
