import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getDb } from "@/lib/db";

// GET  /api/fasting?start=...&end=...  → returns dates that are fasted
// POST /api/fasting  { date }           → mark a date as fasted (insert)
// DELETE /api/fasting?date=...          → unmark a date (delete row)

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const url = new URL(req.url);
  const startDate = url.searchParams.get("start") || "2026-02-19";
  const endDate = url.searchParams.get("end") || "2026-03-20";

  const sql = getDb();
  const userId = session.user.id;
  const rows = await sql`SELECT date::text as date FROM fasting_logs
     WHERE user_id = ${userId} AND date >= ${startDate} AND date <= ${endDate}
     ORDER BY date`;

  // date::text returns "2026-02-19" directly, no timezone shift
  const dates = rows.map((r: Record<string, unknown>) => String(r.date));

  return NextResponse.json({ dates });
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { date } = await req.json();
  if (!date) {
    return NextResponse.json({ error: "date is required" }, { status: 400 });
  }

  const sql = getDb();
  const userId = session.user.id;
  await sql`INSERT INTO fasting_logs (user_id, date, is_fasting)
     VALUES (${userId}, ${date}, true)
     ON CONFLICT (user_id, date) DO NOTHING`;

  return NextResponse.json({ ok: true, date });
}

export async function DELETE(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const url = new URL(req.url);
  const date = url.searchParams.get("date");
  if (!date) {
    return NextResponse.json({ error: "date is required" }, { status: 400 });
  }

  const sql = getDb();
  const userId = session.user.id;
  await sql`DELETE FROM fasting_logs
     WHERE user_id = ${userId} AND date = ${date}`;

  return NextResponse.json({ ok: true, date });
}
