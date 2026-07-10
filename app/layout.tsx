import type { Metadata } from "next";
import { Oswald, Inter } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const oswald = Oswald({
  variable: "--font-oswald",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CrossNation Futsal Club",
  description:
    "CrossNation Futsal Club — fixtures, results, and player stats.",
};

const NAV_LINKS = [
  { href: "/", label: "Match Center" },
  { href: "/squad", label: "Squad" },
  { href: "/results", label: "Results" },
  { href: "/join", label: "Join" },
];

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${oswald.variable} ${inter.variable} h-full`}
    >
      <body className="min-h-full flex flex-col bg-ink text-paper antialiased">
        <header className="border-b border-line sticky top-0 z-40 bg-ink/95 backdrop-blur">
          <div className="mx-auto max-w-5xl px-5 h-16 flex items-center justify-between">
            <Link href="/" className="font-display font-semibold tracking-wide text-lg">
              CROSS<span className="text-lime">NATION</span>
            </Link>
            <nav className="flex items-center gap-6 text-sm font-display uppercase tracking-wide">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-muted hover:text-paper transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>
        </header>

        <main className="flex-1">{children}</main>

        <footer className="border-t border-line mt-16">
          <div className="mx-auto max-w-5xl px-5 py-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-sm text-muted">
            <span>CrossNation Futsal Club &middot; Est. 2025</span>
            <Link href="/admin/login" className="hover:text-paper transition-colors">
              Club login
            </Link>
          </div>
        </footer>
      </body>
    </html>
  );
}
