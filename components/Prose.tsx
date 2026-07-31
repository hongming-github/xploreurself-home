import type { MDXComponents } from "mdx/types";

// Typography container for long-form copy. docs/plan.md section 4 requires
// body content to cap out at 68 characters wide — the classic readability
// constraint for justified prose — "and deep-dive pages use the same width".
// This wraps both the homepage's positioning paragraph (plain JSX, phase
// P2) and, as of phase P4, an entire compiled MDX article
// (app/[locale]/work/[slug]/page.tsx renders `<Prose><Article /></Prose>`).
//
// It sets its own max-width rather than assuming a parent already did,
// because the deep-dive pages don't share the homepage's outer layout
// wrapper — this component needs to be correct on its own.
export function Prose({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto w-full max-w-[68ch] space-y-4 leading-[1.65] text-text">
      {children}
    </div>
  );
}

// --- MDX element components ---------------------------------------------
//
// mdx-components.tsx (project root, required by @next/mdx for the App
// Router) wires this map in globally, so every content/work/*.mdx file's
// compiled markdown renders through these instead of bare HTML tags. They
// live here, next to <Prose>, because that's the one place they're ever
// used — a compiled MDX article is always rendered inside a <Prose>.
//
// Tailwind's `space-y-4` on <Prose> above already puts a gap between every
// direct child (paragraphs, headings, the table/code wrappers below all
// count as direct children, since a compiled MDX component's own top-level
// Fragment doesn't add a DOM node in between). Headings add their own
// larger `mt-*` on top of that gap — Tailwind v4 generates `space-y-*`
// selectors with `:where()` (zero specificity) specifically so a plain
// utility class like `mt-10` on a child can outrank it without a fight.

function ProseH2({ children }: { children?: React.ReactNode }) {
  // Same vocabulary as components/SectionHeading.tsx — mono, uppercase,
  // tracked out, full-contrast `text` rather than `text-muted` — for the
  // same reason docs/plan.md section 4 gives that component: a heading is
  // a structural signpost, not metadata, so it doesn't get the muted
  // treatment reserved for dates and tags. "No large size jumps" (the same
  // section) is why this stays at 13px instead of stepping up in size the
  // way a marketing page's <h2> would.
  return (
    <h2 className="mt-10 mb-1 font-mono text-[13px] font-medium uppercase tracking-[0.08em] text-text">
      {children}
    </h2>
  );
}

function ProseH3({ children }: { children?: React.ReactNode }) {
  // Neither article currently has a level-3 heading, but the design
  // system's own component list (docs/plan.md section 4) treats headings
  // as a shared vocabulary, not something to define lazily the first time
  // it's needed — so this exists now, one step down from ProseH2 in size
  // and tracking, same full-contrast colour.
  return (
    <h3 className="mt-8 mb-1 font-mono text-xs font-medium uppercase tracking-[0.06em] text-text">
      {children}
    </h3>
  );
}

function ProseP({ children }: { children?: React.ReactNode }) {
  return <p className="text-text">{children}</p>;
}

function ProseLink({
  href,
  children,
}: {
  href?: string;
  children?: React.ReactNode;
}) {
  // The one explicit brief for prose links: use the `accent` token, not
  // the site's usual "text colour by default, accent on hover" treatment
  // (compare components/Footer.tsx / components/LinkRow.tsx) — an inline
  // link inside a paragraph needs to read as a link at rest, since it
  // isn't already set apart by position the way a link row is.
  return (
    <a
      href={href}
      className="text-accent underline decoration-accent/40 underline-offset-4 hover:decoration-accent"
    >
      {children}
    </a>
  );
}

function ProseCode({
  className,
  children,
}: {
  className?: string;
  children?: React.ReactNode;
}) {
  // MDX's default pipeline stamps a `language-xxx` class onto the <code>
  // inside a fenced block (here always `language-text` — see ProsePre
  // below for why nothing highlights it) but leaves inline `code spans`
  // with no class at all. That difference is what tells this component
  // which of the two it's rendering, without needing a second, differently
  // named override.
  if (className) {
    // Block form: ProsePre already supplies the bg-subtle/border/scroll
    // treatment on its own <pre>, so this just needs to not fight it with
    // a second background.
    return <code className={className}>{children}</code>;
  }
  // Inline form (`ASR@k`, `qwen3.5:9b`) — a small mono badge using the same
  // bg-subtle token docs/plan.md section 4 assigns to code generally.
  return (
    <code className="rounded bg-subtle px-1 py-0.5 font-mono text-[0.9em] text-text">
      {children}
    </code>
  );
}

function ProsePre({ children }: { children?: React.ReactNode }) {
  // `overflow-x-auto` directly on <pre> — no extra wrapping <div> needed,
  // unlike ProseTable below, because a <pre> already establishes its own
  // block-level scroll container. This is the literal P4 requirement: a
  // wide code block scrolls *inside itself* at 375px, it never pushes the
  // page body wider than the viewport. No syntax highlighting (constraint:
  // no new dependency for it) — these render as plain mono text on
  // bg-subtle, the same "this is data, not prose" treatment the rest of
  // the site already gives tech-stack tags and metric numbers.
  return (
    <pre className="overflow-x-auto rounded border border-border bg-subtle p-4 font-mono text-sm leading-normal text-text">
      {children}
    </pre>
  );
}

function ProseTable({ children }: { children?: React.ReactNode }) {
  // The wrapping <div>, not the <table> itself, is the scroll container —
  // same "must not break the layout at 375px" requirement as ProsePre
  // above, just needing an extra element here because a bare <table>
  // doesn't reliably act as its own scroll boundary the way <pre> does.
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse text-sm">{children}</table>
    </div>
  );
}

function ProseTh({ children }: { children?: React.ReactNode }) {
  // Column headers are structural signposts, same reasoning as ProseH2 —
  // full-contrast `text`, not `text-muted`.
  return (
    <th className="border-b border-border px-3 py-2 text-left font-mono text-xs font-medium uppercase tracking-[0.06em] text-text">
      {children}
    </th>
  );
}

function ProseTd({ children }: { children?: React.ReactNode }) {
  return (
    <td className="border-b border-border px-3 py-2 align-top text-text">
      {children}
    </td>
  );
}

function ProseTr({ children }: { children?: React.ReactNode }) {
  // Zebra striping on `bg-subtle` — docs/plan.md section 4's token table
  // assigns that colour to exactly this ("代码块、表格斑马纹", code blocks
  // and table zebra stripes), so this is the second of the two places that
  // token was already earmarked for, not a new visual choice. `even:` is
  // safe against the header row too: <thead>'s one <tr> and <tbody>'s rows
  // are counted separately (:nth-child counts among siblings under the
  // same parent), so the header never picks up a stripe.
  return <tr className="even:bg-subtle">{children}</tr>;
}

function ProseUl({ children }: { children?: React.ReactNode }) {
  return <ul className="list-disc space-y-1 pl-5 text-text">{children}</ul>;
}

function ProseOl({ children }: { children?: React.ReactNode }) {
  return (
    <ol className="list-decimal space-y-1 pl-5 text-text">{children}</ol>
  );
}

function ProseLi({ children }: { children?: React.ReactNode }) {
  return <li className="text-text">{children}</li>;
}

export const mdxComponents: MDXComponents = {
  h2: ProseH2,
  h3: ProseH3,
  p: ProseP,
  a: ProseLink,
  code: ProseCode,
  pre: ProsePre,
  table: ProseTable,
  th: ProseTh,
  td: ProseTd,
  tr: ProseTr,
  ul: ProseUl,
  ol: ProseOl,
  li: ProseLi,
};
