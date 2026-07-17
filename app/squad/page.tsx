import Link from "next/link";
import { getSquadRanking } from "@/lib/queries";
import { SectionHeading, EmptyState, Badge } from "@/components/ui";
import { badgeMeta } from "@/lib/badges";
import { isGoalkeeper } from "@/lib/players";
import { POINTS, PERFORMANCE_WEIGHTS } from "@/lib/points";

export default async function SquadPage() {
  const players = await getSquadRanking();

  return (
    <div className="mx-auto max-w-5xl px-5 py-12">
      <SectionHeading eyebrow="The Club" title="Squad" />

      <div className="bg-surface border border-line rounded-lg p-4 mb-6 text-xs text-muted space-y-1.5">
        <p>
          <span className="font-display font-semibold uppercase text-paper">
            Pts
          </span>{" "}
          &mdash; turning up &amp; results, and what the list is ranked by:
          Appearance +{POINTS.appearance}, Win +{POINTS.win}, Draw +{POINTS.draw}
          , Loss +{POINTS.loss}.
        </p>
        <p>
          <span className="font-display font-semibold uppercase text-lime">
            Rating
          </span>{" "}
          &mdash; individual contribution: Goal &times;{PERFORMANCE_WEIGHTS.goal},
          Assist &times;{PERFORMANCE_WEIGHTS.assist}, MOTM &times;
          {PERFORMANCE_WEIGHTS.motm}, Clean sheet &times;
          {PERFORMANCE_WEIGHTS.cleanSheet}.
        </p>
      </div>

      {players.length === 0 ? (
        <EmptyState>No players added yet.</EmptyState>
      ) : (
        <div className="divide-y divide-line border border-line rounded-lg overflow-hidden">
          {players.map((p) => {
            const badge = badgeMeta(p.badge);
            const inactive = p.status === "inactive";
            const gk = isGoalkeeper(p.position);
            const record = `${p.wins}W ${p.draws}D ${p.losses}L`;
            const extra = gk
              ? `${p.clean_sheets} CS`
              : `${p.goals}G ${p.assists}A`;
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

                {/* Name + position + record */}
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
                    {p.position ?? "Player"} &middot; {p.appearances} apps &middot;{" "}
                    {record} &middot; {extra}
                  </p>
                </div>

                {/* Rating (ranks the table) + Points */}
                <div className="flex items-center gap-4 shrink-0 text-right tabular-nums">
                  <div>
                    <div className="font-display text-lg font-semibold text-lime leading-none">
                      {p.score}
                    </div>
                    <div className="text-[10px] uppercase tracking-wide text-muted mt-0.5">
                      Rating
                    </div>
                  </div>
                  <div>
                    <div className="font-display text-sm font-semibold text-paper leading-none">
                      {p.points}
                    </div>
                    <div className="text-[10px] uppercase tracking-wide text-muted mt-0.5">
                      Pts
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
