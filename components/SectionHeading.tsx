// A default Server Component — no "use client" directive, so it renders to
// static HTML on the server and ships zero JavaScript to the browser. This
// is the baseline for every component in this project unless it specifically
// needs browser state (see ThemeToggle / LocaleSwitch for the two that do).
//
// docs/plan.md section 4: section titles get their "technical documentation"
// feel from letter-spacing and case, not from a bigger font size — 13px
// uppercase mono with tracked-out letters, in the muted colour so it reads
// as metadata rather than a headline.
export function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="font-mono text-[13px] uppercase tracking-[0.08em] text-text-muted">
      {children}
    </h2>
  );
}
