export function formatMatchDate(iso: string) {
  const d = new Date(iso);
  return new Intl.DateTimeFormat("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(d);
}

export function formatMatchTime(iso: string) {
  const d = new Date(iso);
  return new Intl.DateTimeFormat("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(d);
}

// How a match is titled depending on its type. A friendly reads
// "CrossNation vs <club>"; an internal match day just shows the label
// the admin gave the two teams (e.g. "Whites vs Blacks").
export function matchTitle(m: { match_type: string; opponent: string }) {
  return m.match_type === "friendly"
    ? `CrossNation vs ${m.opponent}`
    : m.opponent;
}

export function matchTypeLabel(matchType: string) {
  return matchType === "friendly" ? "Friendly" : "Internal";
}

export function formatDateInput(iso: string) {
  // yyyy-MM-ddThh:mm, for pre-filling <input type="datetime-local">
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(
    d.getHours()
  )}:${pad(d.getMinutes())}`;
}
