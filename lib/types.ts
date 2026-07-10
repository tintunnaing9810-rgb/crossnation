export type Player = {
  id: string;
  name: string;
  position: string | null;
  jersey_number: number | null;
  photo_url: string | null;
  bio: string | null;
  active: boolean;
  created_at: string;
};

export type MatchStatus = "upcoming" | "completed" | "cancelled";
export type HomeAway = "home" | "away" | "neutral";

export type Match = {
  id: string;
  opponent: string;
  match_date: string;
  venue: string | null;
  home_away: HomeAway;
  status: MatchStatus;
  home_score: number | null;
  away_score: number | null;
  notes: string | null;
  created_at: string;
};

export type MatchSquadEntry = {
  match_id: string;
  player_id: string;
  selected: boolean;
  started: boolean;
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
  active: boolean;
  appearances: number;
  goals: number;
  assists: number;
  yellow_cards: number;
  red_cards: number;
  clean_sheets: number;
  motm_count: number;
};
