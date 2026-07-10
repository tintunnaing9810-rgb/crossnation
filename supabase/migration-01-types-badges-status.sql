-- ============================================================
-- CrossNation — Migration 01
-- Adds: match types, player badges, and the regular/irregular/inactive
-- player status (replacing the old active boolean).
--
-- Run this ONCE in the Supabase SQL Editor, on a project that already
-- has the original schema.sql applied. It is safe to re-run.
-- ============================================================

-- 1) MATCH TYPE — internal two-team match day, or a friendly vs a club.
alter table matches
  add column if not exists match_type text not null default 'internal'
  check (match_type in ('internal', 'friendly'));

-- 4) PLAYER BADGE — one of the four Garuda badges, or none.
alter table players
  add column if not exists badge text
  check (badge in ('royal_garuda', 'garuda_ascendants', 'garuda_shields', 'garuda_spirit'));

-- 5) PLAYER STATUS — regular / irregular / inactive.
alter table players
  add column if not exists status text not null default 'regular'
  check (status in ('regular', 'irregular', 'inactive'));

-- Carry the old `active` flag into the new status the first time this runs
-- (anyone previously marked inactive stays inactive).
update players
  set status = 'inactive'
  where status = 'regular'
    and exists (
      select 1 from information_schema.columns
      where table_name = 'players' and column_name = 'active'
    )
    and active = false;

-- Rebuild the totals view to expose status + badge and drop the old
-- active column. (A view's existing columns can't be removed with
-- CREATE OR REPLACE, so we drop and recreate it.)
drop view if exists player_totals;
create view player_totals as
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
  coalesce(sum(case when ms.motm then 1 else 0 end), 0) as motm_count
from players p
left join match_stats ms on ms.player_id = p.id
left join matches m on m.id = ms.match_id and m.status = 'completed'
group by p.id, p.name, p.position, p.jersey_number, p.photo_url, p.status, p.badge;

grant select on player_totals to anon, authenticated;

-- Finally drop the now-unused active column (safe: nothing references it).
alter table players drop column if exists active;
