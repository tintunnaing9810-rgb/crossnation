import { JoinForm } from "@/components/JoinForm";
import { SectionHeading } from "@/components/ui";

const REASONS = [
  {
    title: "Two matches every week",
    body: "20 to 25 of us split into two teams and play twice a week — plus friendlies against other clubs about once a month. No off-season.",
  },
  {
    title: "Your stats, in public",
    body: "Every goal, assist, and clean sheet you earn shows up on your own player page — not buried in a group chat.",
  },
  {
    title: "A club, not a pickup game",
    body: "Squads, positions, a badge, a history. CrossNation is building something that outlasts one match.",
  },
];

export default function JoinPage() {
  return (
    <div className="mx-auto max-w-5xl px-5 py-12 space-y-16">
      <section>
        <p className="text-xs uppercase tracking-[0.2em] text-lime mb-3">
          Join the club
        </p>
        <h1 className="font-display text-4xl sm:text-5xl font-semibold uppercase leading-tight max-w-2xl">
          Play for something with your name on it.
        </h1>
        <p className="text-muted mt-4 max-w-xl">
          CrossNation Futsal Club is looking for players. Fill in the form
          below and we&apos;ll get back to you about the next match.
        </p>
      </section>

      <section className="grid sm:grid-cols-3 gap-4">
        {REASONS.map((r) => (
          <div key={r.title} className="bg-surface border border-line rounded-lg p-5">
            <p className="font-display font-semibold uppercase mb-2">{r.title}</p>
            <p className="text-sm text-muted">{r.body}</p>
          </div>
        ))}
      </section>

      <section className="max-w-lg">
        <SectionHeading eyebrow="Get in touch" title="Request to join" />
        <JoinForm />
      </section>
    </div>
  );
}
