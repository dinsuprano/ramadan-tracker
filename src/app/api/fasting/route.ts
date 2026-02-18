import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getDb } from "@/lib/db";

// GET  /api/fasting?year=2026&month=2  → returns all logs for that Ramadan
// POST /api/fasting  { date, isFasting } → upsert a single day
export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const url = new URL(req.url);
  const startDate = url.searchParams.get("start") || "2026-02-28";
  const endDate = url.searchParams.get("end") || "2026-03-29";

  const sql = getDb();
  const userId = session.user.id;
  const rows = await sql`SELECT date, is_fasting FROM fasting_logs
     WHERE user_id = ${userId} AND date >= ${startDate} AND date <= ${endDate}
     ORDER BY date`;

  return NextResponse.json({ logs: rows });
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { date, isFasting } = await req.json();
  if (!date) {
    return NextResponse.json({ error: "date is required" }, { status: 400 });
  }

  const sql = getDb();
  const userId = session.user.id;
  const fasting = Boolean(isFasting);
  const rows = await sql`INSERT INTO fasting_logs (user_id, date, is_fasting)
     VALUES (${userId}, ${date}, ${fasting})
     ON CONFLICT (user_id, date)
     DO UPDATE SET is_fasting = ${fasting}, updated_at = now()
     RETURNING id, date, is_fasting`;

  return NextResponse.json({ log: rows[0] });
}
