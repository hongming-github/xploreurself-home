"use client";

// Why this is a Client Component already, even though it does nothing yet:
// its eventual job (phase P3) is "switch locale while staying on the same
// path", which needs the `usePathname` hook — a Client-only hook, since
// pathname is browser navigation state, not something a Server Component
// can read. Marking it "use client" now means the component's type never
// has to change later; only its body grows. For this phase it renders two
// static labels and nothing is wired to a route, on purpose: docs/plan.md
// decision 5 forbids shipping a link that looks live but 404s, and
// `/zh` doesn't exist until P3 builds it.
export function LocaleSwitch() {
  return (
    <div
      role="group"
      aria-label="Language"
      className="flex items-center gap-1.5 font-mono text-xs text-text-muted"
    >
      <span aria-current="true" className="text-text">
        EN
      </span>
      <span aria-hidden="true">/</span>
      <span aria-disabled="true" className="cursor-default opacity-50">
        中
      </span>
    </div>
  );
}
