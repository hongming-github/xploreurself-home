import type { Project } from "@/content/types";
import { MetricPair } from "./MetricPair";
import { LinkRow } from "./LinkRow";

// docs/plan.md section 3: SELECTED WORK is "a list, not a card grid" — no
// box, no shadow, no rounded panel. The border-bottom is the only visual
// separator, consistent with the design system's rule of using borders
// instead of card chrome throughout the page.
export function ProjectRow({ project }: { project: Project }) {
  const { name, description, metrics, tags, links, note } = project;

  return (
    <div className="border-b border-border py-6 first:pt-0 last:border-b-0">
      <h3 className="text-text font-medium">{name}</h3>
      <p className="mt-1 max-w-[60ch] text-text-muted">{description}</p>

      {metrics.length > 0 && (
        <div className="mt-3 space-y-1">
          {metrics.map((metric) => (
            <MetricPair key={metric.label} metric={metric} />
          ))}
        </div>
      )}

      {(tags?.length || links.length > 0 || note) && (
        <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1.5 text-sm">
          {tags?.map((tag) => (
            <span
              key={tag}
              className="rounded border border-border px-1.5 py-0.5 font-mono text-xs text-text-muted"
            >
              {tag}
            </span>
          ))}
          {links.length > 0 && <LinkRow items={links} />}
          {note && <span className="text-text-muted italic">{note}</span>}
        </div>
      )}
    </div>
  );
}
