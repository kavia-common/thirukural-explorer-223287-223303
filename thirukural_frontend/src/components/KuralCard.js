/* eslint-disable react/prop-types */
// PUBLIC_INTERFACE
/**
 * KuralCard - Presentational component for rendering a Thirukural.
 *
 * Props:
 * - loading: boolean - shows loading state when true
 * - error: string | null - shows an error banner if set (non-PII)
 * - kural: {
 *     number?: number,
 *     kural_tamil?: string,
 *     kural_english?: string,
 *     section?: string,
 *     chapter?: string
 *   } | null
 * - onRefresh: () => void - called when user requests a new random kural or retry
 */
function KuralCard({ loading, error, kural, onRefresh }) {
  return (
    <div className="kural-card" role="region" aria-label="Thirukural viewer">
      <div className="kural-card-header">
        <h1 className="app-title">Thirukural Explorer</h1>
        <p className="app-subtitle">Discover timeless couplets and their meaning</p>
      </div>

      {loading && (
        <div className="kural-loading" role="status" aria-live="polite">
          <div className="spinner" aria-hidden="true" />
          <div className="loading-text">Fetching a beautiful Kural…</div>
        </div>
      )}

      {!loading && error && (
        <div className="kural-error" role="alert">
          <div className="error-title">Something went wrong</div>
          <div className="error-message">{error}</div>
          <button className="btn btn-primary" onClick={onRefresh} aria-label="Retry loading Thirukural">
            Try Again
          </button>
        </div>
      )}

      {!loading && !error && kural && (
        <div className="kural-content">
          <div className="kural-meta">
            {typeof kural.number !== 'undefined' && (
              <span className="badge">Kural #{kural.number}</span>
            )}
            {(kural.section || kural.chapter) && (
              <div className="meta-line">
                {kural.section && <span className="muted">Section: {kural.section}</span>}
                {kural.section && kural.chapter && <span className="divider">•</span>}
                {kural.chapter && <span className="muted">Chapter: {kural.chapter}</span>}
              </div>
            )}
          </div>

          {kural.kural_tamil && (
            <blockquote
              className="kural-tamil"
              lang="ta"
              style={{ fontFamily: `"Noto Sans Tamil", "Latha", "Vijaya", "Mukta Malar", "Noto Serif Tamil", "System UI", sans-serif` }}
            >
              {kural.kural_tamil}
            </blockquote>
          )}

          {kural.kural_english && (
            <p className="kural-english">
              {kural.kural_english}
            </p>
          )}

          <div className="actions">
            <button className="btn btn-primary" onClick={onRefresh} aria-label="Get new random Thirukural">
              New Random Thirukural
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default KuralCard;
