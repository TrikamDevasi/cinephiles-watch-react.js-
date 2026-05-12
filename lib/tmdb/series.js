import { fetchTMDB } from "../tmdb";

export async function searchSeries(query) {
  const token = process.env.TMDB_API_TOKEN;
  const apiKey = process.env.TMDB_API_KEY || process.env.NEXT_PUBLIC_TMDB_API_KEY;

  let url = `https://api.themoviedb.org/3/search/tv?query=${encodeURIComponent(query)}&language=en-US&page=1`;
  
  const headers = {
    Accept: "application/json",
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  } else if (apiKey) {
    url += `&api_key=${apiKey}`;
  } else {
    throw new Error("No TMDB API key or token found");
  }

  const response = await fetch(url, { headers });
  
  if (!response.ok) {
    throw new Error(`TMDB HTTP ${response.status}`);
  }
  
  const data = await response.json();
  console.log("[TMDB Series Search Raw Response]:", data);
  return data.results;
}

export const getSeriesDetails = (tvId) => fetchTMDB(`/tv/${tvId}`, { append_to_response: "videos,images,credits,external_ids" });

export const getSeriesSeasons = (tvId, seasonNumber) =>
  fetchTMDB(`/tv/${tvId}/season/${seasonNumber}`);

export const getSeriesEpisodes = (tvId, seasonNumber, episodeNumber) =>
  fetchTMDB(`/tv/${tvId}/season/${seasonNumber}/episode/${episodeNumber}`);

export const getPopularSeries = () => fetchTMDB("/tv/popular");

export const getTrendingSeries = () => fetchTMDB("/trending/tv/week");
