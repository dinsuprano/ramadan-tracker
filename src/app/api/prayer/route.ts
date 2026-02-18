import { NextRequest, NextResponse } from "next/server";
import { fetchPrayerTimes } from "@/lib/prayer";

export async function GET(req: NextRequest) {
  const zone = req.nextUrl.searchParams.get("zone") || "SGR01";
  const data = await fetchPrayerTimes(zone);
  if (!data) {
    return NextResponse.json(
      { error: "Failed to fetch prayer times" },
      { status: 502 }
    );
  }
  return NextResponse.json(data);
}
