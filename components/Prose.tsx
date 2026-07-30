// Typography container for long-form copy. docs/plan.md section 4 requires
// body content to cap out at 68 characters wide — the classic readability
// constraint for justified prose — "and deep-dive pages use the same width".
// This component is what phase P4's MDX deep-dive pages will wrap their
// rendered markdown in; this phase, it wraps the homepage's positioning
// paragraph, which is the one piece of genuine prose (as opposed to
// structured data like a timeline or a metric) on the page.
//
// It sets its own max-width rather than assuming a parent already did,
// because P4's deep-dive pages won't necessarily share the homepage's outer
// layout wrapper — this component needs to be correct on its own.
export function Prose({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto w-full max-w-[68ch] space-y-4 leading-[1.65] text-text">
      {children}
    </div>
  );
}
