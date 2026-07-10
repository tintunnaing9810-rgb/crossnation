import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

// Used inside Server Components, Server Actions, and Route Handlers.
// Reads/writes the session via HTTP-only cookies, so the admin's
// login session never touches client-side JS.
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Called from a Server Component — safe to ignore.
            // The middleware below refreshes the session on every
            // request, so writes there keep things in sync.
          }
        },
      },
    }
  );
}
