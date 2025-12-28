// utils/providerCache.js
// Session-level cache for TMDB watch providers

const providerCache = {};

/**
 * Fetch watch providers for a movie (cached per session)
 * @param {number} movieId - TMDB movie ID
 * @param {string} region - Country code (default: IN)
 * @param {string} apiKey - TMDB API key
 * @returns {Object} { streaming, rent, buy }
 */
export async function getProviders(movieId, region = "IN", apiKey) {
  const key = `${movieId}_${region}`;

  // Return from cache if exists
  if (providerCache[key]) {
    return providerCache[key];
  }

  try {
    const res = await fetch(
      `https://api.themoviedb.org/3/movie/${movieId}/watch/providers?api_key=${apiKey}`
    );

    const data = await res.json();

    const payload = {
      streaming: data.results?.[region]?.flatrate || [],
      rent: data.results?.[region]?.rent || [],
      buy: data.results?.[region]?.buy || [],
    };

    providerCache[key] = payload;
    return payload;
  } catch (error) {
    console.error("Provider fetch failed:", error);
    return {
      streaming: [],
      rent: [],
      buy: [],
    };
  }
}

/**
 * Optional helper to clear cache (useful for debugging)
 */
export function clearProviderCache() {
  Object.keys(providerCache).forEach((k) => delete providerCache[k]);
}
