import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const body = await request.json();

    return NextResponse.json({
      success: true,
      message: "Analysis completed",
      input: body,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Invalid JSON" },
      { status: 400 }
    );
  }
}
