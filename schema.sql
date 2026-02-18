-- Ramadan Tracker – Neon Postgres Schema
-- Run this in the Neon SQL Editor to bootstrap your database.

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name       VARCHAR(100)  NOT NULL,
  email      VARCHAR(255)  NOT NULL UNIQUE,
  password   VARCHAR(255)  NOT NULL,        -- bcrypt hash
  zone       VARCHAR(10)   NOT NULL DEFAULT 'SGR01',  -- JAKIM zone
  created_at TIMESTAMPTZ   NOT NULL DEFAULT now()
);

-- Fasting log – one row per user per day
CREATE TABLE IF NOT EXISTS fasting_logs (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    UUID          NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  date       DATE          NOT NULL,         -- e.g. '2026-02-28'
  is_fasting BOOLEAN       NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ   NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ   NOT NULL DEFAULT now(),
  UNIQUE(user_id, date)
);

-- Index for fast lookups
CREATE INDEX IF NOT EXISTS idx_fasting_logs_user_date ON fasting_logs(user_id, date);
