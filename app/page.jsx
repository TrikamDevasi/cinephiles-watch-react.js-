import { fetchTMDB } from "@/lib/tmdb";
import Row from "@/components/Row";
import RegionSwitcher from "@/components/RegionSwitcher";
import TraktRow from "@/components/TraktRow";
import HeroBanner from "@/components/HeroBanner";
import { Globe } from "lucide-react";
import { getTraktTrending, getTraktAnticipated, getTraktBoxOffice } from "@/lib/trakt";

export default async function HomePage({ searchParams }) {
  // Region switcher (default: IN)
  const region = searchParams?.region === "US" ? "US" : "IN";

  /* =======================
     DATE HELPERS
  ======================= */
  const today = new Date();
  const formatDate = (d) => d.toISOString().split("T")[0];
  const todayStr = formatDate(today);

  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - today.getDay());

  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6);

  const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);

  let data = {
    trending: [],
    topRated: [],
    comingThisWeek: [],
    comingThisMonth: [],
    ottThisMonth: [],
  };

  try {
    const [
      trending,
      topRated,
      comingThisWeek,
      comingThisMonth,
      ottThisMonth,
    ] = await Promise.all([
      fetchTMDB("/trending/movie/week").then(d => d.results || []),
      fetchTMDB("/movie/top_rated").then(d => d.results || []),

      // Theatrical – coming this week
      fetchTMDB("/discover/movie", {
        region,
        with_release_type: "2|3",
        "release_date.gte": formatDate(startOfWeek),
        "release_date.lte": formatDate(endOfWeek),
        sort_by: "popularity.desc"
      }).then(d => d.results || []),

      // Theatrical – coming this month
      fetchTMDB("/discover/movie", {
        region,
        with_release_type: "2|3",
        "release_date.gte": formatDate(startOfMonth),
        "release_date.lte": formatDate(endOfMonth),
        sort_by: "popularity.desc"
      }).then(d => d.results || []),

      // OTT releases this month
      fetchTMDB("/discover/movie", {
        region,
        with_release_type: 4,
        "release_date.gte": formatDate(startOfMonth),
        "release_date.lte": formatDate(endOfMonth),
        sort_by: "popularity.desc"
      }).then(d => d.results || []),
    ]);

    data = { trending, topRated, comingThisWeek, comingThisMonth, ottThisMonth };
  } catch (err) {
    console.error("Home page fetch error:", err);
  }

  /* =======================
     TRAKT FETCH
  ======================= */
  const [traktTrendingRes, anticipatedRes, boxOfficeRes] = await Promise.allSettled([
    getTraktTrending(),
    getTraktAnticipated(),
    getTraktBoxOffice(),
  ]);

  const traktTrending = traktTrendingRes.status === "fulfilled" ? traktTrendingRes.value : [];
  const anticipated = anticipatedRes.status === "fulfilled" ? anticipatedRes.value : [];
  const boxOffice = boxOfficeRes.status === "fulfilled" ? boxOfficeRes.value : [];

  const { trending, topRated, comingThisWeek, comingThisMonth, ottThisMonth } = data;


  /* =======================
     RELEASING TODAY
  ======================= */
  const releasingToday = comingThisWeek.filter(
    (m) => m.release_date === todayStr
  );

  const heroMovie =
    trending.length > 0
      ? trending[new Date().getDay() % trending.length]
      : null;

  let heroTrailerKey = null;
  let fullHeroMovie = heroMovie;

  if (heroMovie) {
    try {
      // Fetch full details to get imdb_id and videos
      const fullData = await fetchTMDB(`/movie/${heroMovie.id}`, { append_to_response: "videos" });
      fullHeroMovie = fullData;
      
      const video = fullData.videos?.results?.find(
        (v) => v.type === "Trailer" && v.site === "YouTube"
      );
      heroTrailerKey = video?.key || null;
    } catch (err) {
      console.error("Hero movie detail fetch error:", err);
      heroTrailerKey = null;
    }
  }

  /* =======================
     SEO STRUCTURED DATA
  ======================= */
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Cinephiles Watch",
    url: process.env.NEXT_PUBLIC_BASE_URL || "https://cinephiles-watch-react-js.onrender.com",
    potentialAction: {
      "@type": "SearchAction",
      target:
        `${process.env.NEXT_PUBLIC_BASE_URL || "https://cinephiles-watch-react-js.onrender.com"}/search?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <div className="animate-in">
      {/* SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <HeroBanner movie={fullHeroMovie} trailerKey={heroTrailerKey} />

      <div className="container" style={{ paddingBottom: "100px", marginTop: "-40px", position: "relative", zIndex: 10 }}>
        {/* REGION SWITCHER */}
        <div className="region-switcher-container">
          <RegionSwitcher />
        </div>

        {/* RELEASING TODAY */}
        {releasingToday.length > 0 && (
          <Row
            title="Releasing Today"
            movies={releasingToday}
          />
        )}

        <Row title="Trending Now" movies={trending} />
        
        <Row title="Top Rated Movies" movies={topRated} />

        {/* COMING THIS WEEK */}
        {comingThisWeek.length > 0 && (
          <Row
            title={`Theatrical Releases: This Week`}
            movies={comingThisWeek}
          />
        )}

        {/* COMING THIS MONTH */}
        {comingThisMonth.length > 0 && (
          <Row
            title={`Theatrical Releases: This Month`}
            movies={comingThisMonth}
          />
        )}

        {/* OTT THIS MONTH */}
        {ottThisMonth.length > 0 && (
          <Row
            movies={ottThisMonth}
          />
        )}

        {/* TRAKT SECTION */}
        <div style={{ marginTop: "4rem", paddingTop: "4rem", borderTop: "1px solid var(--color-border)" }}>
          <TraktRow
            title="Trakt Live Trending"
            subtitle="Movies being watched right now"
            items={traktTrending}
            showWatchers={true}
          />

          <TraktRow
            title="Most Anticipated"
            subtitle="Community hype leaderboard"
            items={anticipated}
            showWatchers={false}
          />

          <TraktRow
            title="US Box Office"
            subtitle="Top theatrical performers this weekend"
            items={boxOffice}
            showWatchers={false}
          />
        </div>
      </div>
    </div>
  );
}
