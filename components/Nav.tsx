"use client";

import { useEffect, useState } from "react";
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
// IntersectionObserver is a browser API for exactly this ("tell me when this
// element crosses into view"), which is why the component needs to mount in
// the browser and hold state (`activeId`) that only makes sense there.
export function Nav({ items }: { items: NavItem[] }) {
  const [activeId, setActiveId] = useState(items[0]?.id);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        }
      },
      // rootMargin shrinks the area IntersectionObserver actually watches
      // down to a thin horizontal strip just below the sticky bar, instead
      // of the whole viewport. Without this, a section that merely *touches*
      // the bottom edge of a tall viewport would count as "intersecting" —
      // with it, a section only counts once it reaches that strip near the
      // top, which is what makes the highlight track "which section's
      // heading is currently under the bar" instead of "which section is
      // anywhere on screen".
      { rootMargin: "-96px 0px -70% 0px", threshold: 0 },
    );

    const elements = items
      .map((item) => document.getElementById(item.id))
      .filter((el): el is HTMLElement => el !== null);

    for (const el of elements) observer.observe(el);
    return () => observer.disconnect();
  }, [items]);

  return (
    <nav
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
