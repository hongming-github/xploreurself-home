// Shape of the page's copy, kept separate from the copy itself (content/en.ts).
//
// Why copy lives in a data module instead of inline JSX: Phase P3 of this
// project adds a Chinese homepage (content/zh.ts) that must expose the exact
// same shape. Typing that shape once here means a missing or mistyped field
// in the Chinese file is a `tsc` error, not a silent gap discovered by a
// reader. Think of this the way you'd use a Pydantic model to validate two
// JSON payloads against one schema, instead of hand-checking that a second
// dict has the same keys as the first.

export type Sentiment = "pos" | "neg";

/**
 * One metric reading, e.g. "ASR@3  20% → 0%".
 *
 * `from` is optional because not every metric in this site's content has a
 * documented before/after: some are a single reading (e.g. "decoys rejected
 * 3/3"), others are a genuine before → after pair. When `from` is present,
 * MetricPair renders "{from} → {value}"; otherwise it renders just `value`.
 */
export interface Metric {
  label: string;
  value: string;
  from?: string;
  sentiment: Sentiment;
}

/**
 * A link that may not exist yet. `href` is deliberately optional: per the
 * project's decision to never ship placeholder links (see content/en.ts
 * comments for the specific cases), an item with no `href` renders as
 * inert text instead of a dead or guessed anchor.
 */
export interface LinkItem {
  label: string;
  href?: string;
}

export interface Project {
  name: string;
  description: string;
  metrics: Metric[];
  tags?: string[];
  links: LinkItem[];
  /** Short factual annotation, e.g. "Code private." Never "coming soon" copy. */
  note?: string;
}

export interface ExperienceItem {
  period: string;
  org: string;
  role: string;
  description: string;
}

export interface EducationItem {
  org: string;
  program: string;
  period: string;
}

export interface SiteContent {
  meta: {
    title: string;
    description: string;
  };
  name: string;
  /** Each string is one paragraph of the positioning statement. */
  positioning: string[];
  contact: LinkItem[];
  /** Short labels for the sticky nav's section anchors — kept in content,
   *  like everything else on the page, so phase P3's content/zh.ts can
   *  translate them without touching component code. */
  nav: {
    work: string;
    experience: string;
    education: string;
  };
  work: Project[];
  experience: ExperienceItem[];
  education: EducationItem[];
  footer: {
    copyright: string;
    sourceLabel: string;
    sourceHref: string;
  };
}
