-- CrossNation Futsal Club — database schema
-- Run this in the Supabase SQL Editor (Project -> SQL Editor -> New query) once,
-- against a fresh Supabase project.

create extension if not exists "pgcrypto";

-- ============================================================
-- PLAYERS  (permanent club roster — added once, edited rarely)
-- ============================================================
create table if not exists players (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  position text,                 -- e.g. Goalkeeper, Defender, Winger, Pivot
  jersey_number int,
  photo_url text,
  bio text,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

-- ============================================================
-- MATCHES  (one row per fixture, upcoming or completed)
-- ============================================================
create table if not exists matches (
  id uuid primary key default gen_random_uuid(),
  opponent text not null,
  match_date timestamptz not null,
  venue text,
  home_away text not null default 'home' check (home_away in ('home','away','neutral')),
  status text not null default 'upcoming' check (status in ('upcoming','completed','cancelled')),
  home_score int,
  away_score int,
  notes text,
  created_at timestamptz not null default now()
);

-- ============================================================
-- MATCH SQUAD  (pre-match: who is selected for THIS match)
-- Separate from `players` on purpose — this changes every week,
-- the roster doesn't.
-- ============================================================
create table if not exists match_squad (
  match_id uuid not null references matches(id) on delete cascade,
  player_id uuid not null references players(id) on delete cascade,
  selected boolean not null default true,
  started boolean not null default false,
  primary key (match_id, player_id)
);

-- ============================================================
-- MATCH STATS  (post-match: the single source of truth for
-- everything shown on a player's profile — never edit player
-- totals directly, they are always computed from this table)
-- ============================================================
create table if not exists match_stats (
  match_id uuid not null references matches(id) on delete cascade,
  player_id uuid not null references players(id) on delete cascade,
  goals int not null default 0,
  assists int not null default 0,
  yellow_cards int not null default 0,
  red_cards int not null default 0,
  clean_sheet boolean not null default false,
  motm boolean not null default false,
  primary key (match_id, player_id)
);

-- ============================================================
-- VIEW: computed career totals per player.
-- The public site and player-profile pages read from this view
-- only — nobody, including the admin, ever hand-edits a total.
-- ============================================================
create or replace view player_totals as
select
  p.id as player_id,
  p.name,
  p.position,
  p.jersey_number,
  p.photo_url,
  p.active,
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
group by p.id, p.name, p.position, p.jersey_number, p.photo_url, p.active;

-- ============================================================
-- JOIN REQUESTS  (public "interested in joining" form submissions —
-- public can SUBMIT but not read others' entries; only the admin
-- can read the list.)
-- ============================================================
create table if not exists join_requests (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  contact text not null,
  message text,
  created_at timestamptz not null default now()
);

-- ============================================================
-- ROW LEVEL SECURITY
-- Anyone (anon, public link) can READ everything.
-- Only a signed-in Supabase Auth user (you) can WRITE anything.
-- This is enforced by Postgres itself, not by the app's UI —
-- so it holds even if someone bypasses the admin pages entirely.
-- ============================================================
alter table players enable row level security;
alter table matches enable row level security;
alter table match_squad enable row level security;
alter table match_stats enable row level security;

create policy "public_read_players" on players for select using (true);
create policy "public_read_matches" on matches for select using (true);
create policy "public_read_match_squad" on match_squad for select using (true);
create policy "public_read_match_stats" on match_stats for select using (true);

create policy "auth_write_players" on players for all
  using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "auth_write_matches" on matches for all
  using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "auth_write_match_squad" on match_squad for all
  using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "auth_write_match_stats" on match_stats for all
  using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

-- join_requests: anyone can submit, only the signed-in admin can read/delete.
alter table join_requests enable row level security;

create policy "public_insert_join_requests" on join_requests for insert
  with check (true);
create policy "auth_read_join_requests" on join_requests for select
  using (auth.role() = 'authenticated');
create policy "auth_delete_join_requests" on join_requests for delete
  using (auth.role() = 'authenticated');

-- ============================================================
-- PRIVILEGES
-- RLS policies above are the real gate; these grants just make
-- sure the anon/authenticated roles are allowed to attempt the
-- query at all (Supabase sets this up by default for new tables,
-- but the view is added explicitly here to be safe).
-- ============================================================
grant usage on schema public to anon, authenticated;

grant select on players, matches, match_squad, match_stats, player_totals
  to anon, authenticated;

grant insert on join_requests to anon, authenticated;
grant select, delete on join_requests to authenticated;

grant insert, update, delete on players, matches, match_squad, match_stats
  to authenticated;
