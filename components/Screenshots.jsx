export default function Screenshots({ images = [] }) {
  return (
    <div style={{ padding: "40px" }}>
      <h2>Screenshots</h2>

      <div
        style={{
          marginTop: "20px",
          display: "flex",
          overflowX: "auto",
          gap: "15px",
        }}
      >
        {images.slice(0, 10).map((img, i) => (
          <img
            key={i}
            src={`https://image.tmdb.org/t/p/w780${img.file_path}`}
            style={{
              width: "350px",
              borderRadius: "10px",
              flexShrink: 0,
            }}
          />
        ))}
      </div>
    </div>
  );
}
