import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { getDb } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const { name, email, password, zone } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Name, email, and password are required." },
        { status: 400 }
      );
    }

    const sql = getDb();

    // Check if user already exists
    const existing = await sql`SELECT id FROM users WHERE email = ${email}`;
    if (existing.length > 0) {
      return NextResponse.json(
        { error: "Email already registered." },
        { status: 409 }
      );
    }

    const hash = await bcrypt.hash(password, 12);
    const userZone = zone || "SGR01";
    const rows = await sql`INSERT INTO users (name, email, password, zone)
       VALUES (${name}, ${email}, ${hash}, ${userZone})
       RETURNING id, name, email, zone`;

    return NextResponse.json({ user: rows[0] }, { status: 201 });
  } catch (err) {
    console.error("Registration error:", err);
    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 }
    );
  }
}
