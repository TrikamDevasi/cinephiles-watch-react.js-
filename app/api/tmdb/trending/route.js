import { NextResponse } from "next/server";

export async function GET() {
  try {
    const apiKey = process.env.TMDB_API_KEY;
    const url = `https://api.themoviedb.org/3/trending/movie/week?api_key=${apiKey}`;

    const res = await fetch(url);
    const data = await res.json();

    return NextResponse.json({ success: true, data });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Server Error" },
      { status: 500 }
    );
  }
}
