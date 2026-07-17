import type { PlayerBadge } from "@/lib/badges";

// Regular = trains/plays most weeks, Irregular = occasional, Inactive =
// no longer playing (kept on the public squad, greyed out, for history).
export type PlayerStatus = "regular" | "irregular" | "inactive";

export const PLAYER_STATUSES: { value: PlayerStatus; label: string }[] = [
  { value: "regular", label: "Regular" },
  { value: "irregular", label: "Irregular" },
  { value: "inactive", label: "Inactive" },
];

export type Player = {
  id: string;
  name: string;
  position: string | null;
  jersey_number: number | null;
  photo_url: string | null;
  bio: string | null;
  status: PlayerStatus;
  badge: PlayerBadge | null;
  joined_at: string | null;
  created_at: string;
};

export type MatchStatus = "upcoming" | "completed" | "cancelled";
export type HomeAway = "home" | "away" | "neutral";

// Internal = a two-team CrossNation match day; Friendly = vs another club.
export type MatchType = "internal" | "friendly";

export type Match = {
  id: string;
  opponent: string;
  match_type: MatchType;
  match_date: string;
  venue: string | null;
  home_away: HomeAway;
  status: MatchStatus;
  home_score: number | null;
  away_score: number | null;
  notes: string | null;
  created_at: string;
};

export type MatchTeam = "a" | "b";

export type MatchSquadEntry = {
  match_id: string;
  player_id: string;
  selected: boolean;
  started: boolean;
  team: MatchTeam | null;
};

export type MatchStatsEntry = {
  match_id: string;
  player_id: string;
  goals: number;
  assists: number;
  yellow_cards: number;
  red_cards: number;
  clean_sheet: boolean;
  motm: boolean;
};

export type SquadEntryWithPlayer = MatchSquadEntry & { players: Player | null };
export type StatsEntryWithPlayer = MatchStatsEntry & { players: Player | null };
export type StatsEntryWithMatch = MatchStatsEntry & { matches: Match | null };

export type JoinRequest = {
  id: string;
  name: string;
  contact: string;
  message: string | null;
  created_at: string;
};

export type PlayerTotals = {
  player_id: string;
  name: string;
  position: string | null;
  jersey_number: number | null;
  photo_url: string | null;
  status: PlayerStatus;
  badge: PlayerBadge | null;
  appearances: number;
  goals: number;
  assists: number;
  yellow_cards: number;
  red_cards: number;
  clean_sheets: number;
  motm_count: number;
  joined_at: string | null;
};

// A player row for the points-ranked squad table: their totals plus the
// computed win/draw/loss record and total points.
export type SquadRankingEntry = PlayerTotals & {
  wins: number;
  draws: number;
  losses: number;
  points: number;
  // separate individual-contribution rating the squad table ranks by
  score: number;
};
