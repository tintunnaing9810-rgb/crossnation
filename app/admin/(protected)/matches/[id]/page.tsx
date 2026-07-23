import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { setSquad } from "../actions";
import { SectionHeading } from "@/components/ui";
import { BackButton } from "@/components/BackButton";
import { formatMatchDate, matchTitle } from "@/lib/format";
import type { Match, Player } from "@/lib/types";

export default async function SetSquadPage({
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
    .select("player_id, selected, team")
    .eq("match_id", id);
  const selectedIds = new Set(
    (squadData ?? []).filter((s) => s.selected).map((s) => s.player_id)
  );
  const teamByPlayer = new Map(
    (squadData ?? []).map((s) => [s.player_id, s.team as string | null])
  );
  const inSquadIds = (squadData ?? []).map((s) => s.player_id);

  // Selectable players (not inactive), plus anyone already in this match's
  // squad even if they've since gone inactive — so old squads stay fully
  // editable without losing a since-retired player from the list.
  const { data: playersData } = await supabase
    .from("players")
    .select("*")
    .or(
      inSquadIds.length > 0
        ? `status.neq.inactive,id.in.(${inSquadIds.join(",")})`
        : "status.neq.inactive"
    )
    .order("name", { ascending: true });
  const players = (playersData ?? []) as Player[];

  const setSquadWithId = setSquad.bind(null, id);

  return (
    <div className="max-w-lg space-y-8">
      <BackButton />
      <SectionHeading
        eyebrow={formatMatchDate(match.match_date)}
        title={`Squad — ${matchTitle(match)}`}
      />
      {players.length === 0 ? (
        <p className="text-muted text-sm">
          Add players to the roster first.
        </p>
      ) : (
        <form action={setSquadWithId} className="bg-surface border border-line rounded-lg p-5 space-y-1">
          <input
            type="hidden"
            name="player_ids"
            value={players.map((p) => p.id).join(",")}
          />
          {!isFriendly && (
            <p className="text-xs text-muted pb-3">
              Put each player on Team A or Team B — leave on “Out” to drop them
              from the match day.
            </p>
          )}
          {players.map((p) => (
            <div
              key={p.id}
              className="flex items-center justify-between gap-3 py-2 border-b border-line last:border-0"
            >
              <span className="min-w-0 truncate">
                {p.name}
                <span className="text-muted text-xs ml-2">
                  {p.position ?? ""}
                </span>
              </span>
              {isFriendly ? (
                <input
                  type="checkbox"
                  name={`selected_${p.id}`}
                  defaultChecked={selectedIds.has(p.id)}
                  className="w-5 h-5 accent-lime shrink-0"
                  aria-label={`Select ${p.name}`}
                />
              ) : (
                <select
                  name={`team_${p.id}`}
                  defaultValue={teamByPlayer.get(p.id) ?? ""}
                  className="bg-surface-2 border border-line rounded px-2 py-1 text-sm shrink-0"
                  aria-label={`Team for ${p.name}`}
                >
                  <option value="">Out</option>
                  <option value="a">Team A</option>
                  <option value="b">Team B</option>
                </select>
              )}
            </div>
          ))}
          <button
            type="submit"
            className="w-full mt-4 bg-lime text-ink font-display font-semibold uppercase tracking-wide rounded py-2.5 hover:brightness-95 transition"
          >
            Save squad
          </button>
        </form>
      )}
    </div>
  );
}
