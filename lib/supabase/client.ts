import { createBrowserClient } from "@supabase/ssr";

// Used inside Client Components ("use client"). Reads the public
// URL and anon key — safe to expose in the browser, RLS in the
// database is what actually enforces read/write permissions.
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
