import axios from "axios";
import Row from "@/components/Row";
import HeroBanner from "@/components/HeroBanner";

export default async function HomePage() {
  const API_KEY = process.env.TMDB_API_KEY;
  const BASE_URL = "https://api.themoviedb.org/3";

  async function get(category) {
    try {
      const res = await axios.get(`${BASE_URL}${category}`, {
        params: { api_key: API_KEY },
      });
      return res.data.results || [];
    } catch (e) {
      return [];
    }
  }

  const [trending, topRated, upcoming] = await Promise.all([
    get("/trending/movie/week"),
    get("/movie/top_rated"),
    get("/movie/upcoming"),
  ]);

  // Pick a random trending movie for hero
  const heroMovie = trending[Math.floor(Math.random() * trending.length)];

  return (
    <div style={{ color: "white", paddingBottom: "60px" }}>
      <HeroBanner movie={heroMovie} />

      <Row title="🔥 Trending Now" movies={trending} />
      <Row title="⭐ Top Rated" movies={topRated} />
      <Row title="🎬 Upcoming Releases" movies={upcoming} />
    </div>
  );
}
