import axios from "axios";
import Row from "@/components/Row";
import HeroBanner from "@/components/HeroBanner";

export default async function HomePage({ searchParams }) {
  const API_KEY = process.env.TMDB_API_KEY;
  const BASE_URL = "https://api.themoviedb.org/3";

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

  async function get(endpoint) {
    try {
      const res = await axios.get(`${BASE_URL}${endpoint}`, {
        params: { api_key: API_KEY },
      });
      return res.data.results || [];
    } catch {
      return [];
    }
  }

  /* =======================
     FETCH DATA
  ======================= */
  const [
    trending,
    topRated,
    comingThisWeek,
    comingThisMonth,
    ottThisMonth,
  ] = await Promise.all([
    get("/trending/movie/week"),
    get("/movie/top_rated"),

    // Theatrical – coming this week
    get(
      `/discover/movie?region=${region}&with_release_type=3&primary_release_date.gte=${formatDate(
        startOfWeek
      )}&primary_release_date.lte=${formatDate(
        endOfWeek
      )}&sort_by=primary_release_date.asc`
    ),

    // Theatrical – coming this month
    get(
      `/discover/movie?region=${region}&with_release_type=3&primary_release_date.gte=${formatDate(
        startOfMonth
      )}&primary_release_date.lte=${formatDate(
        endOfMonth
      )}&sort_by=primary_release_date.asc`
    ),

    // OTT releases this month
    get(
      `/discover/movie?with_release_type=4&primary_release_date.gte=${formatDate(
        startOfMonth
      )}&primary_release_date.lte=${formatDate(
        endOfMonth
      )}&sort_by=primary_release_date.desc`
    ),
  ]);

  /* =======================
     RELEASING TODAY
  ======================= */
  const releasingToday = comingThisWeek.filter(
    (m) => m.release_date === todayStr
  );

  const heroMovie =
    trending.length > 0
      ? trending[Math.floor(Math.random() * trending.length)]
      : null;

  /* =======================
     SEO STRUCTURED DATA
  ======================= */
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Cinephiles Watch",
    url: "https://cinephiles-watch-react-js.onrender.com",
    potentialAction: {
      "@type": "SearchAction",
      target:
        "https://cinephiles-watch-react-js.onrender.com/?q={search_term_string}",
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <>
      {/* SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <HeroBanner movie={heroMovie} />
      <div className="hero-gradient" />

      <div className="container" style={{ paddingBottom: "80px" }}>
        {/* REGION SWITCHER */}
        <div style={{ marginBottom: 24, opacity: 0.8 }}>
          Region:{" "}
          <a href="/?region=IN">India</a> |{" "}
          <a href="/?region=US">United States</a>
        </div>

        {/* RELEASING TODAY */}
        {releasingToday.length > 0 && (
          <div className="section">
            <Row
              title="Releasing Today"
              movies={releasingToday}
              badge="Today"
            />
          </div>
        )}

        <div className="section">
          <Row title="Trending Now" movies={trending} />
        </div>

        <div className="section">
          <Row title="Top Rated" movies={topRated} />
        </div>

        {/* COMING THIS WEEK */}
        {comingThisWeek.length > 0 ? (
          <div className="section">
            <Row
              title={`Coming This Week (${region})`}
              movies={comingThisWeek}
              badge="Theatrical"
            />
          </div>
        ) : (
          <p style={{ opacity: 0.6 }}>
            No theatrical releases scheduled this week.
          </p>
        )}

        {/* COMING THIS MONTH */}
        {comingThisMonth.length > 0 && (
          <div className="section">
            <Row
              title={`Coming This Month (${region})`}
              movies={comingThisMonth}
              badge="Theatrical"
            />
          </div>
        )}

        {/* OTT THIS MONTH */}
        {ottThisMonth.length > 0 && (
          <div className="section">
            <Row
              title="New on OTT (This Month)"
              movies={ottThisMonth}
              badge="OTT"
            />
          </div>
        )}
      </div>
    </>
  );
}
