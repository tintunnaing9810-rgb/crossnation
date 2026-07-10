"use client";

import { useActionState } from "react";
import { login, type LoginState } from "@/app/admin/login/actions";

const initialState: LoginState = {};

export function LoginForm() {
  const [state, formAction, pending] = useActionState(login, initialState);

  return (
    <form action={formAction} className="space-y-4">
      <div>
        <label htmlFor="email" className="block text-xs uppercase tracking-wide text-muted mb-1.5">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="username"
          className="w-full bg-surface-2 border border-line rounded px-3 py-2 text-paper focus:outline-none focus:ring-2 focus:ring-lime/50"
        />
      </div>
      <div>
        <label htmlFor="password" className="block text-xs uppercase tracking-wide text-muted mb-1.5">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          autoComplete="current-password"
          className="w-full bg-surface-2 border border-line rounded px-3 py-2 text-paper focus:outline-none focus:ring-2 focus:ring-lime/50"
        />
      </div>
      {state.error && <p className="text-sm text-red-400">{state.error}</p>}
      <button
        type="submit"
        disabled={pending}
        className="w-full bg-lime text-ink font-display font-semibold uppercase tracking-wide rounded py-3 hover:brightness-95 transition disabled:opacity-60"
      >
        {pending ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}
