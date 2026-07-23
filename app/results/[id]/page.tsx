import { notFound } from "next/navigation";
import Link from "next/link";
import { getMatchDetail } from "@/lib/queries";
import { formatMatchDate, matchTypeLabel } from "@/lib/format";
import { SectionHeading, Badge, EmptyState } from "@/components/ui";
import { BackButton } from "@/components/BackButton";
import type { StatsEntryWithPlayer } from "@/lib/types";

export default async function MatchDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const detail = await getMatchDetail(id);
  if (!detail) notFound();

  const { match, stats, squad } = detail;

  // Show everyone who was in the match squad — including players who
  // didn't score or assist. Only players who weren't picked for the match
  // are left out. (The squad filter also drops any stale stats from a
  // player who was later removed from this match.)
  const selectedIds = new Set(
    squad.filter((s) => s.selected).map((s) => s.player_id)
  );
  const participants =
    selectedIds.size > 0
      ? stats.filter((s) => selectedIds.has(s.player_id))
      : stats;

  // For internal match days, split the participants into the two sides
  // they actually played on (set at squad selection).
  const isFriendly = match.match_type === "friendly";
  const teamByPlayer = new Map(squad.map((s) => [s.player_id, s.team]));
  const teamA = participants.filter((s) => teamByPlayer.get(s.player_id) === "a");
  const teamB = participants.filter((s) => teamByPlayer.get(s.player_id) === "b");
  const unassigned = participants.filter((s) => {
    const t = teamByPlayer.get(s.player_id);
    return t !== "a" && t !== "b";
  });

  const renderRows = (list: StatsEntryWithPlayer[]) => (
    <div className="divide-y divide-line border border-line rounded-lg overflow-hidden">
      {list.map((s: StatsEntryWithPlayer) => (
        <Link
          href={`/players/${s.player_id}`}
          key={s.player_id}
          className="flex items-center justify-between px-5 py-4 bg-surface hover:bg-surface-2 transition-colors flex-wrap gap-2"
        >
          <span className="font-display font-semibold">
            {s.players?.name}
          </span>
          <div className="flex gap-2 flex-wrap">
            {s.motm && <Badge tone="gold">MOTM</Badge>}
            {s.goals > 0 && <Badge tone="lime">{s.goals}⚽</Badge>}
            {s.assists > 0 && (
              <Badge>{s.assists} assist{s.assists > 1 ? "s" : ""}</Badge>
            )}
            {s.clean_sheet && <Badge>Clean sheet</Badge>}
          </div>
        </Link>
      ))}
    </div>
  );

  return (
    <div className="mx-auto max-w-5xl px-5 py-12 space-y-10">
      <BackButton />
      <div>
        <p className="text-xs uppercase tracking-[0.2em] text-lime mb-2">
          {matchTypeLabel(match.match_type)} · {formatMatchDate(match.match_date)}
          {match.venue ? ` · ${match.venue}` : ""}
        </p>
        <h1 className="font-display text-3xl sm:text-4xl font-semibold uppercase">
          {match.match_type === "friendly" ? (
            <>
              CrossNation{" "}
              {match.status === "completed" && (
                <span className="text-gold">
                  {match.home_score} - {match.away_score}
                </span>
              )}{" "}
              {match.opponent}
            </>
          ) : (
            <>
              {match.opponent}{" "}
              {match.status === "completed" && (
                <span className="text-gold">
                  {match.home_score} - {match.away_score}
                </span>
              )}
            </>
          )}
        </h1>
      </div>

      <section>
        <SectionHeading eyebrow="Match" title="Stats" />
        {participants.length === 0 ? (
          <EmptyState>No players recorded for this match.</EmptyState>
        ) : isFriendly ? (
          renderRows(participants)
        ) : (
          <div className="space-y-6">
            <div>
              <p className="text-xs uppercase tracking-wide text-lime mb-2">
                Team A
                {match.status === "completed" && match.home_score != null
                  ? ` · ${match.home_score}`
                  : ""}
              </p>
              {teamA.length > 0 ? (
                renderRows(teamA)
              ) : (
                <p className="text-sm text-muted">No players listed.</p>
              )}
            </div>
            <div>
              <p className="text-xs uppercase tracking-wide text-gold mb-2">
                Team B
                {match.status === "completed" && match.away_score != null
                  ? ` · ${match.away_score}`
                  : ""}
              </p>
              {teamB.length > 0 ? (
                renderRows(teamB)
              ) : (
                <p className="text-sm text-muted">No players listed.</p>
              )}
            </div>
            {unassigned.length > 0 && (
              <div>
                <p className="text-xs uppercase tracking-wide text-muted mb-2">
                  Squad
                </p>
                {renderRows(unassigned)}
              </div>
            )}
          </div>
        )}
      </section>
    </div>
  );
}
