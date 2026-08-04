import type { ExperienceId, ProjectId } from "./ids";
import type { ContactIconKey, LinkKey, MetricKey, Sentiment } from "./facts";
import type { NoteSlug } from "./notes";

// Shape of the page's copy, kept separate from the copy itself
// (content/en.ts / content/zh.ts). See content/ids.ts and content/facts.ts
// for the locale-independent structure and numbers this type builds on top
// of, and content/site.ts for how the two get zipped back together into the
// flat shapes the components render.

/** Prose for one project. Everything structural (name, metric numbers,
 *  tags, URLs) lives in content/facts.ts instead — see that file's header
 *  comment for why. */
export interface ProjectCopy {
  description: string;
  /** Short factual annotation, e.g. "Code private." Never "coming soon" copy. */
  note?: string;
}

/** Prose for one experience entry. `period` and `org` are facts (see
 *  content/facts.ts EXPERIENCE_FACTS) — only the role title and the
 *  one-line description are prose that differs by locale. */
export interface ExperienceCopy {
  role: string;
  description: string;
}

/**
 * Prose for one homepage note row. Mirrors ProjectCopy above, not
 * content/notes.ts's NoteFrontmatter: a note row on the homepage is a card,
 * same as a ProjectRow, and every other card's summary on this page is
 * bilingual shell copy (docs/plan.md decision 4 — the shell, including
 * project cards, is bilingual; only a deep-dive body is English only).
 * `ProjectRow` never reads its description off `content/work/*.mdx`
 * frontmatter for exactly this reason, and a note row shouldn't either.
 * `frontmatter.summary` still exists and still does real work — it's the
 * English-only article route's `<meta name="description">` and OG
 * description (app/[locale]/notes/[slug]/page.tsx and its
 * opengraph-image.tsx) — this is a second, deliberately separate copy for a
 * second, deliberately separate audience (the homepage card vs. the
 * article's own metadata), not a duplication to collapse.
 */
export interface NoteCopy {
  summary: string;
}

/**
 * Education is intentionally NOT keyed by an id/Record the way work and
 * experience are. docs/plan.md only calls out work and experience for the
 * Record<Id, ...> treatment (project count and experience count are exactly
 * the fields most likely to silently drift between locales); education is
 * three static rows that essentially never change, so the extra structure
 * would be ceremony without a real parity risk to guard against. Org names
 * here are English in both locales (same reasoning as ExperienceFact.org).
 *
 * No `period` field here: the year digits are a fact, not prose, so they
 * live in content/facts.ts's EDUCATION_PERIODS (matched by array position)
 * instead of being retyped per locale — see content/site.ts's buildEducation
 * for where the two get zipped back together.
 */
export interface EducationItem {
  org: string;
  program: string;
}

export interface SiteContent {
  meta: {
    title: string;
    description: string;
  };
  /** "Hongming Zhao" in both locales — see content/en.ts and content/zh.ts
   *  for why this is spelled out per-locale rather than hoisted into
   *  content/facts.ts despite being identical today. */
  name: string;
  /** Each string is one paragraph of the positioning statement. */
  positioning: string[];
  /** Short labels for the sticky nav's section anchors.
   *
   *  Three anchors, not four: a fourth English label ("Work / Notes /
   *  Experience / Education") overflows 375px — measured
   *  `document.documentElement.scrollWidth` going 375 → 407, 32px of
   *  horizontal overflow, which breaks this project's hard "no horizontal
   *  scroll at 375px" rule. `background` covers BOTH the `#experience`
   *  section on the page AND `education` below it — `education` keeps its
   *  own `id`/`scroll-mt-16` (so a direct link to it still works) but is
   *  no longer a nav target. This isn't just a display shortcut: see
   *  components/Nav.tsx's end-of-page rule (around line 41 — the highlight
   *  it derives from `items` picks the *last* item in this list once the
   *  reader hits the bottom of the page). With `education` still a
   *  separate nav entry after `experience`, that rule would light
   *  "Experience" while the reader is looking at Education — the exact
   *  defect commits dcd0b29 and 0ea6811 (docs/plan.md section 十一)
   *  already fixed once for the three-section case. Mapping `background`
   *  to the *same* `#experience` id as the last nav item, rather than
   *  dropping education's anchor and leaving `experience` as the label,
   *  means the highlight is accurate whichever of the two sections is on
   *  screen. */
  nav: {
    work: string;
    notes: string;
    background: string;
  };
  /** Longer section headings rendered above each section (SectionHeading) —
   *  distinct from `nav` because the Chinese copy uses different phrasing
   *  for the anchor label ("项目") than for the heading ("精选项目"), and
   *  because `nav.background` merges two headings ("Experience" /
   *  "Education") that stay separate here — the merge is a nav-anchor
   *  simplification only, not a page restructuring. `contact` has no
   *  counterpart in `nav`: docs/plan.md is explicit that the contact block
   *  gets a heading but not a sticky-nav anchor, since it sits above the
   *  nav and is already on screen at every scroll position — an anchor to
   *  something already visible has nothing to jump to. `notes` is the
   *  third content type's section heading, added alongside `work` in this
   *  phase — its nav label lives in `nav.notes` above (same word, matching
   *  every other section here). */
  sections: {
    work: string;
    notes: string;
    experience: string;
    education: string;
    contact: string;
  };
  /** Label text for the link kinds whose visible text is genuine prose —
   *  as of 2026-07-31 that's just "live" ("Live" / "线上"); see
   *  content/facts.ts's `LinkKey` comment for why the contact row and most
   *  project links (an email address, a GitHub URL, the literal word
   *  "GitHub") don't go through this table anymore. `Record<LinkKey, ...>`
   *  still means content/zh.ts must supply a Chinese label for every kind
   *  in the union, or `tsc` fails — same parity guarantee, smaller union. */
  linkLabels: Record<LinkKey, string>;
  /** Same idea for metric labels — see content/facts.ts's MetricKey. */
  metricLabels: Record<MetricKey, string>;
  /** The word for "still ongoing" ("Present" / "至今"), used to render any
   *  content/facts.ts Period whose `to` is omitted. This is prose, not a
   *  fact — the digits around it come from facts.ts, this is the one word
   *  that changes by locale. See content/site.ts for where it's used. */
  present: string;
  /** Keyed by content/ids.ts's PROJECT_IDS. Missing an entry for any id is
   *  a `tsc` error, not a page that quietly ships one project short. */
  work: Record<ProjectId, ProjectCopy>;
  /** Keyed by content/notes.ts's NOTE_SLUGS — same guarantee, one level
   *  down: omitting a note's card summary in either locale file is a `tsc`
   *  error, the same way omitting a project's is. */
  notes: Record<NoteSlug, NoteCopy>;
  /** Keyed by content/ids.ts's EXPERIENCE_IDS — same guarantee. */
  experience: Record<ExperienceId, ExperienceCopy>;
  education: EducationItem[];
  footer: {
    copyright: string;
    sourceLabel: string;
  };
}

// --- Render-ready view types -------------------------------------------
//
// These are what the existing components (ProjectRow, TimelineItem,
// MetricPair, LinkRow, Footer, NoteRow) actually take as props.
// content/site.ts builds them by zipping a SiteContent (locale prose)
// together with content/facts.ts (locale-independent numbers and URLs) —
// components never import content/facts.ts directly and don't need to know
// the content is split at all. NoteRowView is the one exception to "zipped
// from facts.ts": a note has no facts.ts entry, so content/site.ts's
// buildNotes() zips SiteContent's `notes` (the bilingual card summary)
// together with content/notes.ts's loadNote() (slug/title/date) instead —
// see that function's own comment.

export interface Metric {
  label: string;
  value: string;
  from?: string;
  sentiment: Sentiment;
}

/**
 * A link that may not exist yet. `href` is deliberately optional: per the
 * project's decision to never ship placeholder links, an item with no
 * `href` renders as inert text instead of a dead or guessed anchor.
 */
export interface LinkItem {
  label: string;
  href?: string;
}

/**
 * Render-ready contact row: a value, its href, and which icon goes next to
 * it. Not just a `LinkItem` with an extra field bolted on — the icon isn't
 * optional here the way `href` is on `LinkItem` (every contact row has one
 * by construction, since content/facts.ts's CONTACT_LINKS always supplies
 * an icon), and keeping the two types separate means ContactLinks.tsx's
 * prop type says exactly what it needs, rather than components/LinkRow.tsx
 * gaining a field it never uses.
 */
export interface ContactItem {
  value: string;
  href: string;
  icon: ContactIconKey;
}

export interface Project {
  /** Phase P4 addition: components/ProjectRow.tsx needs a stable identity
   *  (not just `name`, which for e.g. "AI Detective" doesn't round-trip to
   *  anything) to name the View Transition it shares with a matching
   *  article <h1> — see content/facts.ts's PROJECT_FACTS for where this
   *  comes from. Also replaces `name` as the React `key` in
   *  app/[locale]/page.tsx's project list, which was always the more
   *  correct choice (project names are prose that could theoretically
   *  collide; ids can't). */
  id: ProjectId;
  name: string;
  description: string;
  metrics: Metric[];
  tags?: string[];
  links: LinkItem[];
  note?: string;
}

export interface ExperienceItem {
  period: string;
  org: string;
  role: string;
  description: string;
}

/** Render-ready education row — content/site.ts's buildEducation() zips
 *  content/en.ts / content/zh.ts's EducationItem (org, program) together
 *  with content/facts.ts's EDUCATION_PERIODS into this, the same pattern
 *  ExperienceItem already uses for experience. */
export interface EducationView {
  org: string;
  program: string;
  period: string;
}

export interface FooterView {
  copyright: string;
  sourceLabel: string;
  sourceHref: string;
}

/** Render-ready homepage notes-section row — components/NoteRow.tsx's prop
 *  type. `slug` is what the View Transition name is keyed off (matching
 *  app/[locale]/notes/[slug]/page.tsx's <h1>); `title` and `date` come from
 *  the note's own content/notes/*.mdx frontmatter (there is exactly one
 *  English-language copy of those, same as a project's `name`); `summary`
 *  comes from *this* locale's `SiteContent.notes` — see NoteCopy's comment
 *  above for why that's a separate string from frontmatter.summary rather
 *  than the same one reused. */
export interface NoteRowView {
  slug: string;
  title: string;
  summary: string;
  date: string;
}
