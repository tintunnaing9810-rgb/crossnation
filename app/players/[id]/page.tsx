import { notFound } from "next/navigation";
import Link from "next/link";
import { getPlayerTotals, getPlayerMatchHistory } from "@/lib/queries";
import { formatMatchDate } from "@/lib/format";
import { StatPill, SectionHeading, EmptyState, Badge } from "@/components/ui";
import { badgeMeta } from "@/lib/badges";
import type { StatsEntryWithMatch } from "@/lib/types";

export default async function PlayerProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const totals = await getPlayerTotals(id);
  if (!totals) notFound();

  const history = await getPlayerMatchHistory(id);
  const badge = badgeMeta(totals.badge);

  return (
    <div className="mx-auto max-w-5xl px-5 py-12 space-y-10">
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
        <span className="tri-bar mt-3" />
      </div>

      <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
        <StatPill label="Apps" value={totals.appearances} />
        <StatPill label="Goals" value={totals.goals} />
        <StatPill label="Assists" value={totals.assists} />
        <StatPill label="MOTM" value={totals.motm_count} />
        <StatPill label="Clean sheets" value={totals.clean_sheets} />
        <StatPill label="Yellow / Red" value={`${totals.yellow_cards}/${totals.red_cards}`} />
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
                  {h.yellow_cards > 0 && <Badge>{h.yellow_cards}🟨</Badge>}
                  {h.red_cards > 0 && <Badge>{h.red_cards}🟥</Badge>}
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
