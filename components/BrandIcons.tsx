import type { SVGProps } from "react";

// GitHub and LinkedIn, hand-inlined as SVGs instead of imported from
// lucide-react. Don't "fix" this by swapping them back to a lucide import —
// docs/plan.md's 技术选择 table records why they can't be: this
// lucide-react version (1.27.0) ships no brand/logo glyphs at all — no
// Github, Linkedin, Twitter, Facebook, Slack, or Figma either. It's not a
// missing import, it's a missing category (Lucide dropped trademarked marks
// on purpose). Mail stays a lucide import in ContactLinks.tsx because email
// has no brand to draw — a generic envelope is the *correct* symbol there,
// not a workaround.
//
// Path data is each service's standard monochrome glyph-only mark (no
// background badge) — the same "icon, no container" convention Font
// Awesome ships as `linkedin-in` alongside the full boxed `linkedin`, and
// the shape GitHub itself uses for plain-color contexts. Both trademark
// policies permit this monochrome-glyph usage for linking to a profile,
// which is all this component does.
//
// `fill="currentColor"` (no `stroke`) because these marks are solid
// silhouettes, unlike lucide's stroke-only icons (Mail is drawn as
// outlines, not a filled envelope shape). That's also *why* they need
// their own component instead of one shared <Icon> — a shared component
// would have to branch on fill-vs-stroke internally, which is more
// indirection than just having two small components.

interface BrandIconProps extends SVGProps<SVGSVGElement> {
  size?: number;
}

// Both marks share one internal trick: the path data fills nearly the
// entire 24x24 viewBox, but lucide's icons (Mail included) are drawn with
// a couple of units of inset padding baked into their path data, on top of
// the visual thinning a 2px stroke gives a shape versus a solid fill of the
// same outline. Render a filled brand mark at the same `size` as a lucide
// icon and, side by side, it reads distinctly heavier/bigger — confirmed by
// screenshot comparison against the Mail row, not assumed. `viewBoxPad`
// shrinks the glyph within its own box (scale + re-center, both computed
// from one number) so the three icons read as one set at the same `size`,
// rather than solving it by passing a smaller `size` for two of the three
// — that would leave callers needing to remember per-icon magic numbers.
const VIEWBOX_PAD = 3.5; // tuned by screenshot: see components/ContactLinks.tsx usage

function BrandSvg({
  size = 14,
  children,
  ...props
}: BrandIconProps & { children: React.ReactNode }) {
  const scale = 24 / (24 + VIEWBOX_PAD * 2);
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="currentColor"
      {...props}
    >
      <g transform={`translate(12 12) scale(${scale}) translate(-12 -12)`}>
        {children}
      </g>
    </svg>
  );
}

export function GithubIcon(props: BrandIconProps) {
  return (
    <BrandSvg {...props}>
      <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.386-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.84 1.237 1.84 1.237 1.07 1.834 2.809 1.304 3.495.997.108-.775.418-1.305.76-1.605-2.665-.303-5.466-1.332-5.466-5.93 0-1.31.467-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23a11.5 11.5 0 0 1 3-.405c1.02.005 2.045.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.573C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
    </BrandSvg>
  );
}

export function LinkedinIcon(props: BrandIconProps) {
  return (
    <BrandSvg {...props}>
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452z" />
    </BrandSvg>
  );
}
