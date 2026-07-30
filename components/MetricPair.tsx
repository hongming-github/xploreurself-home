import type { Metric } from "@/content/types";

// The signature element of this design (docs/plan.md section 4). The whole
// page deliberately uses one accent colour for everything else; `pos` and
// `neg` are held back for exactly this component so that, when they do show
// up, they mean something specific — "this reading is good" / "this reading
// is the cost". Reusing them anywhere else (e.g. a generic green "success"
// badge) would dilute that signal, which is why no other component in this
// project imports `text-pos` or `text-neg`.
//
// `from` is optional: some metrics in content/en.ts are a single reading
// (no documented starting point), others are genuine before → after pairs.
//
// This renders a bare Fragment, not a wrapping <p> or <div>, because its
// parent (ProjectRow) lays metrics out as a CSS grid: `grid-template-columns`
// only positions *direct* children into columns, and a Fragment is the React
// way to hand two elements to a parent without inserting an extra DOM node
// in between that would break that direct-child relationship — the same
// reason you'd `yield from` instead of `yield` a wrapped generator in Python
// when you want the caller to see a flat sequence, not one nested inside
// another.
export function MetricPair({ metric }: { metric: Metric }) {
  const { label, from, value, sentiment } = metric;
  const readingClass = sentiment === "pos" ? "text-pos" : "text-neg";

  return (
    <>
      <span className="text-text-muted">{label}</span>
      <span className={readingClass}>
        {from ? `${from} → ${value}` : value}
      </span>
    </>
  );
}
