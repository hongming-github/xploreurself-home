import type { ExperienceId, ProjectId } from "./ids";

// Locale-independent facts: the numbers, URLs, and technical vocabulary that
// docs/plan.md section 3 explicitly says are NOT translated. A "20% → 0%"
// or a GitHub URL is the same fact regardless of which language surrounds
// it, so it's written once here rather than once per locale file — the
// alternative (copy-pasting the same metric into content/en.ts AND
// content/zh.ts) is exactly the kind of two-sources-of-truth setup that lets
// a future edit update one copy and silently leave the other stale.
//
// content/en.ts and content/zh.ts each supply the *label* text that goes
// with a metric (e.g. "output tokens" vs "输出 token"), keyed by the same
// `MetricKey` union used here — see content/types.ts. Most link text used
// to work the same way via `LinkKey`, but as of 2026-07-31 almost none of
// it actually varies by locale (see the `LinkKey` comment below), so most
// link labels are now plain strings living right here instead.

export type Sentiment = "pos" | "neg";

/**
 * Every metric label used anywhere on the page, spelled out once as a
 * union instead of a free-form string. This is what lets
 * `content.metricLabels` in content/types.ts be typed as
 * `Record<MetricKey, string>`: content/zh.ts must supply a Chinese label for
 * every key below, or `tsc` fails — the same parity guarantee content/ids.ts
 * gives PROJECT_IDS, applied one level down to metric labels specifically.
 */
export type MetricKey =
  | "asr3"
  | "benignFalseRefusal"
  | "outputTokens"
  | "promptCacheHit"
  | "decoysRejected";

export interface MetricFact {
  key: MetricKey;
  value: string;
  from?: string;
  sentiment: Sentiment;
}

/**
 * Link kinds whose visible text actually differs by locale. This used to
 * list "email" / "github" / "linkedin" / "resume" too, back when the
 * contact row rendered translated *labels* ("Email", "GitHub", ...). Now
 * the contact row prints the real values instead (see CONTACT_LINKS below)
 * and those values don't get translated — an email address and a GitHub
 * URL read the same in any language. "GitHub" as a per-project link label
 * has the same property (identical in content/en.ts and content/zh.ts
 * today), so it's inlined as a literal string in PROJECT_FACTS instead of
 * routed through a translation table for a translation that never
 * actually varies. "live" is genuine prose ("Live" / "线上").
 *
 * "article" (added phase P4) is the odd one out: the *href* is
 * locale-independent (redblue and jobagent's deep-dive pages are English
 * only — docs/plan.md decision 4 — so /zh's card links to the exact same
 * /en/work/... URL /en's card does), but the *label* still needs to differ,
 * because /zh's version has to double as the "this is English" disclosure
 * docs/plan.md section 3 requires — see content/zh.ts's linkLabels.article
 * for where that's spelled out.
 */
export type LinkKey = "live" | "article";

/**
 * A per-project link. Two shapes, matched by `kind`:
 *   - "literal": the visible text is a locale-independent fact (a proper
 *     noun like "GitHub"), spelled out right here next to its href.
 *   - "translated": the visible text is real prose that differs by locale
 *     (currently only "Live"/"线上"), so it's a `LinkKey` that content/en.ts
 *     and content/zh.ts each supply a label for — see content/site.ts's
 *     buildProjects for where the two get resolved into one string.
 */
export type LinkFact =
  | { kind: "literal"; label: string; href: string }
  | { kind: "translated"; key: LinkKey; href: string };

export interface ProjectFact {
  /** Proper noun / product name — identical in both locales (see
   *  docs/plan.md's Chinese project list, which never retranslates a
   *  project name), so it's written once here instead of twice. */
  name: string;
  metrics: MetricFact[];
  tags?: string[];
  links: LinkFact[];
}

export const PROJECT_FACTS: Record<ProjectId, ProjectFact> = {
  redblue: {
    // Display names are product names, not repo names — the five cards used
    // to mix both conventions, which read as arbitrary rather than as a
    // choice. The repo name still appears in the write-up's prose (in mono,
    // where a package name belongs) and will appear again on the GitHub
    // link once this repo goes public.
    name: "Adversarial Robustness Harness",
    metrics: [
      { key: "asr3", from: "20%", value: "0%", sentiment: "pos" },
      {
        key: "benignFalseRefusal",
        from: "10%",
        value: "30%",
        sentiment: "neg",
      },
    ],
    tags: ["Python", "LangGraph"],
    // GitHub repo isn't public yet (see content/en.ts) — that's still
    // phase P7, unaffected by P4. The deep-dive article now exists, so it
    // gets the one link that does. A root-relative href (not
    // https://xploreurself.com/...) is deliberate: components/LinkRow.tsx
    // treats a leading "/" as "this site's own route" and renders it with
    // next/link instead of a plain <a>, which is what lets the View
    // Transition to this article's <h1> (see components/ProjectRow.tsx)
    // fire at all — a full-page <a> navigation never triggers one.
    links: [
      { kind: "translated", key: "article", href: "/en/work/redblue" },
      {
        kind: "literal",
        label: "GitHub",
        href: "https://github.com/hongming-github/redblue",
      },
    ],
  },
  jobagent: {
    // Matches how this project is named on the CV, so a reader holding both
    // doesn't have to work out that they're the same thing.
    name: "Job Hunt Agent",
    metrics: [
      { key: "outputTokens", value: "−61%", sentiment: "pos" },
      {
        key: "promptCacheHit",
        from: "47.7%",
        value: "95.4%",
        sentiment: "pos",
      },
    ],
    tags: ["LangGraph"],
    // Code stays private (see the "Code private." note in content/en.ts /
    // content/zh.ts) — that doesn't change with P4. Same root-relative
    // article link as redblue above.
    links: [{ kind: "translated", key: "article", href: "/en/work/jobagent" }],
  },
  "ai-detective": {
    name: "AI Detective",
    metrics: [{ key: "decoysRejected", value: "3/3", sentiment: "pos" }],
    tags: ["RAG"],
    links: [
      {
        kind: "literal",
        label: "GitHub",
        href: "https://github.com/hongming-github/AI-Detective-Challenge",
      },
    ],
  },
  "ai-usage": {
    // The repo's own README titles it "AI Usage" — this is its name, not a
    // prettified version of the repo slug.
    name: "AI Usage",
    metrics: [],
    tags: ["macOS"],
    links: [
      {
        kind: "literal",
        label: "GitHub",
        href: "https://github.com/hongming-github/ai-usage",
      },
    ],
  },
  "what-to-eat": {
    name: "What to Eat",
    metrics: [],
    tags: ["Next.js", "TypeScript"],
    // The only project with a live URL. Verified reachable during the P2
    // review: https://eat.xploreurself.com 307s to /login (password-gated)
    // and that page returns 200 — the service is up. "Live" is genuine
    // prose (translated to "线上" on the Chinese page), unlike the literal
    // "GitHub" labels above, so this is the one project link still routed
    // through content/en.ts / content/zh.ts's linkLabels.
    links: [
      { kind: "translated", key: "live", href: "https://eat.xploreurself.com" },
    ],
  },
};

/**
 * A period as start/end digits — nothing else. Deliberately does NOT store
 * "Present"/"至今" as part of the string: those digits are the same in every
 * locale (a fact), but the word marking an ongoing period is prose that
 * differs by locale, so baking it into this string is what caused "Present"
 * to leak onto the Chinese page. `to` omitted means still ongoing;
 * content/site.ts is where that gets turned into locale text — see the
 * comment there for why assembly happens at that seam specifically.
 */
export interface Period {
  from: string;
  to?: string;
}

export interface ExperienceFact {
  period: Period;
  org: string;
}

export const EXPERIENCE_FACTS: Record<ExperienceId, ExperienceFact> = {
  "st-engineering": {
    period: { from: "2026-03" },
    org: "ST Engineering",
  },
  dbs: { period: { from: "2024-10", to: "2025-08" }, org: "DBS Bank" },
  "trust-bank": {
    period: { from: "2023-04", to: "2024-09" },
    org: "Trust Bank Singapore",
  },
  "ocbc-api-developer": {
    period: { from: "2019-03", to: "2023-03" },
    org: "OCBC Bank",
  },
  avanade: { period: { from: "2017-07", to: "2019-02" }, org: "Avanade" },
  "ocbc-api-developer-intern": {
    period: { from: "2016-10", to: "2017-03" },
    org: "OCBC Bank",
  },
};

/**
 * Education periods, kept alongside EXPERIENCE_FACTS for the same reason:
 * the year digits are locale-independent facts even though the programme
 * name (content/en.ts / content/zh.ts) is prose. Positional rather than
 * `Record<Id, ...>` — index i here describes the i-th entry of each
 * locale's `education` array — matching how content/types.ts's
 * EducationItem comment already explains education doesn't get the
 * Record<Id, ...> parity treatment: three rows that essentially never
 * change, so there's no real drift risk to guard against with an id union.
 */
export const EDUCATION_PERIODS: Period[] = [
  { from: "2025" },
  { from: "2016", to: "2017" },
  { from: "2012", to: "2016" },
];

/**
 * The contact block prints the actual value, not a translated label — an
 * HR reader is usually copying the email address, not clicking a word that
 * says "Email" (2026-07-31 decision). `value` is exactly what's rendered:
 * no `content.linkLabels` lookup involved, because there's no prose left
 * to translate — `hi@xploreurself.com` reads the same in English or
 * Chinese. `value` and `href` differ for the last two entries only
 * because a URL's copy-friendly display form (no `https://`, no trailing
 * slash) isn't the same string curl/fetch needs to actually reach it.
 *
 * Order here is render order, same reasoning as PROJECT_IDS's ordering —
 * this array is the only place that decides it, so neither locale file has
 * a say. Résumé used to be a fourth entry; it was removed along with
 * `public/resume.pdf` itself (2026-07-31) rather than just unlinked, since
 * a file left in `public/` still deploys and stays fetchable regardless of
 * whether anything on the page points at it.
 */
/**
 * Which lucide-react icon a contact row gets, named by service rather than
 * by the icon component itself — that keeps this file free of a React/JSX
 * import for what is otherwise plain data. components/ContactLinks.tsx is
 * the one place that turns "github" into the `Github` component, the same
 * division of labour as `MetricKey` (a name here) vs. its rendered label
 * (resolved later, closer to the DOM).
 */
export type ContactIconKey = "mail" | "github" | "linkedin";

export interface ContactLink {
  value: string;
  href: string;
  icon: ContactIconKey;
}

export const CONTACT_LINKS: ContactLink[] = [
  {
    value: "hi@xploreurself.com",
    href: "mailto:hi@xploreurself.com",
    icon: "mail",
  },
  {
    value: "github.com/hongming-github",
    href: "https://github.com/hongming-github",
    icon: "github",
  },
  {
    value: "linkedin.com/in/hongming-zhao",
    href: "https://www.linkedin.com/in/hongming-zhao",
    icon: "linkedin",
  },
];

// Per docs/plan.md decision 9 the repo name is xploreurself-home under this
// GitHub account. It will 404 until the P0 "create the public repo" step
// happens; that's a deployment-sequencing detail outside this phase.
export const FOOTER_SOURCE_HREF =
  "https://github.com/hongming-github/xploreurself-home";

/**
 * The apex domain this site deploys to. A `string`, not a `URL` object,
 * because most of its call sites (robots.txt's `Sitemap:` line, sitemap.xml
 * entries, the `alt` text on the OG images) just want it interpolated into
 * another string — the one call site that wants a `URL` instance
 * (`metadataBase` in app/[locale]/layout.tsx) does `new URL(SITE_URL)`
 * itself rather than forcing every other caller to `.toString()` a URL
 * object back down. Written once here, the same reason every other
 * locale-independent fact in this file is written once here: `robots.ts`,
 * `sitemap.ts`, `layout.tsx`'s metadata, and both locales'
 * `opengraph-image.tsx` all need this same string, and a domain typed out
 * five separate times is five chances for one of them to drift if the site
 * ever moves.
 */
export const SITE_URL = "https://xploreurself.com";
