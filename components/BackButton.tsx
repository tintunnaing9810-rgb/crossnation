"use client";

import { useRouter } from "next/navigation";

// Small "← Back" control shown at the top of drill-down pages (player
// profiles, match details, admin sub-pages) so phone users don't have to
// reach for the browser's back button.
export function BackButton() {
  const router = useRouter();
  return (
    <button
      type="button"
      onClick={() => router.back()}
      className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-paper transition-colors"
    >
      <span aria-hidden>&larr;</span> Back
    </button>
  );
}
