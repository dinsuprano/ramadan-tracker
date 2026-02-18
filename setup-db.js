const { neon } = require("@neondatabase/serverless");
require("dotenv").config();

const sql = neon(process.env.DATABASE_URL);

async function run() {
  await sql.query("CREATE EXTENSION IF NOT EXISTS pgcrypto");
  console.log("1/4 pgcrypto extension ✓");

  await sql.query(`CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    zone VARCHAR(10) NOT NULL DEFAULT 'SGR01',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
  )`);
  console.log("2/4 users table ✓");

  await sql.query(`CREATE TABLE IF NOT EXISTS fasting_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    is_fasting BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE(user_id, date)
  )`);
  console.log("3/4 fasting_logs table ✓");

  await sql.query(
    "CREATE INDEX IF NOT EXISTS idx_fasting_logs_user_date ON fasting_logs(user_id, date)"
  );
  console.log("4/4 index ✓");

  console.log("\n✅ All tables created successfully!");
}

run().catch((e) => console.error("❌ Error:", e.message));
