import { createMatch } from "../actions";
import { SectionHeading } from "@/components/ui";

export default function NewMatchPage() {
  return (
    <div className="max-w-lg space-y-8">
      <SectionHeading eyebrow="Fixtures" title="Announce a Match" />
      <form action={createMatch} className="bg-surface border border-line rounded-lg p-5 space-y-4">
        <div>
          <label className="block text-xs uppercase tracking-wide text-muted mb-1.5">
            Opponent
          </label>
          <input
            name="opponent"
            required
            className="w-full bg-surface-2 border border-line rounded px-3 py-2"
          />
        </div>
        <div>
          <label className="block text-xs uppercase tracking-wide text-muted mb-1.5">
            Date &amp; time
          </label>
          <input
            name="match_date"
            type="datetime-local"
            required
            className="w-full bg-surface-2 border border-line rounded px-3 py-2"
          />
        </div>
        <div>
          <label className="block text-xs uppercase tracking-wide text-muted mb-1.5">
            Venue
          </label>
          <input
            name="venue"
            className="w-full bg-surface-2 border border-line rounded px-3 py-2"
          />
        </div>
        <div>
          <label className="block text-xs uppercase tracking-wide text-muted mb-1.5">
            Home / away
          </label>
          <select
            name="home_away"
            className="w-full bg-surface-2 border border-line rounded px-3 py-2"
          >
            <option value="home">Home</option>
            <option value="away">Away</option>
            <option value="neutral">Neutral venue</option>
          </select>
        </div>
        <button
          type="submit"
          className="w-full bg-lime text-ink font-display font-semibold uppercase tracking-wide rounded py-2.5 hover:brightness-95 transition"
        >
          Create match &amp; set squad next
        </button>
      </form>
    </div>
  );
}
