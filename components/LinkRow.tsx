import type { LinkItem } from "@/content/types";

// Renders the contact row (identity/contact links) as well as any per-project
// link group. An item with no `href` (see content/types.ts) renders as plain
// inert text — never an <a> with a href that 404s, and never a styled
// "coming soon" label. This is the one rule (docs/plan.md decision 5) this
// component exists to enforce structurally: it's impossible to accidentally
// render a dead link, because the branch below only ever emits an <a> tag
// when a real href is present.
export function LinkRow({ items }: { items: LinkItem[] }) {
  return (
    <div className="flex flex-wrap items-center gap-x-1.5 gap-y-1 font-mono text-sm">
      {items.map((item, index) => (
        <span key={item.label} className="flex items-center gap-x-1.5">
          {item.href ? (
            <a
              href={item.href}
              className="text-text underline decoration-border underline-offset-4 hover:text-accent hover:decoration-accent"
            >
              {item.label}
            </a>
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
