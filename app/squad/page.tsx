import Link from "next/link";
import { getPlayerTotalsList } from "@/lib/queries";
import { SectionHeading, EmptyState } from "@/components/ui";

export default async function SquadPage() {
  const players = await getPlayerTotalsList();
  const active = players.filter((p) => p.active);

  return (
    <div className="mx-auto max-w-5xl px-5 py-12">
      <SectionHeading eyebrow="The Club" title="Squad" />

      {active.length === 0 ? (
        <EmptyState>No players added yet.</EmptyState>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {active.map((p) => (
            <Link
              key={p.player_id}
              href={`/players/${p.player_id}`}
              className="bg-surface border border-line rounded-lg p-5 hover:border-lime/40 transition-colors"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="font-display text-lg font-semibold">
                  {p.name}
                </span>
                {p.jersey_number != null && (
                  <span className="font-display text-xl text-muted">
                    #{p.jersey_number}
                  </span>
                )}
              </div>
              <p className="text-xs uppercase tracking-wide text-muted mb-4">
                {p.position ?? "Player"}
              </p>
              <div className="flex gap-4 text-sm">
                <span>
                  <span className="text-lime font-semibold">{p.goals}</span>{" "}
                  <span className="text-muted">G</span>
                </span>
                <span>
                  <span className="text-lime font-semibold">{p.assists}</span>{" "}
                  <span className="text-muted">A</span>
                </span>
                <span>
                  <span className="text-muted font-semibold">
                    {p.appearances}
                  </span>{" "}
                  <span className="text-muted">Apps</span>
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
