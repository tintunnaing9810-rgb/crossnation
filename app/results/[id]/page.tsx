import { notFound } from "next/navigation";
import Link from "next/link";
import { getMatchDetail } from "@/lib/queries";
import { formatMatchDate, matchTypeLabel } from "@/lib/format";
import { SectionHeading, Badge, EmptyState } from "@/components/ui";
import type { StatsEntryWithPlayer } from "@/lib/types";

export default async function MatchDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const detail = await getMatchDetail(id);
  if (!detail) notFound();

  const { match, stats } = detail;

  return (
    <div className="mx-auto max-w-5xl px-5 py-12 space-y-10">
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
        {stats.length === 0 ? (
          <EmptyState>No player stats logged for this match.</EmptyState>
        ) : (
          <div className="divide-y divide-line border border-line rounded-lg overflow-hidden">
            {stats.map((s: StatsEntryWithPlayer) => (
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
        )}
      </section>
    </div>
  );
}
