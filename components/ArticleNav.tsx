import Link from "next/link";
import { ThemeToggle } from "./ThemeToggle";

// Deep-dive articles are English-only (docs/plan.md decision 4), so
// components/LocaleSwitch.tsx has nothing to offer here — every entry it
// renders points at a /zh path that doesn't exist for this route. Article
// pages get this sibling component instead: a plain way back to the
// homepage, in place of a locale chooser with a broken option. Kept a
// Server Component (unlike components/Nav.tsx, which has to be a Client
// Component for its scroll-position tracking) — a static link and an
// icon-only toggle need no browser state of their own here, and
// ThemeToggle already carries its own "use client" boundary internally, the
// same "island" pattern app/[locale]/page.tsx already uses <Nav> for.
//
// href is the literal string "/en", not a variable — this component only
// ever renders on an /en/work/... route (there is no /zh/work/...), so
// there's no locale to thread through.
export function ArticleNav() {
  return (
    <nav
      aria-label="Article"
      className="sticky top-0 z-10 border-b border-border bg-bg/80 backdrop-blur"
    >
      <div className="mx-auto flex w-full max-w-[68ch] items-center justify-between gap-3 px-6 py-3 sm:px-8">
        <Link
          href="/en"
          className="font-mono text-[11px] uppercase tracking-[0.06em] text-text-muted transition-colors hover:text-text sm:text-xs"
        >
          ← Work
        </Link>
        <ThemeToggle />
      </div>
    </nav>
  );
}
