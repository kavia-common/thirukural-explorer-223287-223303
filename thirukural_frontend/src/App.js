import React, { useState, useEffect, useCallback } from 'react';
import './App.css';
import { getRandomKural } from './api';
import KuralCard from './components/KuralCard';

// PUBLIC_INTERFACE
function App() {
  const [theme, setTheme] = useState('light');
  const [kural, setKural] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  // Effect to apply theme to document element
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // PUBLIC_INTERFACE
  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };

  const fetchKural = useCallback(async () => {
    setLoading(true);
    setErrorMsg(null);
    try {
      const data = await getRandomKural();
      setKural(data);
    } catch (err) {
      // Show non-PII message
      setErrorMsg(err?.message || 'Unable to load a Thirukural right now.');
      setKural(null);
    } finally {
      setLoading(false);
    }
  }, []);

  // On mount, load one kural
  useEffect(() => {
    fetchKural();
  }, [fetchKural]);

  return (
    <div className="App">
      <header className="App-header">
        <button
          className="theme-toggle"
          onClick={toggleTheme}
          aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
        >
          {theme === 'light' ? '🌙 Dark' : '☀️ Light'}
        </button>

        <main className="container">
          <KuralCard
            loading={loading}
            error={errorMsg}
            kural={kural}
            onRefresh={fetchKural}
          />
        </main>
      </header>
    </div>
  );
}

export default App;
