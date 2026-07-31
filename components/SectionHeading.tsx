// A default Server Component — no "use client" directive, so it renders to
// static HTML on the server and ships zero JavaScript to the browser. This
// is the baseline for every component in this project unless it specifically
// needs browser state (see ThemeToggle / LocaleSwitch for the two that do).
//
// docs/plan.md section 4: section titles get their "technical documentation"
// feel from letter-spacing and case, not from a bigger font size — 13px
// uppercase mono with tracked-out letters. That restraint in *size* is
// correct and stays. Colour is a separate axis, though: these headings are
// the page's only structural signposts ("where am I"), which makes them
// substance, not metadata — so they get full `text` colour plus a medium
// weight, the same distinction content/types.ts draws for `note` (metadata,
// stays muted) versus everything else. `text-muted` is reserved for actual
// metadata elsewhere on the page: dates, tag chips, the "Code private." note.
//
// Uppercase + mono is a Latin-only treatment, though — on the Chinese page
// (phase P3) it needs to turn off, since `text-transform: uppercase` is a
// no-op on Han characters and Geist Mono's metrics look wrong applied to
// CJK. That override lives in app/globals.css as a `:lang(zh) h2` rule, not
// as a locale prop on this component — see that file for why.
export function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="font-mono text-[13px] font-medium uppercase tracking-[0.08em] text-text">
      {children}
    </h2>
  );
}
