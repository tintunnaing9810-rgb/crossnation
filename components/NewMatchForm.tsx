"use client";

import { useState } from "react";
import { createMatch } from "@/app/admin/(protected)/matches/actions";
import type { MatchType } from "@/lib/types";

export function NewMatchForm() {
  const [type, setType] = useState<MatchType>("internal");
  const isFriendly = type === "friendly";

  return (
    <form
      action={createMatch}
      className="bg-surface border border-line rounded-lg p-5 space-y-4"
    >
      <div>
        <label className="block text-xs uppercase tracking-wide text-muted mb-1.5">
          Match type
        </label>
        <select
          name="match_type"
          value={type}
          onChange={(e) => setType(e.target.value as MatchType)}
          className="w-full bg-surface-2 border border-line rounded px-3 py-2"
        >
          <option value="internal">Internal — two-team match day</option>
          <option value="friendly">Friendly — vs another club</option>
        </select>
      </div>

      <div>
        <label className="block text-xs uppercase tracking-wide text-muted mb-1.5">
          {isFriendly ? "Opponent club" : "Match label (optional)"}
        </label>
        <input
          name="opponent"
          required={isFriendly}
          placeholder={isFriendly ? "e.g. Riverside FC" : "e.g. Whites vs Blacks"}
          className="w-full bg-surface-2 border border-line rounded px-3 py-2"
        />
        {!isFriendly && (
          <p className="text-xs text-muted mt-1.5">
            Leave blank to just call it “Internal match day”.
          </p>
        )}
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

      {isFriendly && (
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
      )}

      <button
        type="submit"
        className="w-full bg-lime text-ink font-display font-semibold uppercase tracking-wide rounded py-2.5 hover:brightness-95 transition"
      >
        Create match &amp; set squad next
      </button>
    </form>
  );
}
