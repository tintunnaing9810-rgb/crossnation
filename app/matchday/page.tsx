import type { Metadata } from "next";
import Link from "next/link";
import { SectionHeading, Badge } from "@/components/ui";

// Static match-day announcement for the friendly vs TAMU FC. This poster
// page is intentionally self-contained (not read from Supabase): it carries
// the matchday graphic's extras — the pitch formation and shirt numbers —
// that the `matches` schema doesn't model. Once the result is played, the
// canonical record still lives in the Match Center / results archive.
const MATCH = {
  opponent: "TAMU FC",
  type: "Friendly Match",
  // 24 Jul 2026, 22:00, local time.
  date: "Fri, 24 Jul 2026",
  time: "22:00",
  venue: "Panda FC, Dingdang",
  homeAway: "Home",
};

// The announced 12, in shirt-number order (as on the matchday graphic).
const SQUAD: { number: number; name: string }[] = [
  { number: 1, name: "Amrit" },
  { number: 3, name: "Kanhaiya" },
  { number: 5, name: "Kaung Y" },
  { number: 7, name: "Kiran" },
  { number: 8, name: "Nirmal" },
  { number: 10, name: "Buddham" },
  { number: 11, name: "Ravan" },
  { number: 14, name: "Ravi" },
  { number: 17, name: "Santosh" },
  { number: 20, name: "Sonu Waglay" },
  { number: 21, name: "Sunil PDY" },
  { number: 23, name: "Venoth" },
];

// The starting shape on the pitch graphic, as { number, x%, y% } where the
// pitch runs GK (bottom) → attack (top), matching the poster.
const FORMATION: { number: number; x: number; y: number }[] = [
  { number: 20, x: 22, y: 24 },
  { number: 11, x: 50, y: 20 },
  { number: 14, x: 78, y: 24 },
  { number: 3, x: 24, y: 55 },
  { number: 5, x: 50, y: 55 },
  { number: 17, x: 76, y: 55 },
  { number: 1, x: 50, y: 84 },
];

export const metadata: Metadata = {
  title: "Match Day · CrossNation vs TAMU FC",
  description:
    "Match day — CrossNation Futsal Club vs TAMU FC, a friendly on Fri 24 Jul 2026 at Panda FC, Dingdang.",
};

function ClubCrest({ label }: { label: string }) {
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="wing-cut flex h-16 w-16 items-center justify-center border border-line bg-surface-2 sm:h-20 sm:w-20">
        <span className="font-display text-lg font-bold uppercase tracking-tight text-paper sm:text-xl">
          {label
            .split(" ")
            .map((w) => w[0])
            .join("")}
        </span>
      </div>
      <span className="font-display text-sm font-semibold uppercase tracking-wide sm:text-base">
        {label}
      </span>
    </div>
  );
}

export default function MatchDayPage() {
  return (
    <div className="mx-auto max-w-5xl px-5 py-12 space-y-12">
      {/* POSTER HERO */}
      <section className="wing-cut relative overflow-hidden border border-line bg-surface p-6 sm:p-10">
        <p className="text-xs uppercase tracking-[0.3em] text-lime">
          Match Day
        </p>
        <h1 className="font-display text-5xl font-bold uppercase leading-[0.85] sm:text-7xl">
          Match
          <br />
          Day
        </h1>
        <div className="mt-2 flex items-center gap-3">
          <span className="tri-bar" />
          <span className="font-display text-xs uppercase tracking-[0.3em] text-muted">
            {MATCH.type}
          </span>
        </div>

        {/* VS */}
        <div className="mt-8 flex items-center justify-center gap-6 sm:gap-12">
          <ClubCrest label="CrossNation" />
          <span className="font-display text-3xl font-bold uppercase text-gold sm:text-5xl">
            VS
          </span>
          <ClubCrest label={MATCH.opponent} />
        </div>

        {/* WHEN / WHERE */}
        <div className="mt-10 space-y-4">
          <div className="flex items-center gap-3">
            <span aria-hidden className="text-gold">
              📅
            </span>
            <span className="font-display text-sm font-semibold uppercase tracking-wide sm:text-base">
              {MATCH.date} · {MATCH.time}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span aria-hidden className="text-gold">
              📍
            </span>
            <div>
              <p className="font-display text-sm font-semibold uppercase tracking-wide sm:text-base">
                {MATCH.venue}
              </p>
              <p className="text-xs uppercase tracking-wide text-lime">
                {MATCH.homeAway}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SQUAD + FORMATION */}
      <section className="grid gap-10 lg:grid-cols-2">
        <div>
          <SectionHeading eyebrow="Squad Announced" title="12 Selected" />
          <ul className="divide-y divide-line border border-line rounded-lg overflow-hidden">
            {SQUAD.map((p) => (
              <li
                key={p.number}
                className="flex items-center gap-4 bg-surface px-5 py-3"
              >
                <span className="font-display w-8 text-right text-lg font-semibold text-gold">
                  {p.number}
                </span>
                <span className="font-display font-semibold uppercase tracking-wide">
                  {p.name}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <SectionHeading eyebrow="Starting Shape" title="Formation" />
          <div className="relative mx-auto aspect-[3/4] w-full max-w-sm rounded-lg border border-line bg-surface-2">
            {/* pitch markings */}
            <div className="pointer-events-none absolute inset-4 rounded border border-line/70">
              <div className="absolute left-1/2 top-1/2 h-20 w-20 -translate-x-1/2 -translate-y-1/2 rounded-full border border-line/70" />
              <div className="absolute left-1/2 top-0 h-px w-full -translate-x-0 bg-line/70" />
              <div className="absolute bottom-0 left-1/2 h-16 w-28 -translate-x-1/2 border border-line/70" />
              <div className="absolute top-0 left-1/2 h-16 w-28 -translate-x-1/2 border border-line/70" />
            </div>
            {/* players */}
            {FORMATION.map((f) => (
              <div
                key={f.number}
                className="absolute flex h-9 w-9 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-gold/60 bg-gold sm:h-10 sm:w-10"
                style={{ left: `${f.x}%`, top: `${f.y}%` }}
              >
                <span className="font-display text-sm font-bold text-ink sm:text-base">
                  {f.number}
                </span>
              </div>
            ))}
          </div>
          <p className="mt-3 text-center text-xs text-muted">
            Announced starting shape · subs from the 12
          </p>
        </div>
      </section>

      {/* FOOTER STRIP */}
      <section className="flex flex-wrap items-center justify-between gap-4 border-t border-line pt-8">
        <div className="flex flex-wrap items-center gap-2">
          <Badge tone="gold">Next match</Badge>
          <Badge>{MATCH.type}</Badge>
          <Badge tone="lime">{MATCH.homeAway}</Badge>
        </div>
        <Link
          href="/squad"
          className="font-display text-sm uppercase tracking-wide text-lime hover:underline"
        >
          Full squad &rarr;
        </Link>
      </section>
    </div>
  );
}
