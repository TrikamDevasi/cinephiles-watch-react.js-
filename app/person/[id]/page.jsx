import Image from "next/image";
import Link from "next/link";

/* =======================
   METADATA
======================= */
export async function generateMetadata({ params }) {
  const { id } = params;
  const API_KEY = process.env.TMDB_API_KEY;

  try {
    const res = await fetch(
      `https://api.themoviedb.org/3/person/${id}?api_key=${API_KEY}`,
      { cache: "no-store" }
    );

    if (!res.ok) throw new Error("Failed");

    const person = await res.json();

    return {
      title: `${person.name} | Cinephiles Watch`,
      description:
        person.biography?.slice(0, 160) ||
        `Filmography and details of ${person.name}`,
    };
  } catch {
    return { title: "Person | Cinephiles Watch" };
  }
}

export default async function PersonPage({ params }) {
  const { id } = params;
  const API_KEY = process.env.TMDB_API_KEY;
  const BASE_URL = "https://api.themoviedb.org/3";

  try {
    const [personRes, creditsRes] = await Promise.all([
      fetch(`${BASE_URL}/person/${id}?api_key=${API_KEY}`, { cache: "no-store" }),
      fetch(`${BASE_URL}/person/${id}/movie_credits?api_key=${API_KEY}`, {
        cache: "no-store",
      }),
    ]);

    const person = await personRes.json();
    const credits = await creditsRes.json();

    if (!person || person.success === false) {
      throw new Error("Invalid person data");
    }

    const knownFor = (credits.cast || [])
      .sort((a, b) => b.popularity - a.popularity)
      .slice(0, 10);

    const filmography = (credits.cast || []).sort(
      (a, b) => (b.release_date || "").localeCompare(a.release_date || "")
    );

    const avatarFallback = `https://ui-avatars.com/api/?name=${encodeURIComponent(
      person.name
    )}&background=1f2937&color=fff&size=342`;

    return (
      <section style={{ maxWidth: 1200, margin: "0 auto", padding: "32px 16px" }}>
        {/* HEADER */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "200px 1fr",
            gap: 32,
          }}
        >
          {/* PROFILE IMAGE */}
          <Image
            src={
              person.profile_path
                ? `https://image.tmdb.org/t/p/w342${person.profile_path}`
                : avatarFallback
            }
            alt={person.name}
            width={200}
            height={300}
            style={{ borderRadius: 12 }}
          />

          {/* INFO */}
          <div>
            <h1 style={{ fontSize: "2rem", marginBottom: 8 }}>
              {person.name}
            </h1>

            <div style={{ opacity: 0.7, marginBottom: 16 }}>
              {person.birthday && <div>Born: {person.birthday}</div>}
              {person.place_of_birth && (
                <div>Place: {person.place_of_birth}</div>
              )}
            </div>

            <p style={{ lineHeight: 1.6, maxWidth: 700 }}>
              {person.biography || "Biography not available."}
            </p>
          </div>
        </div>

        {/* KNOWN FOR */}
        {knownFor.length > 0 && (
          <div style={{ marginTop: 48 }}>
            <h2>Known For</h2>
            <div style={{ display: "flex", gap: 12, overflowX: "auto" }}>
              {knownFor.map((m) => (
                <Link key={m.id} href={`/movie/${m.id}`}>
                  <img
                    src={
                      m.poster_path
                        ? `https://image.tmdb.org/t/p/w185${m.poster_path}`
                        : "https://via.placeholder.com/185x278?text=No+Poster"
                    }
                    alt={m.title}
                    loading="lazy"
                    style={{ borderRadius: 8 }}
                  />
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* FILMOGRAPHY */}
        {filmography.length > 0 && (
          <div style={{ marginTop: 48 }}>
            <h2>Filmography</h2>
            <ul style={{ lineHeight: 1.8, opacity: 0.85 }}>
              {filmography.map((m) => (
                <li key={m.id}>
                  <Link href={`/movie/${m.id}`}>
                    {m.title}
                  </Link>
                  {m.release_date
                    ? ` (${m.release_date.slice(0, 4)})`
                    : ""}
                </li>
              ))}
            </ul>
          </div>
        )}
      </section>
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
        <h1>Person details unavailable</h1>
      </div>
    );
  }
}
