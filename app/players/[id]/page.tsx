import { notFound } from "next/navigation";
import Link from "next/link";
import { getSquadRanking, getPlayerMatchHistory } from "@/lib/queries";
import { formatMatchDate, formatDate } from "@/lib/format";
import { StatPill, SectionHeading, EmptyState, Badge } from "@/components/ui";
import { BackButton } from "@/components/BackButton";
import { badgeMeta } from "@/lib/badges";
import type { StatsEntryWithMatch } from "@/lib/types";

export default async function PlayerProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  // Pull from the ranked squad so we have the player's points, rating and
  // their rank position, all consistent with the /squad table.
  const ranking = await getSquadRanking();
  const rankIndex = ranking.findIndex((r) => r.player_id === id);
  if (rankIndex === -1) notFound();
  const totals = ranking[rankIndex];
  const rank = rankIndex + 1;

  const history = await getPlayerMatchHistory(id);
  const badge = badgeMeta(totals.badge);

  return (
    <div className="mx-auto max-w-5xl px-5 py-12 space-y-10">
      <BackButton />
      <div>
        <p className="text-xs uppercase tracking-[0.2em] text-lime mb-2">
          {totals.position ?? "Player"}
          {totals.jersey_number != null ? ` · #${totals.jersey_number}` : ""}
        </p>
        <h1 className="font-display text-3xl sm:text-4xl font-semibold uppercase">
          {totals.name}
        </h1>
        <div className="flex flex-wrap items-center gap-2 mt-3">
          {badge && <Badge tone="gold">{badge.name} · {badge.honors}</Badge>}
          {totals.status === "inactive" && <Badge>Inactive</Badge>}
          {totals.status === "irregular" && <Badge>Irregular</Badge>}
        </div>
        {totals.joined_at && (
          <p className="text-sm text-muted mt-3">
            Joined {formatDate(totals.joined_at)}
          </p>
        )}
        <span className="tri-bar mt-3" />
      </div>

      {/* Ranking headline: squad rank, points, rating, record */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <StatPill label="Squad rank" value={`#${rank}`} />
        <StatPill label="Pts" value={totals.points} />
        <StatPill label="Rating" value={totals.score} />
        <StatPill
          label="W-D-L"
          value={`${totals.wins}-${totals.draws}-${totals.losses}`}
        />
      </div>

      <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
        <StatPill label="Apps" value={totals.appearances} />
        <StatPill label="Goals" value={totals.goals} />
        <StatPill label="Assists" value={totals.assists} />
        <StatPill label="MOTM" value={totals.motm_count} />
        <StatPill label="Clean sheets" value={totals.clean_sheets} />
      </div>

      <section>
        <SectionHeading eyebrow="History" title="Match by Match" />
        {history.length === 0 ? (
          <EmptyState>No matches logged for this player yet.</EmptyState>
        ) : (
          <div className="divide-y divide-line border border-line rounded-lg overflow-hidden">
            {history.map((h: StatsEntryWithMatch) => (
              <Link
                href={`/results/${h.match_id}`}
                key={h.match_id}
                className="flex items-center justify-between px-5 py-4 bg-surface hover:bg-surface-2 transition-colors flex-wrap gap-2"
              >
                <div>
                  <p className="text-sm">
                    {h.matches?.match_type === "friendly"
                      ? `vs ${h.matches?.opponent}`
                      : h.matches?.opponent}{" "}
                    <span className="text-muted">
                      &middot; {h.matches ? formatMatchDate(h.matches.match_date) : ""}
                    </span>
                  </p>
                </div>
                <div className="flex gap-2 flex-wrap">
                  {h.motm && <Badge tone="gold">MOTM</Badge>}
                  {h.goals > 0 && <Badge tone="lime">{h.goals}⚽</Badge>}
                  {h.assists > 0 && <Badge>{h.assists} assist{h.assists > 1 ? "s" : ""}</Badge>}
                  {h.clean_sheet && <Badge>Clean sheet</Badge>}
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
