import MovieDetails from "@/components/MovieDetails";
import { fetchWithRetry } from "@/lib/fetcher"; // Use our safe fetcher

// 1. DYNAMIC SEO METADATA
export async function generateMetadata({ params }) {
  const { id } = params;
  const API_KEY = process.env.TMDB_API_KEY;
  
  // Fetch just minimal data for the title tag
  const res = await fetch(`https://api.themoviedb.org/3/movie/${id}?api_key=${API_KEY}`);
  const movie = await res.json();

  return {
    title: `${movie.title || 'Movie'} | CINEPHILES`,
    description: movie.overview?.slice(0, 160) || "Watch now on Cinephiles.",
    openGraph: {
      images: [`https://image.tmdb.org/t/p/w1280${movie.backdrop_path}`],
    },
  };
}

export default async function MoviePage({ params }) {
  const { id } = params;
  const API_KEY = process.env.TMDB_API_KEY;
  const BASE_URL = "https://api.themoviedb.org/3";

  try {
    // 2. PARALLEL FETCHING (Native Fetch)
    const [movieRes, similarRes] = await Promise.all([
      fetchWithRetry(`${BASE_URL}/movie/${id}?api_key=${API_KEY}&append_to_response=videos,images,credits`),
      fetchWithRetry(`${BASE_URL}/movie/${id}/similar?api_key=${API_KEY}`)
    ]);

    const movie = await movieRes.json();
    const similar = await similarRes.json();

    return (
      <MovieDetails
        movie={movie}
        similar={similar.results || []}
      />
    );
  } catch (error) {
    console.error("MoviePage Error:", error.message);
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        <h1 className="text-2xl">Movie details unavailable</h1>
      </div>
    );
  }
}
