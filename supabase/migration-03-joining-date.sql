-- ============================================================
-- CrossNation — Migration 03
-- Adds a joining date to players, sets every existing player to
-- 2026-07-01, and exposes it on the player_totals view.
--
-- Run in the Supabase SQL Editor, after migration-02. Safe to re-run —
-- re-running resets all join dates to 1 July 2026.
-- ============================================================

alter table players add column if not exists joined_at date;

-- Set everyone currently on the roster to 1 July 2026.
update players set joined_at = '2026-07-01';

-- Re-expose the view with joined_at appended (create-or-replace keeps the
-- existing columns/grants; the new column is added at the end).
create or replace view player_totals as
select
  p.id as player_id,
  p.name,
  p.position,
  p.jersey_number,
  p.photo_url,
  p.status,
  p.badge,
  count(ms.match_id) as appearances,
  coalesce(sum(ms.goals), 0) as goals,
  coalesce(sum(ms.assists), 0) as assists,
  coalesce(sum(ms.yellow_cards), 0) as yellow_cards,
  coalesce(sum(ms.red_cards), 0) as red_cards,
  coalesce(sum(case when ms.clean_sheet then 1 else 0 end), 0) as clean_sheets,
  coalesce(sum(case when ms.motm then 1 else 0 end), 0) as motm_count,
  p.joined_at
from players p
left join match_stats ms on ms.player_id = p.id
left join matches m on m.id = ms.match_id and m.status = 'completed'
group by p.id, p.name, p.position, p.jersey_number, p.photo_url, p.status, p.badge, p.joined_at;
