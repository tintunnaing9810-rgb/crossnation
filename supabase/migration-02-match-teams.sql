-- ============================================================
-- CrossNation — Migration 02
-- Adds the two-team split to the match squad, so internal match days
-- can record which side (Team A / Team B) each player was on. This is
-- what the points system uses to work out each player's win/draw/loss.
--
-- Run ONCE in the Supabase SQL Editor, after migration-01. Safe to re-run.
-- ============================================================

alter table match_squad
  add column if not exists team text
  check (team in ('a', 'b'));
