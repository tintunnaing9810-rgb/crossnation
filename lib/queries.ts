import { createClient } from "@/lib/supabase/server";
import type {
  Match,
  PlayerTotals,
  SquadEntryWithPlayer,
  StatsEntryWithPlayer,
  StatsEntryWithMatch,
} from "@/lib/types";

export async function getUpcomingMatch() {
  const supabase = await createClient();
  const { data: match } = await supabase
    .from("matches")
    .select("*")
    .eq("status", "upcoming")
    .order("match_date", { ascending: true })
    .limit(1)
    .maybeSingle();

  if (!match) return null;

  const { data: squad } = await supabase
    .from("match_squad")
    .select("*, players(*)")
    .eq("match_id", match.id)
    .eq("selected", true);

  return { match: match as Match, squad: (squad ?? []) as SquadEntryWithPlayer[] };
}

export async function getLatestResult() {
  const supabase = await createClient();
  const { data: match } = await supabase
    .from("matches")
    .select("*")
    .eq("status", "completed")
    .order("match_date", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (!match) return null;

  const { data: stats } = await supabase
    .from("match_stats")
    .select("*, players(*)")
    .eq("match_id", match.id);

  return { match: match as Match, stats: (stats ?? []) as StatsEntryWithPlayer[] };
}

export async function getResults() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("matches")
    .select("*")
    .eq("status", "completed")
    .order("match_date", { ascending: false });

  return (data ?? []) as Match[];
}

export async function getMatchDetail(matchId: string) {
  const supabase = await createClient();
  const { data: match } = await supabase
    .from("matches")
    .select("*")
    .eq("id", matchId)
    .maybeSingle();

  if (!match) return null;

  const { data: stats } = await supabase
    .from("match_stats")
    .select("*, players(*)")
    .eq("match_id", matchId);

  const { data: squad } = await supabase
    .from("match_squad")
    .select("*, players(*)")
    .eq("match_id", matchId);

  return {
    match: match as Match,
    stats: (stats ?? []) as StatsEntryWithPlayer[],
    squad: (squad ?? []) as SquadEntryWithPlayer[],
  };
}

export async function getPlayerTotalsList() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("player_totals")
    .select("*")
    .order("goals", { ascending: false });

  return (data ?? []) as PlayerTotals[];
}

export async function getPlayerTotals(playerId: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("player_totals")
    .select("*")
    .eq("player_id", playerId)
    .maybeSingle();

  return data as PlayerTotals | null;
}

export async function getPlayerMatchHistory(playerId: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("match_stats")
    .select("*, matches(*)")
    .eq("player_id", playerId);

  const rows = (data ?? []) as StatsEntryWithMatch[];

  // match_stats -> matches is many-to-one, so Supabase can't sort
  // these parent rows by the related match's date on the server —
  // it only reorders nested arrays, not the top-level rows. Sort
  // here instead; this list is small (one club's matches).
  return rows.sort((a, b) => {
    const dateA = a.matches?.match_date ?? "";
    const dateB = b.matches?.match_date ?? "";
    return dateB.localeCompare(dateA);
  });
}

// Players available to be picked for a match — everyone except those
// marked inactive (regular + irregular).
export async function getSelectablePlayers() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("players")
    .select("*")
    .neq("status", "inactive")
    .order("name", { ascending: true });

  return data ?? [];
}
