import MovieDetails from "@/components/MovieDetails";
import NotifyButton from "@/components/NotifyButton";
import { getProviders } from "@/utils/providerCache";

/* =======================
   METADATA
======================= */
export async function generateMetadata({ params }) {
  const { id } = params;
  const API_KEY = process.env.TMDB_API_KEY;

  try {
    const res = await fetch(
      `https://api.themoviedb.org/3/movie/${id}?api_key=${API_KEY}`,
      { cache: "no-store" }
    );

    if (!res.ok) throw new Error("Failed");

    const movie = await res.json();

    return {
      title: `${movie.title} | Cinephiles Watch`,
      description:
        movie.overview?.slice(0, 160) ||
        "Movie details, cast, trailer and streaming info.",
    };
  } catch {
    return { title: "Movie | Cinephiles Watch" };
  }
}

export default async function MoviePage({ params, searchParams }) {
  const { id } = params;
  const API_KEY = process.env.TMDB_API_KEY;
  const BASE_URL = "https://api.themoviedb.org/3";
  const region = searchParams?.region === "US" ? "US" : "IN";

  try {
    const movieRes = await fetch(
      `${BASE_URL}/movie/${id}?api_key=${API_KEY}&append_to_response=videos,images,credits`,
      { cache: "no-store" }
    );

    if (!movieRes.ok) throw new Error("Movie fetch failed");

    const movie = await movieRes.json();

    let similar = { results: [] };
    try {
      const res = await fetch(
        `${BASE_URL}/movie/${id}/similar?api_key=${API_KEY}`,
        { cache: "no-store" }
      );
      if (res.ok) similar = await res.json();
    } catch {}

    const providers = await getProviders(id, region, API_KEY);

    return (
      <>
        <MovieDetails
          movie={movie}
          similar={similar.results || []}
          providers={providers}
          region={region}
        />

        <div style={{ maxWidth: 900, margin: "0 auto", padding: "0 16px" }}>
          <NotifyButton movieId={movie.id} />
        </div>
      </>
    );
  } catch {
    return (
      <div
        style={{
          minHeight: "80vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <h1>Movie details unavailable</h1>
      </div>
    );
  }
}
