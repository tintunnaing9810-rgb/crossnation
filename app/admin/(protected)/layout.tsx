import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { logout } from "@/app/admin/login/actions";
import { NavLinks } from "@/components/NavLinks";

const ADMIN_LINKS = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/matches", label: "Matches" },
  { href: "/admin/players", label: "Players" },
];

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="min-h-screen">
      <div className="border-b border-line bg-surface">
        <div className="mx-auto max-w-5xl px-5 h-14 flex items-center justify-between">
          <nav className="flex items-center gap-5 text-sm font-display uppercase tracking-wide">
            <NavLinks links={ADMIN_LINKS} />
          </nav>
          <div className="flex items-center gap-4 text-sm text-muted">
            <span className="hidden sm:inline">{user?.email}</span>
            <Link href="/" className="hover:text-paper transition-colors">
              View site
            </Link>
            <form action={logout}>
              <button className="hover:text-paper transition-colors" type="submit">
                Sign out
              </button>
            </form>
          </div>
        </div>
      </div>
      <div className="mx-auto max-w-5xl px-5 py-10">{children}</div>
    </div>
  );
}
