//
// PUBLIC_INTERFACE
/**
 * getRandomKural - Fetches a random Thirukural from the backend with smart base URL handling.
 *
 * Order of base URL resolution:
 * 1) Try relative '/api' (works when frontend dev server proxies to backend or path is routed)
 * 2) If REACT_APP_API_URL is defined, use it as base
 * 3) Fallback to absolute origin with port 3001 on same hostname
 *
 * The function handles:
 * - Non-2xx responses with a readable error
 * - JSON parse errors gracefully
 * - Network errors with a retry on next-best base URL
 *
 * Returns a normalized object with at least:
 * {
 *   number?: number,
 *   kural_tamil?: string,
 *   kural_english?: string,
 *   section?: string,
 *   chapter?: string
 * }
 */
export async function getRandomKural() {
  const envBase = process.env.REACT_APP_API_URL && process.env.REACT_APP_API_URL.trim();
  const relativeBase = '/api';
  const fallbackBase = `${window.location.protocol}//${window.location.hostname}:3001`;

  const basesToTry = [relativeBase];
  if (envBase) basesToTry.push(envBase);
  // Ensure we don't duplicate fallback if envBase already equals it
  if (!envBase || envBase !== fallbackBase) basesToTry.push(fallbackBase);

  let lastError;

  for (const base of basesToTry) {
    const url = `${base.replace(/\/+$/, '')}/v1/thirukural/random`;
    try {
      const res = await window.fetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/json'
        },
      });

      if (!res.ok) {
        const text = await safeReadText(res);
        throw new Error(`Request failed (${res.status}): ${truncate(text || res.statusText, 200)}`);
      }

      let data;
      try {
        data = await res.json();
      } catch (err) {
        throw new Error('Received invalid JSON from the server.');
      }

      // Normalize keys to expected UI fields, being permissive about backend shape.
      const normalized = normalizeKuralResponse(data);
      return normalized;

    } catch (err) {
      lastError = err;
      // Try next base in list
      continue;
    }
  }

  // If all attempts failed
  const userMessage = 'Unable to load a Thirukural right now. Please try again.';
  const error = new Error(userMessage);
  // Attach original error for internal logging if needed (not displayed in UI)
  error.cause = lastError;
  throw error;
}

/**
 * Normalize varying backend response shapes into consistent fields.
 */
function normalizeKuralResponse(data) {
  // Common possible keys from different APIs
  const number = data?.number ?? data?.id ?? data?.kural_no ?? data?.kuralNumber;

  // Map 'kural' (backend Tamil text) to kural_tamil, preserving other possible shapes
  const tamil =
    data?.kural_tamil
      ?? data?.kural
      ?? data?.tamil
      ?? (data?.line1 || data?.line2
        ? [data?.line1, data?.line2].filter(Boolean).join(' ')
        : undefined);

  // Map 'translation' (backend English meaning) to kural_english
  const english =
    data?.kural_english
      ?? data?.translation
      ?? data?.eng
      ?? data?.meaning;

  const section = data?.section ?? data?.adhikaram ?? data?.paal ?? data?.meta?.section;
  const chapter = data?.chapter ?? data?.iyal ?? data?.meta?.chapter;

  return {
    number,
    kural_tamil: tamil,
    kural_english: english,
    section,
    chapter
  };
}

async function safeReadText(res) {
  try {
    return await res.text();
  } catch {
    return '';
  }
}

function truncate(str, max) {
  if (!str) return '';
  return str.length > max ? `${str.slice(0, max)}…` : str;
}
