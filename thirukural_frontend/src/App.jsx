import React, { useEffect, useState } from 'react';
import { getRandomKural, analyzeKural } from './api';

// Simple styles inline to keep consistent with light theme and accessibility
const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: '#f8fafc',
    color: '#111827',
    padding: '1rem'
  },
  card: {
    background: '#ffffff',
    borderRadius: '0.75rem',
    boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -4px rgba(0,0,0,0.1)',
    width: '100%',
    maxWidth: '720px',
    padding: '1.25rem 1.25rem 1rem'
  },
  header: {
    marginBottom: '0.75rem'
  },
  title: {
    fontSize: '1.25rem',
    fontWeight: 700,
    color: '#3b82f6'
  },
  sub: { color: '#64748b', marginTop: '0.125rem', fontSize: '0.9rem' },
  kuralTamil: {
    fontSize: '1.25rem',
    lineHeight: 1.8,
    whiteSpace: 'pre-wrap',
    marginTop: '0.5rem'
  },
  translation: {
    marginTop: '0.75rem',
    fontSize: '1rem'
  },
  meta: {
    marginTop: '0.25rem',
    fontSize: '0.9rem',
    color: '#64748b'
  },
  actions: {
    display: 'flex',
    gap: '0.75rem',
    marginTop: '1rem',
    flexWrap: 'wrap'
  },
  btnPrimary: {
    background: '#3b82f6',
    color: '#fff',
    border: 'none',
    borderRadius: '0.5rem',
    padding: '0.6rem 1rem',
    cursor: 'pointer'
  },
  btnSecondary: {
    background: '#06b6d4',
    color: '#fff',
    border: 'none',
    borderRadius: '0.5rem',
    padding: '0.6rem 1rem',
    cursor: 'pointer'
  },
  btnDisabled: {
    opacity: 0.6,
    cursor: 'not-allowed'
  },
  explanationPanel: {
    marginTop: '1rem',
    background: '#f1f5f9',
    borderRadius: '0.5rem',
    padding: '0.75rem'
  },
  explanationTitle: {
    fontWeight: 600,
    marginBottom: '0.25rem'
  },
  explanationText: {
    whiteSpace: 'pre-wrap'
  },
  error: {
    marginTop: '0.75rem',
    color: '#dc2626',
    fontWeight: 600
  },
  smallNote: {
    marginTop: '0.25rem',
    fontSize: '0.8rem',
    color: '#64748b'
  }
};

export default function App() {
  const [kural, setKural] = useState(null);
  const [loading, setLoading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [error, setError] = useState('');
  const [analysis, setAnalysis] = useState(null);

  const fetchRandom = async () => {
    setLoading(true);
    setError('');
    setAnalysis(null);
    try {
      const item = await getRandomKural();
      setKural(item);
    } catch (e) {
      setError(e?.message || 'Failed to fetch a Thirukural.');
    } finally {
      setLoading(false);
    }
  };

  const handleAnalyze = async () => {
    if (!kural) return;
    setAnalyzing(true);
    setError('');
    try {
      const payload = {
        number: kural.number,
        kural: kural.kural_tamil,
        translation: kural.kural_english
      };
      const res = await analyzeKural(payload);
      setAnalysis(res);
    } catch (e) {
      setError(e?.message || 'Failed to analyze the Kural.');
    } finally {
      setAnalyzing(false);
    }
  };

  useEffect(() => {
    fetchRandom();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const disabled = loading || analyzing;

  return (
    <div style={styles.container}>
      <main style={styles.card} aria-live="polite">
        <header style={styles.header}>
          <h1 style={styles.title}>Thirukural Explorer</h1>
          <p style={styles.sub}>Discover a timeless couplet with its meaning.</p>
        </header>

        {kural && (
          <section>
            <div style={styles.meta}>Kural #{kural.number}</div>
            <div style={styles.kuralTamil} lang="ta" aria-label="Thirukural in Tamil">
              {kural.kural_tamil}
            </div>
            <div style={styles.translation} aria-label="English meaning">
              {kural.kural_english}
            </div>
            {(kural.section || kural.chapter) && (
              <div style={styles.meta}>
                {kural.section ? `Section: ${kural.section}` : ''}{' '}
                {kural.chapter ? `· Chapter: ${kural.chapter}` : ''}
              </div>
            )}
          </section>
        )}

        {error && <div role="alert" style={styles.error}>{error}</div>}

        <div style={styles.actions}>
          <button
            type="button"
            onClick={fetchRandom}
            style={{ ...styles.btnPrimary, ...(disabled ? styles.btnDisabled : {}) }}
            disabled={disabled}
            aria-busy={loading ? 'true' : 'false'}
            aria-label="Get a new random Thirukural"
          >
            {loading ? 'Loading…' : 'New Random Kural'}
          </button>

          <button
            type="button"
            onClick={handleAnalyze}
            style={{ ...styles.btnSecondary, ...(disabled ? styles.btnDisabled : {}) }}
            disabled={disabled || !kural}
            aria-busy={analyzing ? 'true' : 'false'}
            aria-label="Explain for Al Ayman"
          >
            {analyzing ? 'Analyzing…' : 'Explain for Al Ayman'}
          </button>
        </div>

        {analysis && (
          <section style={styles.explanationPanel} aria-label="AI explanation">
            <div style={styles.explanationTitle}>Explanation for {analysis.audience || 'Al Ayman'}</div>
            <div style={styles.explanationText}>{analysis.explanation}</div>
            <div style={styles.smallNote}>
              Source: {analysis.source} · Model: {analysis.model_used}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
