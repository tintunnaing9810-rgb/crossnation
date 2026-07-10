import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { formatMatchDate } from "@/lib/format";
import { SectionHeading, EmptyState } from "@/components/ui";
import type { JoinRequest, Match } from "@/lib/types";

export default async function AdminDashboardPage() {
  const supabase = await createClient();

  const { data: upcomingData } = await supabase
    .from("matches")
    .select("*")
    .eq("status", "upcoming")
    .order("match_date", { ascending: true })
    .limit(1)
    .maybeSingle();
  const upcoming = upcomingData as Match | null;

  const { data: requestsData } = await supabase
    .from("join_requests")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(10);
  const requests = (requestsData ?? []) as JoinRequest[];

  return (
    <div className="space-y-12">
      <SectionHeading eyebrow="Overview" title="Dashboard" />

      <section className="grid sm:grid-cols-2 gap-4">
        <div className="bg-surface border border-line rounded-lg p-5">
          <p className="text-xs uppercase tracking-wide text-muted mb-2">Next match</p>
          {upcoming ? (
            <>
              <p className="font-display text-xl font-semibold">
                vs {upcoming.opponent}
              </p>
              <p className="text-sm text-muted mt-1">
                {formatMatchDate(upcoming.match_date)}
              </p>
              <Link
                href={`/admin/matches/${upcoming.id}`}
                className="inline-block mt-3 text-sm text-lime hover:underline"
              >
                Manage squad &rarr;
              </Link>
            </>
          ) : (
            <>
              <p className="text-sm text-muted mb-3">Nothing scheduled.</p>
              <Link
                href="/admin/matches/new"
                className="text-sm text-lime hover:underline"
              >
                Announce a match &rarr;
              </Link>
            </>
          )}
        </div>

        <div className="bg-surface border border-line rounded-lg p-5">
          <p className="text-xs uppercase tracking-wide text-muted mb-2">Quick actions</p>
          <div className="flex flex-col gap-2 text-sm">
            <Link href="/admin/matches/new" className="text-lime hover:underline">
              + Announce a new match
            </Link>
            <Link href="/admin/players" className="text-lime hover:underline">
              + Add a player
            </Link>
            <Link href="/admin/matches" className="text-lime hover:underline">
              Enter a result
            </Link>
          </div>
        </div>
      </section>

      <section>
        <h3 className="font-display uppercase text-sm tracking-wide text-muted mb-3">
          Join requests
        </h3>
        {requests.length === 0 ? (
          <EmptyState>Nobody has submitted a join request yet.</EmptyState>
        ) : (
          <div className="divide-y divide-line border border-line rounded-lg overflow-hidden">
            {requests.map((r) => (
              <div key={r.id} className="px-5 py-3 bg-surface">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <span className="font-display font-semibold">{r.name}</span>
                  <span className="text-xs text-muted">
                    {new Date(r.created_at).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-sm text-muted">{r.contact}</p>
                {r.message && (
                  <p className="text-sm mt-1 text-paper/80">{r.message}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
