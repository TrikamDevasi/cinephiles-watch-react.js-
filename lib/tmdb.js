import https from "https";

// Reuse TCP connections — prevents ECONNRESET from connection thrashing
const agent = new https.Agent({
  keepAlive: true,
  keepAliveMsecs: 10000,
  maxSockets: 10,
});

const TMDB_BASE = "https://api.themoviedb.org/3";
const TMDB_API_TOKEN = process.env.TMDB_API_TOKEN;
const TMDB_API_KEY = process.env.TMDB_API_KEY || process.env.NEXT_PUBLIC_TMDB_API_KEY;

async function fetchWithRetry(url, options = {}, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      const res = await fetch(url, {
        ...options,
      });
      if (res.ok) return res;
      // Don't retry 404 — movie genuinely doesn't exist
      if (res.status === 404) return res;
      throw new Error(`HTTP ${res.status}`);
    } catch (err) {
      const isLast = i === retries - 1;
      if (isLast) throw err;
      const delay = (i + 1) * 1000; // 1s, 2s, 3s
      console.warn(
        `[TMDB] Attempt ${i + 1} failed (${err.message}), retrying in ${delay}ms...`
      );
      await new Promise((r) => setTimeout(r, delay));
    }
  }
}

export async function fetchTMDB(endpoint, params = {}) {
  const url = new URL(`${TMDB_BASE}${endpoint}`);
  
  const headers = {
    Accept: "application/json",
  };

  if (TMDB_API_TOKEN) {
    headers.Authorization = `Bearer ${TMDB_API_TOKEN}`;
  } else if (TMDB_API_KEY) {
    url.searchParams.set("api_key", TMDB_API_KEY);
  } else {
    throw new Error("No TMDB API key or token found");
  }

  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));

  const res = await fetchWithRetry(url.toString(), {
    headers,
    next: { revalidate: 3600 },
  });

  if (!res.ok) throw new Error(`TMDB ${res.status} on ${endpoint}`);
  return res.json();
}

export const getTrending = () => fetchTMDB("/trending/movie/week");
export const getPopular = () => fetchTMDB("/movie/popular");
export const getTopRated = () => fetchTMDB("/movie/top_rated");
export const getUpcoming = () => fetchTMDB("/movie/upcoming");
export const getMovieDetails = (id) =>
  fetchTMDB(`/movie/${id}`, {
    append_to_response: "videos,credits,similar",
  });
export const searchMovies = (q) => fetchTMDB("/search/movie", { query: q });
