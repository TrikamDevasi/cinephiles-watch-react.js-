"use client";
import Image from "next/image";
import Link from "next/link"; // Better for navigation than window.location

export default function HeroBanner({ movie }) {
  if (!movie) return null;

  return (
    <div className="relative h-[80vh] w-full flex items-end p-10">
      {/* 
        OPTIMIZED BACKGROUND IMAGE 
        'priority' = Load ASAP (Fixes LCP Score)
        'quality={90}' = Looks crisp
      */}
      <Image
        src={`https://image.tmdb.org/t/p/original${movie.backdrop_path}`}
        alt={movie.title}
        fill
        priority
        className="object-cover -z-10"
        sizes="100vw"
      />

      {/* Dark Overlay Gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/40 to-[#0a0a0a]" />

      <div className="relative z-10 max-w-2xl text-white">
        <h1 className="text-5xl md:text-6xl font-bold drop-shadow-lg">
          {movie.title}
        </h1>

        <p className="mt-4 text-lg text-gray-200 line-clamp-3 max-w-xl drop-shadow-md">
          {movie.overview}
        </p>

        <Link
          href={`/movie/${movie.id}`}
          className="mt-6 inline-flex items-center gap-2 bg-white text-black px-6 py-3 rounded-lg font-bold hover:bg-gray-200 transition"
        >
          ▶ Watch Now
        </Link>
      </div>
    </div>
  );
}
