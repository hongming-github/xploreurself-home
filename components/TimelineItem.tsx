import type { ExperienceItem } from "@/content/types";

// EXPERIENCE renders as "a compact single column" (docs/plan.md section 3),
// so this stays a tight two-line row rather than a card: period in mono on
// its own line (dates are data, so they get the mono treatment same as
// metrics), then org · role, then the one-line description.
export function TimelineItem({ item }: { item: ExperienceItem }) {
  const { period, org, role, description } = item;

  return (
    <div className="border-b border-border py-4 first:pt-0 last:border-b-0">
      <p className="font-mono text-xs text-text-muted">{period}</p>
      <p className="mt-1 text-text">
        <span className="font-medium">{org}</span>
        <span className="text-text-muted"> · {role}</span>
      </p>
      <p className="mt-1 text-text-muted">{description}</p>
    </div>
  );
}
