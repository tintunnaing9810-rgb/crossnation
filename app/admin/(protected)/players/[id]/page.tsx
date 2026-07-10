import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { updatePlayer } from "../actions";
import { SectionHeading } from "@/components/ui";
import type { Player } from "@/lib/types";

export default async function EditPlayerPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const { data } = await supabase
    .from("players")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  const player = data as Player | null;
  if (!player) notFound();

  const updateWithId = updatePlayer.bind(null, id);

  return (
    <div className="max-w-lg space-y-8">
      <SectionHeading eyebrow="Roster" title={`Edit ${player.name}`} />
      <form action={updateWithId} className="bg-surface border border-line rounded-lg p-5 space-y-4">
        <div>
          <label className="block text-xs uppercase tracking-wide text-muted mb-1.5">Name</label>
          <input
            name="name"
            defaultValue={player.name}
            required
            className="w-full bg-surface-2 border border-line rounded px-3 py-2"
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs uppercase tracking-wide text-muted mb-1.5">Position</label>
            <input
              name="position"
              defaultValue={player.position ?? ""}
              className="w-full bg-surface-2 border border-line rounded px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-xs uppercase tracking-wide text-muted mb-1.5">Number</label>
            <input
              name="jersey_number"
              type="number"
              defaultValue={player.jersey_number ?? ""}
              className="w-full bg-surface-2 border border-line rounded px-3 py-2"
            />
          </div>
        </div>
        <div>
          <label className="block text-xs uppercase tracking-wide text-muted mb-1.5">Bio (optional)</label>
          <textarea
            name="bio"
            rows={3}
            defaultValue={player.bio ?? ""}
            className="w-full bg-surface-2 border border-line rounded px-3 py-2"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-lime text-ink font-display font-semibold uppercase tracking-wide rounded py-2.5 hover:brightness-95 transition"
        >
          Save changes
        </button>
      </form>
    </div>
  );
}
