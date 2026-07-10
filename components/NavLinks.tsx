"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

// Renders the nav links and highlights the one for the current page in
// white (text-paper). Used by both the public header and the admin bar.
export function NavLinks({
  links,
}: {
  links: { href: string; label: string }[];
}) {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (pathname === href) return true;
    // If another tab lives under this href (e.g. /admin is the parent of
    // /admin/matches), only light it up on an exact match — otherwise the
    // parent tab would stay active on every child page.
    const isParent = links.some(
      (l) => l.href !== href && l.href.startsWith(href + "/")
    );
    if (isParent) return false;
    return pathname.startsWith(href + "/");
  };

  return (
    <>
      {links.map((l) => {
        const active = isActive(l.href);
        return (
          <Link
            key={l.href}
            href={l.href}
            aria-current={active ? "page" : undefined}
            className={
              active
                ? "text-paper"
                : "text-muted hover:text-paper transition-colors"
            }
          >
            {l.label}
          </Link>
        );
      })}
    </>
  );
}
