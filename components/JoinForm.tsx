"use client";

import { useActionState } from "react";
import { submitJoinRequest, type SubmitJoinState } from "@/app/join/actions";

const initialState: SubmitJoinState = { ok: false };

export function JoinForm() {
  const [state, formAction, pending] = useActionState(
    submitJoinRequest,
    initialState
  );

  if (state.ok) {
    return (
      <div className="bg-surface border border-lime/30 rounded-lg p-6 text-center">
        <p className="font-display text-lg text-lime uppercase mb-1">
          Request sent
        </p>
        <p className="text-sm text-muted">
          Thanks — someone from CrossNation will reach out to you directly.
        </p>
      </div>
    );
  }

  return (
    <form action={formAction} className="bg-surface border border-line rounded-lg p-6 space-y-4">
      <div>
        <label htmlFor="name" className="block text-xs uppercase tracking-wide text-muted mb-1.5">
          Your name
        </label>
        <input
          id="name"
          name="name"
          required
          className="w-full bg-surface-2 border border-line rounded px-3 py-2 text-paper focus:outline-none focus:ring-2 focus:ring-lime/50"
        />
      </div>
      <div>
        <label htmlFor="contact" className="block text-xs uppercase tracking-wide text-muted mb-1.5">
          Phone, email, or social handle
        </label>
        <input
          id="contact"
          name="contact"
          required
          className="w-full bg-surface-2 border border-line rounded px-3 py-2 text-paper focus:outline-none focus:ring-2 focus:ring-lime/50"
        />
      </div>
      <div>
        <label htmlFor="message" className="block text-xs uppercase tracking-wide text-muted mb-1.5">
          Anything you want us to know (optional)
        </label>
        <textarea
          id="message"
          name="message"
          rows={3}
          className="w-full bg-surface-2 border border-line rounded px-3 py-2 text-paper focus:outline-none focus:ring-2 focus:ring-lime/50"
        />
      </div>
      {state.error && (
        <p className="text-sm text-red-400">{state.error}</p>
      )}
      <button
        type="submit"
        disabled={pending}
        className="w-full bg-lime text-ink font-display font-semibold uppercase tracking-wide rounded py-3 hover:brightness-95 transition disabled:opacity-60"
      >
        {pending ? "Sending…" : "I want in"}
      </button>
    </form>
  );
}
