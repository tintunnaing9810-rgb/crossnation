// The club's Garuda badge system — the single source of truth used by
// the About page, the public squad, and the admin badge picker.

export const PLAYER_BADGES = [
  {
    key: "royal_garuda",
    name: "Royal Garuda",
    honors: "The King",
    body: "The crown of the crest — carried by whoever leads the club on the day.",
  },
  {
    key: "garuda_ascendants",
    name: "Garuda Ascendants",
    honors: "The Enthusiast",
    body: "For the players who show up twice a week, rain or shine, and lift everyone with them.",
  },
  {
    key: "garuda_shields",
    name: "Garuda Shields",
    honors: "The Fierce Walls",
    body: "The defenders and the keeper — the back line that turns a close game our way.",
  },
  {
    key: "garuda_spirit",
    name: "Garuda Spirit",
    honors: "The Rising Commander",
    body: "For the player driving the team forward, setting the tempo from the middle.",
  },
] as const;

export type PlayerBadge = (typeof PLAYER_BADGES)[number]["key"];

export function badgeMeta(key: string | null | undefined) {
  if (!key) return null;
  return PLAYER_BADGES.find((b) => b.key === key) ?? null;
}
