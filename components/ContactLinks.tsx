import type { LinkItem } from "@/content/types";

// The contact block (2026-07-31 decision): three literal values — email,
// GitHub, LinkedIn — always stacked one per line, in every viewport. That's
// a different job from LinkRow, which renders an inline row of short *link
// labels* for a project's link group (e.g. "GitHub · Live") and is allowed
// to wrap. Parameterizing LinkRow with a "stacked vs inline" boolean would
// make its one prop lie about what it renders depending on a flag reader
// can't see at the call site; a second small component says the same thing
// the JSX already does; this one always stacks, that one always flows.
//
// Monospace throughout — not just for the values but the whole block —
// because these are copyable data (an address, two URLs), the same
// treatment MetricPair gives numbers elsewhere on the page: "data, not
// prose" per docs/plan.md's design system section.
//
// `break-all` matters at narrow widths: URL-shaped values like the GitHub
// and LinkedIn lines have no spaces for the browser to wrap on, so without
// it a long value would either overflow or force horizontal scroll on the
// whole page. Kept even now that the LinkedIn slug is short, since this
// component can't assume the values it's handed will always stay short.
export function ContactLinks({ items }: { items: LinkItem[] }) {
  return (
    <div className="flex min-w-0 flex-col gap-1 font-mono text-sm">
      {items.map((item) => (
        <a
          key={item.href}
          href={item.href}
          className="w-fit max-w-full break-all text-text underline decoration-border underline-offset-4 hover:text-accent hover:decoration-accent"
        >
          {item.label}
        </a>
      ))}
    </div>
  );
}
