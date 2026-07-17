import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { addPlayer, setPlayerStatus } from "./actions";
import { SectionHeading, EmptyState, Badge } from "@/components/ui";
import { PlayerStatusControl } from "@/components/PlayerStatusControl";
import { PLAYER_BADGES, badgeMeta } from "@/lib/badges";
import type { Player, PlayerStatus } from "@/lib/types";

export default async function AdminPlayersPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("players")
    .select("*")
    .order("name", { ascending: true });
  const players = (data ?? []) as Player[];
  const today = new Date().toISOString().slice(0, 10);

  return (
    <div className="space-y-10">
      <SectionHeading eyebrow="Roster" title="Players" />

      <form
        action={addPlayer}
        className="bg-surface border border-line rounded-lg p-5 grid sm:grid-cols-4 gap-3 items-end"
      >
        <div className="sm:col-span-2">
          <label className="block text-xs uppercase tracking-wide text-muted mb-1.5">
            Name
          </label>
          <input
            name="name"
            required
            className="w-full bg-surface-2 border border-line rounded px-3 py-2"
          />
        </div>
        <div>
          <label className="block text-xs uppercase tracking-wide text-muted mb-1.5">
            Position
          </label>
          <input
            name="position"
            placeholder="Pivot, Winger…"
            className="w-full bg-surface-2 border border-line rounded px-3 py-2"
          />
        </div>
        <div>
          <label className="block text-xs uppercase tracking-wide text-muted mb-1.5">
            Number
          </label>
          <input
            name="jersey_number"
            type="number"
            className="w-full bg-surface-2 border border-line rounded px-3 py-2"
          />
        </div>
        <div className="sm:col-span-2">
          <label className="block text-xs uppercase tracking-wide text-muted mb-1.5">
            Badge (optional)
          </label>
          <select
            name="badge"
            defaultValue=""
            className="w-full bg-surface-2 border border-line rounded px-3 py-2"
          >
            <option value="">No badge</option>
            {PLAYER_BADGES.map((b) => (
              <option key={b.key} value={b.key}>
                {b.name} — {b.honors}
              </option>
            ))}
          </select>
        </div>
        <div className="sm:col-span-2">
          <label className="block text-xs uppercase tracking-wide text-muted mb-1.5">
            Joined
          </label>
          <input
            name="joined_at"
            type="date"
            defaultValue={today}
            className="w-full bg-surface-2 border border-line rounded px-3 py-2"
          />
        </div>
        <button
          type="submit"
          className="sm:col-span-4 bg-lime text-ink font-display font-semibold uppercase tracking-wide rounded py-2.5 hover:brightness-95 transition"
        >
          Add player
        </button>
      </form>

      {players.length === 0 ? (
        <EmptyState>No players in the roster yet.</EmptyState>
      ) : (
        <div className="divide-y divide-line border border-line rounded-lg overflow-hidden">
          {players.map((p) => {
            const badge = badgeMeta(p.badge);
            return (
              <div
                key={p.id}
                className="flex items-center justify-between px-5 py-3 bg-surface flex-wrap gap-2"
              >
                <div className="flex items-center gap-3 flex-wrap">
                  <span className="font-display font-semibold">{p.name}</span>
                  <span className="text-xs text-muted">
                    {p.position ?? "—"}{" "}
                    {p.jersey_number != null ? `#${p.jersey_number}` : ""}
                  </span>
                  {badge && <Badge tone="gold">{badge.name}</Badge>}
                  {p.status === "inactive" && <Badge>Inactive</Badge>}
                  {p.status === "irregular" && <Badge>Irregular</Badge>}
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Link
                    href={`/admin/players/${p.id}`}
                    className="text-lime hover:underline"
                  >
                    Edit
                  </Link>
                  <PlayerStatusControl
                    current={p.status}
                    action={async (formData) => {
                      "use server";
                      const raw = String(formData.get("status") ?? "regular");
                      const status = (
                        ["regular", "irregular", "inactive"].includes(raw)
                          ? raw
                          : "regular"
                      ) as PlayerStatus;
                      await setPlayerStatus(p.id, status);
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
