import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { formatMatchDate } from "@/lib/format";
import { SectionHeading, EmptyState, Badge } from "@/components/ui";
import type { Match } from "@/lib/types";

export default async function AdminMatchesPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("matches")
    .select("*")
    .order("match_date", { ascending: false });

  const matches = (data ?? []) as Match[];
  const upcoming = matches.filter((m) => m.status === "upcoming");
  const completed = matches.filter((m) => m.status === "completed");

  return (
    <div className="space-y-12">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <SectionHeading eyebrow="Fixtures" title="Matches" />
        <Link
          href="/admin/matches/new"
          className="bg-lime text-ink font-display font-semibold uppercase tracking-wide rounded px-4 py-2.5 h-fit hover:brightness-95 transition"
        >
          + New match
        </Link>
      </div>

      <section>
        <h3 className="font-display uppercase text-sm tracking-wide text-muted mb-3">
          Upcoming
        </h3>
        {upcoming.length === 0 ? (
          <EmptyState>No upcoming match set.</EmptyState>
        ) : (
          <div className="divide-y divide-line border border-line rounded-lg overflow-hidden">
            {upcoming.map((m) => (
              <div key={m.id} className="flex items-center justify-between px-5 py-4 bg-surface flex-wrap gap-2">
                <div>
                  <p className="text-xs text-muted">{formatMatchDate(m.match_date)}</p>
                  <p className="font-display font-semibold">vs {m.opponent}</p>
                </div>
                <div className="flex gap-4 text-sm">
                  <Link href={`/admin/matches/${m.id}`} className="text-lime hover:underline">
                    Set squad
                  </Link>
                  <Link href={`/admin/matches/${m.id}/result`} className="text-gold hover:underline">
                    Enter result
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <section>
        <h3 className="font-display uppercase text-sm tracking-wide text-muted mb-3">
          Completed
        </h3>
        {completed.length === 0 ? (
          <EmptyState>No results recorded yet.</EmptyState>
        ) : (
          <div className="divide-y divide-line border border-line rounded-lg overflow-hidden">
            {completed.map((m) => (
              <div key={m.id} className="flex items-center justify-between px-5 py-4 bg-surface flex-wrap gap-2">
                <div>
                  <p className="text-xs text-muted">{formatMatchDate(m.match_date)}</p>
                  <p className="font-display font-semibold">vs {m.opponent}</p>
                </div>
                <div className="flex items-center gap-4">
                  <Badge tone="gold">
                    {m.home_away === "away"
                      ? `${m.away_score} - ${m.home_score}`
                      : `${m.home_score} - ${m.away_score}`}
                  </Badge>
                  <Link href={`/results/${m.id}`} className="text-sm text-lime hover:underline">
                    View
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
