import Link from "next/link";
import { getPlayerTotalsList } from "@/lib/queries";
import { SectionHeading, EmptyState, Badge } from "@/components/ui";
import { badgeMeta } from "@/lib/badges";
import type { PlayerStatus } from "@/lib/types";

// Regulars first, then irregulars, then inactive players (kept visible
// for history). Within each group the query's goal order is preserved.
const STATUS_RANK: Record<PlayerStatus, number> = {
  regular: 0,
  irregular: 1,
  inactive: 2,
};

export default async function SquadPage() {
  const players = await getPlayerTotalsList();
  const ordered = [...players].sort(
    (a, b) => STATUS_RANK[a.status] - STATUS_RANK[b.status]
  );

  return (
    <div className="mx-auto max-w-5xl px-5 py-12">
      <SectionHeading eyebrow="The Club" title="Squad" />

      {ordered.length === 0 ? (
        <EmptyState>No players added yet.</EmptyState>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {ordered.map((p) => {
            const badge = badgeMeta(p.badge);
            const inactive = p.status === "inactive";
            return (
              <Link
                key={p.player_id}
                href={`/players/${p.player_id}`}
                className={`bg-surface border border-line rounded-lg p-4 hover:border-lime/40 transition-colors ${
                  inactive ? "opacity-60" : ""
                }`}
              >
                <div className="flex items-start justify-between gap-2 mb-1.5">
                  <span className="font-display text-base font-semibold leading-tight">
                    {p.name}
                  </span>
                  {p.jersey_number != null && (
                    <span className="font-display text-base text-muted shrink-0">
                      #{p.jersey_number}
                    </span>
                  )}
                </div>
                <p className="text-[11px] uppercase tracking-wide text-muted">
                  {p.position ?? "Player"}
                </p>

                {(badge || p.status !== "regular") && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {badge && <Badge tone="gold">{badge.name}</Badge>}
                    {p.status === "irregular" && <Badge>Irregular</Badge>}
                    {inactive && <Badge>Inactive</Badge>}
                  </div>
                )}

                <div className="flex gap-3 text-xs mt-3">
                  <span>
                    <span className="text-lime font-semibold">{p.goals}</span>{" "}
                    <span className="text-muted">G</span>
                  </span>
                  <span>
                    <span className="text-lime font-semibold">{p.assists}</span>{" "}
                    <span className="text-muted">A</span>
                  </span>
                  <span>
                    <span className="text-muted font-semibold">
                      {p.appearances}
                    </span>{" "}
                    <span className="text-muted">Apps</span>
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
