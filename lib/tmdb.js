import axios from "axios";

const API_KEY = process.env.TMDB_API_KEY;
const BASE_URL = "https://api.themoviedb.org/3";

// reusable axios instance
const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000, // 10 seconds timeout
});

// safe fetch wrapper
async function safeRequest(endpoint, params = {}) {
  try {
    const response = await api.get(endpoint, {
      params: { api_key: API_KEY, ...params },
    });

    return response.data?.results || [];
  } catch (error) {
    console.error("TMDB Axios Error:", error.message);
    return []; // ALWAYS safe fallback
  }
}

// Movie categories
export async function getTrending() {
  return safeRequest("/trending/movie/week");
}

export async function getTopRated() {
  return safeRequest("/movie/top_rated");
}

export async function getUpcoming() {
  return safeRequest("/movie/upcoming");
}
