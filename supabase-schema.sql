-- Refresher Pub Quiz — Supabase schema
-- Run this in the Supabase SQL Editor

CREATE TABLE quizzes (
  id            TEXT PRIMARY KEY,
  name          TEXT NOT NULL DEFAULT '',
  round_count   INTEGER NOT NULL DEFAULT 5,
  teams         JSONB NOT NULL DEFAULT '[]',
  scores        JSONB NOT NULL DEFAULT '{}',
  current_round INTEGER NOT NULL DEFAULT 1,
  display       JSONB NOT NULL DEFAULT '{"visible":false,"revealMode":false,"revealedPosition":0}',
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable Realtime on the quizzes table
ALTER PUBLICATION supabase_realtime ADD TABLE quizzes;

-- Index for history listing (newest first)
CREATE INDEX idx_quizzes_created_at ON quizzes (created_at DESC);

-- Open RLS — no auth needed for a pub quiz
ALTER TABLE quizzes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all access" ON quizzes FOR ALL USING (true) WITH CHECK (true);
