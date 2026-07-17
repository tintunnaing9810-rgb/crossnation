import { createClient } from "@/lib/supabase/server";
import { playerResult, pointsFor, performanceScore } from "@/lib/points";
import type {
  Match,
  PlayerTotals,
  SquadEntryWithPlayer,
  StatsEntryWithPlayer,
  StatsEntryWithMatch,
  SquadRankingEntry,
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

// Players ranked by total points. Points come from appearances + each
// match's win/draw/loss, computed here (not in the DB) so the scoring
// weights in lib/points.ts are easy to tweak. Inactive players are kept
// but sorted to the bottom.
export async function getSquadRanking(): Promise<SquadRankingEntry[]> {
  const supabase = await createClient();

  const [{ data: totals }, { data: matches }, { data: squad }] =
    await Promise.all([
      supabase.from("player_totals").select("*"),
      supabase
        .from("matches")
        .select("id, match_type, home_score, away_score")
        .eq("status", "completed"),
      supabase
        .from("match_squad")
        .select("player_id, match_id, team")
        .eq("selected", true),
    ]);

  const matchById = new Map((matches ?? []).map((m) => [m.id, m]));

  // Tally appearances + W/D/L per player across completed matches.
  const tally = new Map<
    string,
    { apps: number; wins: number; draws: number; losses: number }
  >();
  for (const row of squad ?? []) {
    const match = matchById.get(row.match_id);
    if (!match) continue; // not a completed match
    const t =
      tally.get(row.player_id) ?? { apps: 0, wins: 0, draws: 0, losses: 0 };
    t.apps += 1;
    const result = playerResult(match as Match, row.team);
    if (result === "win") t.wins += 1;
    else if (result === "draw") t.draws += 1;
    else if (result === "loss") t.losses += 1;
    tally.set(row.player_id, t);
  }

  const ranked: SquadRankingEntry[] = ((totals ?? []) as PlayerTotals[]).map(
    (p) => {
      const t =
        tally.get(p.player_id) ?? { apps: 0, wins: 0, draws: 0, losses: 0 };
      return {
        ...p,
        appearances: t.apps,
        wins: t.wins,
        draws: t.draws,
        losses: t.losses,
        points: pointsFor(t.apps, t.wins, t.draws, t.losses),
        score: performanceScore(p),
      };
    }
  );

  // Rank by the performance score (goals/assists/MOTM/clean sheets),
  // tie-broken by the appearance+W/L points. Inactive players stay last.
  ranked.sort((a, b) => {
    const ra = a.status === "inactive" ? 1 : 0;
    const rb = b.status === "inactive" ? 1 : 0;
    if (ra !== rb) return ra - rb;
    if (b.score !== a.score) return b.score - a.score;
    if (b.points !== a.points) return b.points - a.points;
    return a.name.localeCompare(b.name);
  });

  return ranked;
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
