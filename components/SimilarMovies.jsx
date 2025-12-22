import MovieCard from "./MovieCard";

export default function SimilarMovies({ movies = [] }) {
  return (
    <div style={{ padding: "40px" }}>
      <h2>Similar Movies</h2>

      <div
        style={{
          marginTop: "20px",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))",
          gap: "20px",
        }}
      >
        {movies.slice(0, 12).map((m) => (
          <MovieCard key={m.id} movie={m} />
        ))}
      </div>
    </div>
  );
}
