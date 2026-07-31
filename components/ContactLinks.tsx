import { Fragment, type ComponentType } from "react";
import { Mail } from "lucide-react";
import { GithubIcon, LinkedinIcon } from "@/components/BrandIcons";
import type { ContactIconKey } from "@/content/facts";
import type { ContactItem } from "@/content/types";

// The three icon sources don't share an exact type: lucide's Mail is a
// ForwardRefExoticComponent (it supports ref forwarding); GithubIcon and
// LinkedinIcon are plain function components (they don't need a ref, so
// components/BrandIcons.tsx doesn't add forwardRef machinery that would
// exist only to satisfy this Record's type). Both shapes are still
// ordinary React components callable as `<Icon ... />`, so the Record
// below is typed against just the props this file actually passes at the
// call site, not against either library's full component type.
type ContactIcon = ComponentType<{
  size?: number;
  className?: string;
  "aria-hidden"?: boolean | "true" | "false";
}>;

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

// content/facts.ts stores which icon a row gets as a plain string key, not
// a component reference, so that file stays free of a React import. This
// map is the one place that name gets turned into an actual icon
// component — the same "name in data, component at the render edge" split
// ThemeToggle.tsx uses for its OPTIONS array.
//
// Mail comes from lucide-react (email has no brand — a generic envelope
// is correct); Github/Linkedin come from components/BrandIcons.tsx, hand
// inlined SVGs, NOT a lucide swap-back candidate — see that file's header
// comment for why lucide has no brand glyphs to import in the first place
// (verified against the installed package, not assumed).
const ICONS: Record<ContactIconKey, ContactIcon> = {
  mail: Mail,
  github: GithubIcon,
  linkedin: LinkedinIcon,
};

// 2026-07-31 addition: a small icon ahead of each value, purely as a
// wayfinding aid — the value itself already says what the service is (the
// domain is right there in the text), so the icon is not load-bearing
// content. Two consequences follow from that:
//
//   - `aria-hidden="true"` on every icon. A screen reader that announced
//     both the icon's implicit label ("mail icon") and the adjacent value
//     ("hi@xploreurself.com") would say the same thing twice for no reason;
//     the anchor's own text is already the full, correct announcement.
//   - `text-muted`, not full-contrast `text`. Values keep full contrast
//     (they're the content); icons stay quiet so they read as structure
//     around the content instead of competing with it — same "metadata
//     stays muted, substance stays full-contrast" rule SectionHeading.tsx
//     and content/types.ts apply elsewhere on the page.
//
// Grid layout, not an inline flex per row: `grid-cols-[auto_1fr]` is the
// same trick ProjectRow.tsx uses to align MetricPair's label column — the
// `auto` track sizes itself to the widest icon once, for the whole grid,
// so every value starts at the same x regardless of which icon sits next
// to it. Icon and value are rendered as direct grid children (a Fragment,
// no wrapping row <div>) for the same reason MetricPair does: Tailwind's
// grid-template-columns only positions direct children, and an extra
// wrapper element would break that. `items-center` on the grid centers
// each icon against its row's line height, since a 14px glyph next to
// 14px text would otherwise sit a hair high (icon glyphs are usually
// vertically centered within their own box, not baseline-aligned).
export function ContactLinks({ items }: { items: ContactItem[] }) {
  return (
    <div className="grid grid-cols-[auto_1fr] items-center gap-x-2 gap-y-1 font-mono text-sm">
      {items.map((item) => {
        const Icon = ICONS[item.icon];
        return (
          // Fragment (not a bare <>...</>) because this map callback, unlike
          // MetricPair's, needs a `key` of its own — MetricPair's Fragment
          // gets its key from the <MetricPair key={...} /> call site one
          // level up; here the two grid children are produced inline, so
          // the key has to go on the Fragment wrapping them directly.
          <Fragment key={item.href}>
            <Icon aria-hidden="true" size={14} className="text-text-muted" />
            <a
              href={item.href}
              className="w-fit max-w-full break-all text-text underline decoration-border underline-offset-4 hover:text-accent hover:decoration-accent"
            >
              {item.value}
            </a>
          </Fragment>
        );
      })}
    </div>
  );
}
