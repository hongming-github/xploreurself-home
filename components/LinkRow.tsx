import Link from "next/link";
import type { LinkItem } from "@/content/types";

// A leading "/" means this site's own route (currently only the P4
// deep-dive articles — everything else here is a full https:// URL or a
// mailto:). That distinction decides which element renders: next/link for
// the former, a plain <a> for the latter. This isn't just style — it's
// what makes the View Transition between a project row and its article
// (components/ProjectRow.tsx) possible at all. A <ViewTransition> only
// activates on a client-side navigation the router itself sees; a bare
// <a href> is a full page load as far as React is concerned, so it would
// silently skip the transition rather than error, and the bug would be
// invisible without knowing to go look for it. External links stay plain
// <a> tags on purpose — they're leaving the app, so there is no client-side
// router to hand them to in the first place.
function isInternalHref(href: string): boolean {
  return href.startsWith("/");
}

// Renders a project's link group (e.g. "GitHub" on AI Detective, "Live" on
// What to Eat, "Read the write-up" on redblue/jobagent) as a short inline
// row. The contact block used to share this component, back when it also
// rendered as a row of translated labels; it now wants a fixed vertical
// layout of literal values instead, which is different enough that it
// lives in its own component, ContactLinks — see that file for why. An item
// with no `href` (see content/types.ts) renders as plain inert text — never
// an <a> with a href that 404s, and never a styled "coming soon" label.
// This is the one rule (docs/plan.md decision 5) this component exists to
// enforce structurally: it's impossible to accidentally render a dead link,
// because the branches below only ever emit a link element when a real
// href is present.
export function LinkRow({ items }: { items: LinkItem[] }) {
  const linkClassName =
    "text-text underline decoration-border underline-offset-4 hover:text-accent hover:decoration-accent";

  return (
    <div className="flex flex-wrap items-center gap-x-1.5 gap-y-1 font-mono text-sm">
      {items.map((item, index) => (
        <span key={item.label} className="flex items-center gap-x-1.5">
          {item.href ? (
            isInternalHref(item.href) ? (
              <Link href={item.href} className={linkClassName}>
                {item.label}
              </Link>
            ) : (
              <a href={item.href} className={linkClassName}>
                {item.label}
              </a>
            )
          ) : (
            <span className="text-text-muted opacity-60">{item.label}</span>
          )}
          {index < items.length - 1 && (
            <span aria-hidden="true" className="text-text-muted">
              ·
            </span>
          )}
        </span>
      ))}
    </div>
  );
}
