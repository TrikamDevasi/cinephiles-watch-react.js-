import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(request, { params }) {
  const { id } = params;
  const { searchParams } = new URL(request.url);
  const region = searchParams.get("region") ?? "IN";

  const url = `https://api.themoviedb.org/3/movie/${id}/watch/providers?api_key=${process.env.TMDB_API_KEY}`;
  const res = await fetch(url, { next: { revalidate: 3600 } });
  
  if (!res.ok) {
    return NextResponse.json({ results: {} });
  }

  const data = await res.json();
  return NextResponse.json(data);
}
