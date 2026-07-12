// A player is treated as a goalkeeper (clean sheets apply to them) when
// their position mentions GK / goal / keeper. Shared by the squad list
// and the result-entry form so the two stay in sync.
export function isGoalkeeper(position: string | null | undefined) {
  return /gk|goal|keeper/i.test(position ?? "");
}
