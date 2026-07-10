"use client";

import { PLAYER_STATUSES } from "@/lib/types";
import type { PlayerStatus } from "@/lib/types";

// Inline status picker for the admin roster. Submits its form (a server
// action) as soon as a new status is chosen — no separate save button.
export function PlayerStatusControl({
  current,
  action,
}: {
  current: PlayerStatus;
  action: (formData: FormData) => void;
}) {
  return (
    <form action={action}>
      <select
        name="status"
        defaultValue={current}
        onChange={(e) => e.currentTarget.form?.requestSubmit()}
        className="bg-surface-2 border border-line rounded px-2 py-1 text-sm text-paper"
        aria-label="Player status"
      >
        {PLAYER_STATUSES.map((s) => (
          <option key={s.value} value={s.value}>
            {s.label}
          </option>
        ))}
      </select>
    </form>
  );
}
