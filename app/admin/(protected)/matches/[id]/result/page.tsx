import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { recordResult } from "../../actions";
import { SectionHeading, EmptyState } from "@/components/ui";
import type { SquadEntryWithPlayer } from "@/lib/types";
import { formatMatchDate } from "@/lib/format";
import type { Match } from "@/lib/types";

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

  const { data: squadData } = await supabase
    .from("match_squad")
    .select("player_id, players(id, name, position)")
    .eq("match_id", id)
    .eq("selected", true);

  const squad = (squadData ?? []) as unknown as SquadEntryWithPlayer[];

  // existing stats, if re-editing a result
  const { data: existingStats } = await supabase
    .from("match_stats")
    .select("*")
    .eq("match_id", id);
  const statsByPlayer = new Map(
    (existingStats ?? []).map((s) => [s.player_id, s])
  );

  const recordResultWithId = recordResult.bind(null, id);

  return (
    <div className="max-w-2xl space-y-8">
      <SectionHeading
        eyebrow={formatMatchDate(match.match_date)}
        title={`Result vs ${match.opponent}`}
      />

      {squad.length === 0 ? (
        <EmptyState>
          No squad was set for this match. Set the squad first, then come
          back to enter the result.
        </EmptyState>
      ) : (
        <form action={recordResultWithId} className="space-y-6">
          <div className="bg-surface border border-line rounded-lg p-5 flex items-center gap-4">
            <div className="flex-1">
              <label className="block text-xs uppercase tracking-wide text-muted mb-1.5">
                CrossNation score
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
                {match.opponent} score
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

          <div className="bg-surface border border-line rounded-lg divide-y divide-line">
            <div className="grid grid-cols-[1fr_repeat(5,3.2rem)_auto] gap-2 px-4 py-2 text-[11px] uppercase tracking-wide text-muted">
              <span>Player</span>
              <span className="text-center">Gls</span>
              <span className="text-center">Ast</span>
              <span className="text-center">🟨</span>
              <span className="text-center">🟥</span>
              <span className="text-center">CS</span>
              <span>MOTM</span>
            </div>
            {squad.map((s: SquadEntryWithPlayer) => {
              const existing = statsByPlayer.get(s.player_id);
              return (
                <div
                  key={s.player_id}
                  className="grid grid-cols-[1fr_repeat(5,3.2rem)_auto] gap-2 px-4 py-2.5 items-center"
                >
                  <span className="text-sm truncate pr-2">{s.players?.name}</span>
                  <input
                    type="number"
                    min={0}
                    name={`goals_${s.player_id}`}
                    defaultValue={existing?.goals ?? 0}
                    className="w-full bg-surface-2 border border-line rounded px-2 py-1 text-center"
                  />
                  <input
                    type="number"
                    min={0}
                    name={`assists_${s.player_id}`}
                    defaultValue={existing?.assists ?? 0}
                    className="w-full bg-surface-2 border border-line rounded px-2 py-1 text-center"
                  />
                  <input
                    type="number"
                    min={0}
                    max={2}
                    name={`yellow_${s.player_id}`}
                    defaultValue={existing?.yellow_cards ?? 0}
                    className="w-full bg-surface-2 border border-line rounded px-2 py-1 text-center"
                  />
                  <input
                    type="number"
                    min={0}
                    max={1}
                    name={`red_${s.player_id}`}
                    defaultValue={existing?.red_cards ?? 0}
                    className="w-full bg-surface-2 border border-line rounded px-2 py-1 text-center"
                  />
                  <input
                    type="checkbox"
                    name={`clean_sheet_${s.player_id}`}
                    defaultChecked={existing?.clean_sheet ?? false}
                    className="w-5 h-5 accent-lime justify-self-center"
                  />
                  <input
                    type="radio"
                    name="motm"
                    value={s.player_id}
                    defaultChecked={existing?.motm ?? false}
                    className="w-5 h-5 accent-gold justify-self-center"
                  />
                </div>
              );
            })}
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
