import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { setSquad } from "../actions";
import { SectionHeading } from "@/components/ui";
import { formatMatchDate } from "@/lib/format";
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

  const { data: playersData } = await supabase
    .from("players")
    .select("*")
    .eq("active", true)
    .order("name", { ascending: true });
  const players = (playersData ?? []) as Player[];

  const { data: squadData } = await supabase
    .from("match_squad")
    .select("player_id, selected")
    .eq("match_id", id);
  const selectedIds = new Set(
    (squadData ?? []).filter((s) => s.selected).map((s) => s.player_id)
  );

  const setSquadWithId = setSquad.bind(null, id);

  return (
    <div className="max-w-lg space-y-8">
      <SectionHeading
        eyebrow={formatMatchDate(match.match_date)}
        title={`Squad vs ${match.opponent}`}
      />
      {players.length === 0 ? (
        <p className="text-muted text-sm">
          Add players to the roster first.
        </p>
      ) : (
        <form action={setSquadWithId} className="bg-surface border border-line rounded-lg p-5 space-y-1">
          {players.map((p) => (
            <label
              key={p.id}
              className="flex items-center justify-between py-2 border-b border-line last:border-0 cursor-pointer"
            >
              <span>
                {p.name}
                <span className="text-muted text-xs ml-2">
                  {p.position ?? ""}
                </span>
              </span>
              <input
                type="checkbox"
                name={`selected_${p.id}`}
                defaultChecked={selectedIds.has(p.id)}
                className="w-5 h-5 accent-lime"
              />
            </label>
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
