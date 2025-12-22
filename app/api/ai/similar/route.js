import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const body = await request.json();

    return NextResponse.json({
      success: true,
      similar: ["Placeholder similar movie 1", "Placeholder 2"],
      input: body,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Invalid JSON" },
      { status: 400 }
    );
  }
}
