import axios from "axios";
import MovieDetails from "@/components/MovieDetails";

export default async function MoviePage({ params }) {
  const { id } = params;

  try {
    const API_KEY = process.env.TMDB_API_KEY;
    const BASE_URL = "https://api.themoviedb.org/3";

    const movieReq = axios.get(`${BASE_URL}/movie/${id}`, {
      params: { api_key: API_KEY, append_to_response: "videos,images,credits" },
    });

    const similarReq = axios.get(`${BASE_URL}/movie/${id}/similar`, {
      params: { api_key: API_KEY },
    });

    const [movieRes, similarRes] = await Promise.all([movieReq, similarReq]);

    return (
      <MovieDetails
        movie={movieRes.data}
        similar={similarRes.data.results || []}
      />
    );
  } catch (error) {
    console.error("MoviePage Error:", error.message);
    return (
      <div style={{ padding: "40px", color: "white" }}>
        <h1>Movie Not Found</h1>
      </div>
    );
  }
}
