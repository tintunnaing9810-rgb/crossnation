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
        <div className="divide-y divide-line border border-line rounded-lg overflow-hidden">
          {ordered.map((p) => {
            const badge = badgeMeta(p.badge);
            const inactive = p.status === "inactive";
            return (
              <Link
                key={p.player_id}
                href={`/players/${p.player_id}`}
                className={`flex items-center gap-3 px-4 py-3 bg-surface hover:bg-surface-2 transition-colors ${
                  inactive ? "opacity-60" : ""
                }`}
              >
                {/* Jersey number */}
                <span className="font-display text-sm text-muted w-7 shrink-0 text-center">
                  {p.jersey_number != null ? `#${p.jersey_number}` : ""}
                </span>

                {/* Name + position + badges */}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-display font-semibold leading-tight truncate">
                      {p.name}
                    </span>
                    {badge && <Badge tone="gold">{badge.name}</Badge>}
                    {p.status === "irregular" && <Badge>Irregular</Badge>}
                    {inactive && <Badge>Inactive</Badge>}
                  </div>
                  <p className="text-[11px] uppercase tracking-wide text-muted">
                    {p.position ?? "Player"}
                  </p>
                </div>

                {/* Stats */}
                <div className="flex gap-3 text-xs shrink-0 tabular-nums">
                  <span>
                    <span className="text-lime font-semibold">{p.goals}</span>{" "}
                    <span className="text-muted">G</span>
                  </span>
                  <span>
                    <span className="text-lime font-semibold">{p.assists}</span>{" "}
                    <span className="text-muted">A</span>
                  </span>
                  <span>
                    <span className="text-paper font-semibold">
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
