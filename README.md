# CrossNation Futsal Club — Web App

A real public site + password-protected admin for CrossNation Futsal Club:

- **Public** — Match Center (upcoming match + latest result), Squad, player
  profiles with computed stats, results archive, and a "join the club" page
  with an interest-request form.
- **Admin** (`/admin`, real login required) — add/edit players, announce a
  match and set the matchday squad, and record the final result (score,
  goals, assists, cards, clean sheet, MOTM per player).

Player stats are never hand-edited. Every number on a player's profile is
computed from the match results you log — see `supabase/schema.sql` for the
`player_totals` view that does this.

Stack: **Next.js 16 (App Router) + TypeScript + Tailwind CSS + Supabase**
(Postgres database + real server-verified authentication), deployed on
**Vercel**.

---

## 1. Create your Supabase project

1. Go to [database.new](https://database.new) and create a new project.
   Save the database password it gives you somewhere safe.
2. Once it's ready, open **SQL Editor** (left sidebar) → **New query**.
3. Paste the entire contents of `supabase/schema.sql` from this project and
   run it. This creates all the tables, the `player_totals` view, and the
   security rules (RLS policies) that make the public site read-only and the
   admin write-only-when-logged-in.
4. Go to **Project Settings → API**. You'll need two values from here in
   step 3 below:
   - **Project URL**
   - **anon / public key** (sometimes shown as "publishable key")

## 2. Create your admin login

There is deliberately **no public sign-up page** — you are the only person
who should be able to log in.

1. In the Supabase dashboard, go to **Authentication → Users**.
2. Click **Add user → Create new user**.
3. Enter the email and password you want to log in with, and make sure
   **Auto Confirm User** is switched on (so you don't need to click an email
   confirmation link).

That email + password is what you'll use at `/admin/login`.

## 3. Configure environment variables

Copy `.env.local.example` to `.env.local`:

```bash
cp .env.local.example .env.local
```

Open `.env.local` and fill in the two values from Supabase step 1.4:

```
NEXT_PUBLIC_SUPABASE_URL=https://YOUR-PROJECT-REF.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR-ANON-KEY
```

The anon key is safe to expose in the browser — on its own it can't read or
write anything the RLS policies don't allow. It is **not** the same as the
"service_role" key; never use the service_role key in this app.

## 4. Run it locally

```bash
npm install
npm run dev
```

Visit `http://localhost:3000` for the public site, and
`http://localhost:3000/admin/login` to sign in with the account you made in
step 2.

## 5. Deploy to Vercel

1. Push this project to a GitHub repository.
2. Go to [vercel.com/new](https://vercel.com/new) and import that repo.
3. When it asks for environment variables, add the same two from step 3:
   `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
4. Deploy. That's it — no separate backend to stand up, Supabase *is* the
   backend.

Your public site is now live at the Vercel URL (or your own domain, if you
attach one in Vercel's project settings). `/admin/login` is right there on
the same domain, gated by the real login you set up in step 2.

---

## Weekly workflow

1. **Announce the match** — `/admin/matches/new`, then you'll land on the
   squad page to tick who's in.
2. **After the match** — `/admin/matches` → *Enter result* on that fixture.
   Put in the final score and, per player, goals / assists / cards / clean
   sheet, plus one MOTM pick. Save — the public site updates immediately,
   nothing else to touch.
3. Check `/admin` (dashboard) any time for people who've submitted the
   "join CrossNation" interest form.

## Deliberate design decisions worth knowing about

- **No live score ticking.** You asked for pre-match announcement + final
  result only — this app has no real-time scoring feature. Adding one later
  is possible but is a materially bigger build (see the "Fotmob" discussion
  in chat for why).
- **No hard-delete on players.** Removing a player would cascade-delete
  their historical match stats. "Mark inactive" hides them from the public
  squad list while keeping their stats and past match appearances intact.
- **Squad selection is separate from the player roster.** The roster
  (`players` table) is edited rarely; who's selected for a given Saturday
  (`match_squad`) changes every week. Keeping these as separate tables is
  what stops you from having to re-add players every match.
- **Cards are logged per match only** — no suspension-after-3-yellows
  tracking, per your call earlier. The `yellow_cards`/`red_cards` columns
  are there if you want to add that logic later; the totals already
  accumulate season-wide on each player's profile.

## Project structure

```
app/
  page.tsx                    Home / Match Center (public)
  squad/page.tsx               Squad list (public)
  players/[id]/page.tsx        Player profile (public)
  results/, results/[id]/      Results archive + match detail (public)
  join/                        Recruitment page + interest form (public)
  admin/login/                 Login page (public, no chrome)
  admin/(protected)/           Everything below requires a session:
    page.tsx                    Dashboard (join requests inbox, quick links)
    players/                    Roster management
    matches/                    Fixture creation, squad selection, results
lib/
  supabase/                    Client, server, and proxy (auth) helpers
  queries.ts                   All public read queries
  types.ts                     Shared TypeScript types
supabase/schema.sql             Run this once in the Supabase SQL editor
proxy.ts                        Enforces the /admin login wall (Next.js 16's
                                 renamed "middleware" convention)
```

## Extending this later

Not built now, but the data model supports adding:

- A photo gallery / media page
- A "why join" story page with more brand content
- Live score updates during a match (bigger change — see note above)
- Card-accumulation / suspension tracking
