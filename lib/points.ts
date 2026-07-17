import type { Match } from "@/lib/types";

// CrossNation points system. Appearance is valued as highly as a win —
// showing up is what counts. Change these numbers to re-weight the table.
export const POINTS = {
  appearance: 2,
  win: 2,
  draw: 1,
  loss: 0,
} as const;

export type MatchResult = "win" | "draw" | "loss" | "none";

// Work out whether a player won, drew or lost a completed match.
// Scores are always stored as home_score = CrossNation / Team A, and
// away_score = opponent / Team B (that's how the result form captures
// them), so we don't flip anything by home/away here.
export function playerResult(
  match: Pick<Match, "match_type" | "home_score" | "away_score">,
  team: string | null
): MatchResult {
  const home = match.home_score;
  const away = match.away_score;
  if (home == null || away == null) return "none";

  let mine: number;
  let theirs: number;
  if (match.match_type === "friendly") {
    mine = home; // CrossNation
    theirs = away; // opponent
  } else if (team === "a") {
    mine = home; // Team A
    theirs = away;
  } else if (team === "b") {
    mine = away; // Team B
    theirs = home;
  } else {
    return "none"; // internal match with no team assigned
  }

  if (mine > theirs) return "win";
  if (mine < theirs) return "loss";
  return "draw";
}

export function pointsFor(
  apps: number,
  wins: number,
  draws: number,
  losses: number
) {
  return (
    apps * POINTS.appearance +
    wins * POINTS.win +
    draws * POINTS.draw +
    losses * POINTS.loss
  );
}

// A SEPARATE performance rating used to order the squad table. This is
// NOT added to the points above — it's an individual-contribution score.
export const PERFORMANCE_WEIGHTS = {
  goal: 1,
  assist: 0.5,
  motm: 2,
  cleanSheet: 1.5,
} as const;

export function performanceScore(t: {
  goals: number;
  assists: number;
  motm_count: number;
  clean_sheets: number;
}) {
  const raw =
    t.goals * PERFORMANCE_WEIGHTS.goal +
    t.assists * PERFORMANCE_WEIGHTS.assist +
    t.motm_count * PERFORMANCE_WEIGHTS.motm +
    t.clean_sheets * PERFORMANCE_WEIGHTS.cleanSheet;
  return Math.round(raw * 10) / 10; // avoid float noise, keep 1 dp
}
