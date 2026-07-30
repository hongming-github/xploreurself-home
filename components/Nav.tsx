"use client";

import { useEffect, useRef, useState } from "react";
import { LocaleSwitch } from "./LocaleSwitch";
import { ThemeToggle } from "./ThemeToggle";

interface NavItem {
  id: string;
  label: string;
}

// Why this has to be a Client Component (the third one in the project, after
// ThemeToggle and LocaleSwitch, for the same underlying reason as both):
// figuring out which section is "active" means knowing where the user has
// scrolled *to* — that's live browser scroll position, which simply doesn't
// exist yet when `next build` renders this page once, ahead of time, on the
// server. A Server Component only ever gets one shot at rendering, before
// any scrolling has happened; there's no request-time hook it could sit in
// even if we wanted one, because this route is static (no `force-dynamic`).
//
// The obvious way to track "which section is under the bar" is
// IntersectionObserver — that's the idiomatic, performant browser API for
// exactly this, and it's worth naming why it isn't used here. IntersectionObserver
// only tells you about a *region* of the viewport (via `rootMargin`), shrunk
// down to a thin strip just below the sticky bar. That works right up until
// the last section is shorter than the strip is tall: the page simply cannot
// scroll far enough to ever lift that section's heading into the strip, so
// it can never fire "intersecting" and its nav link can never light up —
// even while it's the only thing on screen. The correct strip size to avoid
// that depends on the last section's height, the footer's height, and the
// viewport, all of which change as content changes, so there's no fixed
// rootMargin that stays correct. Rather than chase that with a wider and
// wider margin, this reads scroll position directly and computes the answer,
// plus a hard rule for "scrolled to the bottom" that makes the last section
// win regardless of its height.
export function Nav({ items }: { items: NavItem[] }) {
  const [activeId, setActiveId] = useState(items[0]?.id);
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const elements = items
      .map((item) => document.getElementById(item.id))
      .filter((el): el is HTMLElement => el !== null);

    if (elements.length === 0) return;

    const updateActive = () => {
      const nav = navRef.current;
      if (!nav) return;

      // End-of-page rule: once there's no more room to scroll, the reader is
      // looking at whatever the last section is, full stop — regardless of
      // how short it is or where its heading happens to sit relative to the
      // bar. `maxScroll <= 0` means the whole page fits in the viewport (no
      // scrolling is possible at all), which is excluded here so that case
      // falls through to the ordinary position-based check below instead of
      // permanently pinning the last link active.
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      if (maxScroll > 0 && window.scrollY >= maxScroll - 2) {
        setActiveId(items[items.length - 1].id);
        return;
      }

      // Threshold line: just below the sticky bar. Read the bar's own
      // rendered height live (via getBoundingClientRect) rather than
      // hardcode it, since it can change with viewport width (the labels
      // wrap or the gap changes at the `sm:` breakpoint) — a magic-number
      // threshold would drift out of sync with the actual bar. The +8px
      // buffer means a section has to clear the bar with a little room to
      // spare before it's considered "under" it, rather than flipping the
      // instant its heading is merely level with the bar's bottom edge.
      const threshold = nav.getBoundingClientRect().height + 8;

      // A section becomes active once its top edge has scrolled up past the
      // threshold. Sections are laid out in document order (work, then
      // experience, then education), so the *last* one that has passed the
      // line is the one currently sitting under the bar — this mirrors how
      // scrollspy implementations work in plain JS outside React too.
      let current = elements[0].id;
      for (const el of elements) {
        if (el.getBoundingClientRect().top <= threshold) {
          current = el.id;
        } else {
          break;
        }
      }
      setActiveId(current);
    };

    // Run once on mount so the initial highlight is right without requiring
    // the reader to scroll first (e.g. after a hard refresh mid-page, or a
    // direct link to `#experience`).
    updateActive();

    // { passive: true } tells the browser this listener never calls
    // preventDefault(), so scrolling itself doesn't have to wait on it —
    // the browser equivalent of "read-only, non-blocking". No rAF batching
    // here: the work per event is a handful of getBoundingClientRect() reads
    // on three known elements, cheap enough to run on every scroll tick
    // directly, and skipping rAF sidesteps the risk of it being throttled to
    // zero callbacks in a backgrounded/hidden tab.
    window.addEventListener("scroll", updateActive, { passive: true });
    // Geometry (the bar's height, each section's position) depends on
    // viewport size, so a resize can change the right answer even without
    // any scrolling.
    window.addEventListener("resize", updateActive);

    return () => {
      window.removeEventListener("scroll", updateActive);
      window.removeEventListener("resize", updateActive);
    };
  }, [items]);

  return (
    <nav
      ref={navRef}
      aria-label="Sections"
      className="sticky top-0 z-10 border-b border-border bg-bg/80 backdrop-blur"
    >
      <div className="mx-auto flex w-full max-w-[68ch] items-center justify-between gap-3 px-6 py-3 sm:px-8">
        <div className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.06em] sm:gap-4 sm:text-xs">
          {items.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              aria-current={activeId === item.id ? "true" : undefined}
              className={`transition-colors motion-reduce:transition-none ${
                activeId === item.id
                  ? "text-text"
                  : "text-text-muted hover:text-text"
              }`}
            >
              {item.label}
            </a>
          ))}
        </div>
        <div className="flex shrink-0 items-center gap-3">
          <LocaleSwitch />
          <ThemeToggle />
        </div>
      </div>
    </nav>
  );
}
