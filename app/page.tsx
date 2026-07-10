import Link from "next/link";
import {
  getUpcomingMatch,
  getLatestResult,
  getResults,
  getPlayerTotalsList,
} from "@/lib/queries";
import { formatMatchDate, formatMatchTime } from "@/lib/format";
import { EmptyState, SectionHeading, Badge } from "@/components/ui";
import type { SquadEntryWithPlayer, StatsEntryWithPlayer } from "@/lib/types";

export default async function HomePage() {
  const [upcoming, latest, results, totals] = await Promise.all([
    getUpcomingMatch(),
    getLatestResult(),
    getResults(),
    getPlayerTotalsList(),
  ]);

  const topScorer = totals.find((p) => p.goals > 0);

  // The most recent result is featured above; list the rest here so the
  // full results archive lives on the Match Center, not a separate tab.
  const earlierResults = results.filter((m) => m.id !== latest?.match.id);

  return (
    <div className="mx-auto max-w-5xl px-5 py-12 space-y-16">
      {/* HERO — upcoming match */}
      <section>
        <p className="text-xs uppercase tracking-[0.2em] text-lime mb-3">
          Match Center
        </p>
        {upcoming ? (
          <div className="wing-cut bg-surface border border-line p-6 sm:p-10">
            <div className="flex items-center justify-between flex-wrap gap-3 mb-6">
              <Badge tone="gold">Next match</Badge>
              <span className="text-sm text-muted">
                {formatMatchDate(upcoming.match.match_date)} &middot;{" "}
                {formatMatchTime(upcoming.match.match_date)}
              </span>
            </div>
            <div className="flex items-end justify-between flex-wrap gap-6">
              <div>
                <h1 className="font-display text-3xl sm:text-5xl font-semibold uppercase leading-none">
                  CrossNation
                  <span className="block text-muted text-xl sm:text-2xl mt-2 normal-case">
                    vs {upcoming.match.opponent}
                  </span>
                </h1>
                {upcoming.match.venue && (
                  <p className="text-sm text-muted mt-3">
                    {upcoming.match.venue} &middot;{" "}
                    {upcoming.match.home_away === "home" ? "Home" : upcoming.match.home_away === "away" ? "Away" : "Neutral"}
                  </p>
                )}
              </div>
              {upcoming.squad.length > 0 && (
                <div className="w-full sm:w-auto">
                  <p className="text-xs uppercase tracking-wide text-muted mb-2">
                    Squad announced &middot; {upcoming.squad.length} selected
                  </p>
                  <div className="flex flex-wrap gap-2 max-w-md">
                    {upcoming.squad.slice(0, 12).map((s: SquadEntryWithPlayer) => (
                      <span
                        key={s.player_id}
                        className="text-xs bg-surface-2 border border-line rounded px-2 py-1"
                      >
                        {s.players?.name}
                      </span>
                    ))}
                    {upcoming.squad.length > 12 && (
                      <span className="text-xs text-muted px-2 py-1">
                        +{upcoming.squad.length - 12} more
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          <EmptyState>No match scheduled yet — check back soon.</EmptyState>
        )}
      </section>

      {/* LATEST RESULT */}
      <section>
        <SectionHeading eyebrow="Latest" title="Result" />
        {latest ? (
          <div className="bg-surface border border-line rounded-lg p-6 sm:p-8">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div>
                <p className="text-sm text-muted mb-1">
                  {formatMatchDate(latest.match.match_date)}
                </p>
                <p className="font-display text-2xl sm:text-3xl font-semibold uppercase">
                  CrossNation{" "}
                  <span className="text-gold">
                    {latest.match.home_away === "away"
                      ? `${latest.match.away_score} - ${latest.match.home_score}`
                      : `${latest.match.home_score} - ${latest.match.away_score}`}
                  </span>{" "}
                  {latest.match.opponent}
                </p>
              </div>
              <Link
                href={`/results/${latest.match.id}`}
                className="text-sm font-display uppercase tracking-wide text-lime hover:underline"
              >
                Full match &rarr;
              </Link>
            </div>
            {latest.stats.length > 0 && (
              <div className="mt-6 flex flex-wrap gap-2">
                {latest.stats
                  .filter((s: StatsEntryWithPlayer) => s.motm)
                  .map((s: StatsEntryWithPlayer) => (
                    <Badge key={s.player_id} tone="gold">
                      MOTM &middot; {s.players?.name}
                    </Badge>
                  ))}
                {latest.stats
                  .filter((s: StatsEntryWithPlayer) => s.goals > 0)
                  .map((s: StatsEntryWithPlayer) => (
                    <Badge key={`g-${s.player_id}`} tone="lime">
                      {s.players?.name} &middot; {s.goals}⚽
                    </Badge>
                  ))}
              </div>
            )}
          </div>
        ) : (
          <EmptyState>No results logged yet.</EmptyState>
        )}
      </section>

      {/* RESULTS ARCHIVE — everything except the featured latest result */}
      {earlierResults.length > 0 && (
        <section>
          <SectionHeading eyebrow="Archive" title="Earlier Results" />
          <div className="divide-y divide-line border border-line rounded-lg overflow-hidden">
            {earlierResults.map((m) => (
              <Link
                href={`/results/${m.id}`}
                key={m.id}
                className="flex items-center justify-between px-5 py-4 bg-surface hover:bg-surface-2 transition-colors"
              >
                <div>
                  <p className="text-xs text-muted mb-1">
                    {formatMatchDate(m.match_date)}
                  </p>
                  <p className="font-display text-lg font-semibold uppercase">
                    CrossNation vs {m.opponent}
                  </p>
                </div>
                <p className="font-display text-2xl font-semibold text-gold">
                  {m.home_away === "away"
                    ? `${m.away_score} - ${m.home_score}`
                    : `${m.home_score} - ${m.away_score}`}
                </p>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* QUICK STAT TEASER */}
      {topScorer && (
        <section>
          <SectionHeading eyebrow="Season" title="Top Scorer" />
          <Link
            href={`/players/${topScorer.player_id}`}
            className="flex items-center justify-between bg-surface border border-line rounded-lg p-5 hover:border-lime/40 transition-colors"
          >
            <div>
              <p className="font-display text-xl font-semibold">{topScorer.name}</p>
              <p className="text-sm text-muted">{topScorer.position ?? "Player"}</p>
            </div>
            <div className="text-right">
              <p className="font-display text-3xl font-semibold text-lime">
                {topScorer.goals}
              </p>
              <p className="text-xs uppercase tracking-wide text-muted">Goals</p>
            </div>
          </Link>
        </section>
      )}
    </div>
  );
}
