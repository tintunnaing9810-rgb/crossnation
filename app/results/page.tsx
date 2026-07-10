import Link from "next/link";
import { getResults } from "@/lib/queries";
import { formatMatchDate, matchTitle } from "@/lib/format";
import { SectionHeading, EmptyState } from "@/components/ui";

export default async function ResultsPage() {
  const results = await getResults();

  return (
    <div className="mx-auto max-w-5xl px-5 py-12">
      <SectionHeading eyebrow="Archive" title="Results" />

      {results.length === 0 ? (
        <EmptyState>No matches played yet.</EmptyState>
      ) : (
        <div className="divide-y divide-line border border-line rounded-lg overflow-hidden">
          {results.map((m) => (
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
                  {matchTitle(m)}
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
      )}
    </div>
  );
}
