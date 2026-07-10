import type { Metadata } from "next";
import { SectionHeading, StatPill, Badge } from "@/components/ui";

export const metadata: Metadata = {
  title: "About — CrossNation Futsal Club",
  description:
    "CrossNation FC — a Saturday futsal club founded in 2025 by young players from Myanmar. Two teams every match day, monthly friendlies against other clubs.",
};

// The Garuda crest motifs, decoded from the club badge.
const BADGE = [
  {
    name: "Royal Garuda",
    honors: "The King",
    body: "The crown of the crest — carried by whoever leads the club on the day.",
  },
  {
    name: "Garuda Ascendants",
    honors: "The Enthusiast",
    body: "For the players who show up every Saturday, rain or shine, and lift everyone with them.",
  },
  {
    name: "Garuda Shields",
    honors: "The Fierce Walls",
    body: "The defenders and the keeper — the back line that turns a close game our way.",
  },
  {
    name: "Garuda Spirit",
    honors: "The Rising Commander",
    body: "For the player driving the team forward, setting the tempo from the middle.",
  },
];

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-5xl px-5 py-12 space-y-16">
      {/* HERO */}
      <section>
        <p className="text-xs uppercase tracking-[0.2em] text-lime mb-3">
          About the club
        </p>
        <h1 className="font-display text-4xl sm:text-6xl font-semibold uppercase leading-[0.95] max-w-3xl">
          CrossNation F.C
          <span className="block text-muted text-xl sm:text-2xl mt-3 normal-case">
            A Saturday futsal club, built to last longer than one match.
          </span>
        </h1>
        <p className="text-muted mt-6 max-w-2xl leading-relaxed">
          CrossNation Futsal Club was established in April 2025, founded by
          young players from Myanmar and joined, from time to time, by
          international players passing through. What started as a standing
          Saturday game has grown into a proper club — a badge, a squad, and a
          record of every match we play.
        </p>
      </section>

      {/* QUICK FACTS */}
      <section className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <StatPill label="Established" value="2025" />
        <StatPill label="Players" value="20–25" />
        <StatPill label="Match day" value="Every Sat" />
        <StatPill label="Friendlies" value="Monthly" />
      </section>

      {/* HOW WE PLAY */}
      <section>
        <SectionHeading eyebrow="Match day" title="How we play" />
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="wing-cut bg-surface border border-line p-6">
            <Badge tone="lime">Every Saturday</Badge>
            <h3 className="font-display text-xl font-semibold uppercase mt-4 mb-2">
              Two teams, one club
            </h3>
            <p className="text-sm text-muted leading-relaxed">
              With 20 to 25 players on the books, every match day we split into
              two sides and play each other. It keeps everyone on the court,
              competitive, and getting real minutes — no bench warming, no
              off-season.
            </p>
          </div>
          <div className="bg-surface border border-line rounded-lg p-6">
            <Badge tone="gold">Roughly monthly</Badge>
            <h3 className="font-display text-xl font-semibold uppercase mt-4 mb-2">
              Friendlies vs other clubs
            </h3>
            <p className="text-sm text-muted leading-relaxed">
              About once a month we put out a CrossNation side and take on
              another club in a friendly. Same badge, same stats tracking — the
              goals, assists and clean sheets from these matches count towards
              every player&apos;s season totals too.
            </p>
          </div>
        </div>
      </section>

      {/* THE BADGE */}
      <section>
        <SectionHeading eyebrow="Identity" title="The Garuda badge" />
        <p className="text-muted max-w-2xl mb-6 leading-relaxed">
          The crest is built around the Garuda — the mythical guardian bird.
          Each part of the badge honours a different kind of player in the
          squad.
        </p>
        <div className="grid sm:grid-cols-2 gap-4">
          {BADGE.map((b) => (
            <div
              key={b.name}
              className="bg-surface border border-line rounded-lg p-5"
            >
              <div className="flex items-center justify-between gap-3 mb-2">
                <p className="font-display font-semibold uppercase tracking-wide">
                  {b.name}
                </p>
                <span className="text-xs uppercase tracking-wide text-gold whitespace-nowrap">
                  {b.honors}
                </span>
              </div>
              <p className="text-sm text-muted leading-relaxed">{b.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CLOSING */}
      <section className="wing-cut bg-surface border border-line p-6 sm:p-10">
        <p className="text-xs uppercase tracking-[0.2em] text-lime mb-3">
          Est. April 2025
        </p>
        <p className="font-display text-2xl sm:text-3xl font-semibold uppercase leading-snug max-w-2xl">
          One club, one badge, and a growing history — a Saturday at a time.
        </p>
      </section>
    </div>
  );
}
