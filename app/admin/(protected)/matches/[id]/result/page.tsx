import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { recordResult } from "../../actions";
import { SectionHeading, EmptyState } from "@/components/ui";
import { BackButton } from "@/components/BackButton";
import { formatMatchDate, matchTitle } from "@/lib/format";
import { isGoalkeeper } from "@/lib/players";
import type { Match, SquadEntryWithPlayer } from "@/lib/types";

export default async function RecordResultPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: matchData } = await supabase
    .from("matches")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  const match = matchData as Match | null;
  if (!match) notFound();

  const isFriendly = match.match_type === "friendly";

  const { data: squadData } = await supabase
    .from("match_squad")
    .select("player_id, team, players(id, name, position)")
    .eq("match_id", id)
    .eq("selected", true);

  const squad = (squadData ?? []) as unknown as SquadEntryWithPlayer[];

  // For internal match days the squad was already split at selection
  // time — mirror that split here so the result is easy to fill in.
  const teamA = squad.filter((s) => s.team === "a");
  const teamB = squad.filter((s) => s.team === "b");
  const unassigned = squad.filter((s) => s.team !== "a" && s.team !== "b");

  // existing stats, if re-editing a result
  const { data: existingStats } = await supabase
    .from("match_stats")
    .select("*")
    .eq("match_id", id);
  const statsByPlayer = new Map(
    (existingStats ?? []).map((s) => [s.player_id, s])
  );
  const currentMotm = (existingStats ?? []).find((s) => s.motm)?.player_id ?? "";

  const recordResultWithId = recordResult.bind(null, id);

  const renderRows = (list: SquadEntryWithPlayer[]) => (
    <div className="bg-surface border border-line rounded-lg divide-y divide-line">
      {list.map((s: SquadEntryWithPlayer) => {
        const existing = statsByPlayer.get(s.player_id);
        const gk = isGoalkeeper(s.players?.position);
        return (
          <div key={s.player_id} className="px-4 py-3">
            <div className="font-display font-semibold">
              {s.players?.name}
              {s.players?.position && (
                <span className="text-xs text-muted ml-2 uppercase tracking-wide">
                  {s.players.position}
                </span>
              )}
            </div>
            <div className="flex flex-wrap items-end gap-4 mt-2">
              <label className="text-xs text-muted">
                <span className="block mb-1 uppercase tracking-wide">
                  Goals
                </span>
                <input
                  type="number"
                  min={0}
                  name={`goals_${s.player_id}`}
                  defaultValue={existing?.goals ?? 0}
                  className="w-20 bg-surface-2 border border-line rounded px-2 py-1.5 text-center text-paper"
                />
              </label>
              <label className="text-xs text-muted">
                <span className="block mb-1 uppercase tracking-wide">
                  Assists
                </span>
                <input
                  type="number"
                  min={0}
                  name={`assists_${s.player_id}`}
                  defaultValue={existing?.assists ?? 0}
                  className="w-20 bg-surface-2 border border-line rounded px-2 py-1.5 text-center text-paper"
                />
              </label>
              {gk && (
                <label className="flex items-center gap-2 text-sm pb-1.5">
                  <input
                    type="checkbox"
                    name={`clean_sheet_${s.player_id}`}
                    defaultChecked={existing?.clean_sheet ?? false}
                    className="w-5 h-5 accent-lime"
                  />
                  Clean sheet
                </label>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );

  return (
    <div className="max-w-2xl space-y-8">
      <BackButton />
      <SectionHeading
        eyebrow={`${formatMatchDate(match.match_date)} · ${
          isFriendly ? "Friendly" : "Internal match day"
        }`}
        title={`Result — ${matchTitle(match)}`}
      />

      {squad.length === 0 ? (
        <EmptyState>
          No squad was set for this match. Set the squad first, then come
          back to enter the result.
        </EmptyState>
      ) : (
        <form action={recordResultWithId} className="space-y-6">
          {/* SCORE — labelled differently for friendly vs internal */}
          <div className="bg-surface border border-line rounded-lg p-5">
            <p className="text-xs uppercase tracking-wide text-muted mb-3">
              {isFriendly ? "Final score" : "Match-day score — your two teams"}
            </p>
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <label className="block text-xs uppercase tracking-wide text-muted mb-1.5">
                  {isFriendly ? "CrossNation" : "Team A"}
                </label>
                <input
                  name="home_score"
                  type="number"
                  min={0}
                  defaultValue={match.home_score ?? 0}
                  required
                  className="w-full bg-surface-2 border border-line rounded px-3 py-2"
                />
              </div>
              <span className="font-display text-xl text-muted pt-5">–</span>
              <div className="flex-1">
                <label className="block text-xs uppercase tracking-wide text-muted mb-1.5">
                  {isFriendly ? match.opponent : "Team B"}
                </label>
                <input
                  name="away_score"
                  type="number"
                  min={0}
                  defaultValue={match.away_score ?? 0}
                  required
                  className="w-full bg-surface-2 border border-line rounded px-3 py-2"
                />
              </div>
            </div>
          </div>

          {/* PER-PLAYER STATS — grouped by team for internal match days */}
          {isFriendly ? (
            <div>
              <p className="text-xs uppercase tracking-wide text-muted mb-2">
                Player stats
              </p>
              {renderRows(squad)}
            </div>
          ) : (
            <div className="space-y-5">
              <div>
                <p className="text-xs uppercase tracking-wide text-lime mb-2">
                  Team A
                </p>
                {teamA.length > 0 ? (
                  renderRows(teamA)
                ) : (
                  <p className="text-sm text-muted">
                    No players assigned to Team A — set teams on the squad page.
                  </p>
                )}
              </div>
              <div>
                <p className="text-xs uppercase tracking-wide text-gold mb-2">
                  Team B
                </p>
                {teamB.length > 0 ? (
                  renderRows(teamB)
                ) : (
                  <p className="text-sm text-muted">
                    No players assigned to Team B — set teams on the squad page.
                  </p>
                )}
              </div>
              {unassigned.length > 0 && (
                <div>
                  <p className="text-xs uppercase tracking-wide text-muted mb-2">
                    No team set
                  </p>
                  {renderRows(unassigned)}
                </div>
              )}
            </div>
          )}

          {/* MAN OF THE MATCH — a single choice, not a per-row control */}
          <div className="bg-surface border border-line rounded-lg p-5">
            <label className="block text-xs uppercase tracking-wide text-muted mb-1.5">
              Man of the match
            </label>
            <select
              name="motm"
              defaultValue={currentMotm}
              className="w-full bg-surface-2 border border-line rounded px-3 py-2"
            >
              <option value="">— none —</option>
              {isFriendly ? (
                squad.map((s: SquadEntryWithPlayer) => (
                  <option key={s.player_id} value={s.player_id}>
                    {s.players?.name}
                  </option>
                ))
              ) : (
                <>
                  <optgroup label="Team A">
                    {teamA.map((s: SquadEntryWithPlayer) => (
                      <option key={s.player_id} value={s.player_id}>
                        {s.players?.name}
                      </option>
                    ))}
                  </optgroup>
                  <optgroup label="Team B">
                    {teamB.map((s: SquadEntryWithPlayer) => (
                      <option key={s.player_id} value={s.player_id}>
                        {s.players?.name}
                      </option>
                    ))}
                  </optgroup>
                  {unassigned.length > 0 && (
                    <optgroup label="No team">
                      {unassigned.map((s: SquadEntryWithPlayer) => (
                        <option key={s.player_id} value={s.player_id}>
                          {s.players?.name}
                        </option>
                      ))}
                    </optgroup>
                  )}
                </>
              )}
            </select>
          </div>

          <button
            type="submit"
            className="w-full bg-lime text-ink font-display font-semibold uppercase tracking-wide rounded py-3 hover:brightness-95 transition"
          >
            Save result &amp; publish
          </button>
        </form>
      )}
    </div>
  );
}
