import MovieDetails from "@/components/MovieDetails";
import NotifyButton from "@/components/NotifyButton";
import { getProviders } from "@/utils/providerCache";

/* =======================
   METADATA (SEO)
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
      openGraph: {
        images: movie.backdrop_path
          ? [`https://image.tmdb.org/t/p/w1280${movie.backdrop_path}`]
          : [],
      },
    };
  } catch {
    return {
      title: "Movie | Cinephiles Watch",
      description: "Movie details unavailable",
    };
  }
}

export default async function MoviePage({ params, searchParams }) {
  const { id } = params;
  const API_KEY = process.env.TMDB_API_KEY;
  const BASE_URL = "https://api.themoviedb.org/3";

  // Region support (default IN)
  const region = searchParams?.region === "US" ? "US" : "IN";

  try {
    const [movieRes, similarRes, providers] = await Promise.all([
      fetch(
        `${BASE_URL}/movie/${id}?api_key=${API_KEY}&append_to_response=videos,images,credits`,
        { cache: "no-store" }
      ),
      fetch(
        `${BASE_URL}/movie/${id}/similar?api_key=${API_KEY}`,
        { cache: "no-store" }
      ),
      getProviders(id, region, API_KEY),
    ]);

    const movie = await movieRes.json();
    const similar = await similarRes.json();

    if (!movie || movie.success === false) {
      throw new Error("Invalid movie data");
    }

    /* =======================
       MOVIE STRUCTURED DATA
    ======================= */
    const jsonLd = {
      "@context": "https://schema.org",
      "@type": "Movie",
      name: movie.title,
      description: movie.overview,
      image: movie.poster_path
        ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
        : undefined,
      datePublished: movie.release_date,
      aggregateRating: movie.vote_average
        ? {
            "@type": "AggregateRating",
            ratingValue: movie.vote_average,
            ratingCount: movie.vote_count,
          }
        : undefined,
    };

    return (
      <>
        {/* SEO JSON-LD */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />

        {/* MOVIE DETAILS */}
        <MovieDetails
          movie={movie}
          similar={similar.results || []}
          providers={providers}
          region={region}
        />

        {/* USER ACTIONS */}
        <div
          style={{
            maxWidth: 900,
            margin: "0 auto",
            padding: "0 16px",
          }}
        >
          <NotifyButton movieId={movie.id} />
        </div>
      </>
    );
  } catch (error) {
    console.error("MoviePage Error:", error.message);

    return (
      <div
        style={{
          minHeight: "80vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 16,
        }}
      >
        <h1 style={{ fontSize: "1.5rem" }}>
          Movie details unavailable
        </h1>
        <a
          href="/"
          style={{
            opacity: 0.7,
            textDecoration: "underline",
          }}
        >
          Go back to home
        </a>
      </div>
    );
  }
}
