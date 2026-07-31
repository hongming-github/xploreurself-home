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
// with a metric or link (e.g. "output tokens" vs "输出 token"), keyed by the
// same `MetricKey` / `LinkKey` union used here — see content/types.ts.

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
 * Every link *kind* that appears anywhere on the page. The contact row and
 * each project's link group both draw from this same small vocabulary, so
 * e.g. "Live" only needs one Chinese translation (content.linkLabels.live)
 * no matter how many places on the page use a "live" link.
 */
export type LinkKey = "email" | "github" | "linkedin" | "resume" | "live";

export interface LinkFact {
  key: LinkKey;
  href: string;
}

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
    name: "redblue",
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
    // Deep dive is P4; GitHub repo isn't public yet (see content/en.ts).
    links: [],
  },
  jobagent: {
    name: "jobagent",
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
    links: [],
  },
  "ai-detective": {
    name: "AI Detective",
    metrics: [{ key: "decoysRejected", value: "3/3", sentiment: "pos" }],
    tags: ["RAG"],
    links: [
      {
        key: "github",
        href: "https://github.com/hongming-github/AI-Detective-Challenge",
      },
    ],
  },
  "ai-usage": {
    name: "ai-usage",
    metrics: [],
    tags: ["macOS"],
    links: [
      { key: "github", href: "https://github.com/hongming-github/ai-usage" },
    ],
  },
  "what-to-eat": {
    name: "What to Eat",
    metrics: [],
    tags: ["Next.js", "TypeScript"],
    // The only project with a live URL. Verified reachable during the P2
    // review: https://eat.xploreurself.com 307s to /login (password-gated)
    // and that page returns 200 — the service is up.
    links: [{ key: "live", href: "https://eat.xploreurself.com" }],
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

/** Ordered per docs/plan.md's contact row: Email, GitHub, LinkedIn, Resume.
 *  Same reasoning as PROJECT_IDS's ordering — this array decides the order,
 *  so no locale file can render the contact row in a different sequence. */
export const CONTACT_LINKS: LinkFact[] = [
  { key: "email", href: "mailto:hi@xploreurself.com" },
  { key: "github", href: "https://github.com/hongming-github" },
  {
    key: "linkedin",
    href: "https://www.linkedin.com/in/hongming-zhao-6abab1138/",
  },
  { key: "resume", href: "/resume.pdf" },
];

// Per docs/plan.md decision 9 the repo name is xploreurself-home under this
// GitHub account. It will 404 until the P0 "create the public repo" step
// happens; that's a deployment-sequencing detail outside this phase.
export const FOOTER_SOURCE_HREF =
  "https://github.com/hongming-github/xploreurself-home";
