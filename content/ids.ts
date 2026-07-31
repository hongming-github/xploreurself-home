// The locale-independent spine of the site's structured content.
//
// Why this file exists (phase P3, docs/plan.md section 3): typing content/en.ts
// and content/zh.ts as the same `SiteContent` interface catches a missing
// *field* — e.g. forgetting `role` on an experience entry — because that's a
// `tsc` error either way. It does NOT catch a missing *entry*: nothing stops
// someone from writing 5 projects in en.ts and 4 in zh.ts, because array
// length isn't part of a TypeScript array type.
//
// The fix is the same one you'd reach for in Python if two dicts had to share
// exactly the same keys: define the key set once, as an Enum, and type both
// dicts as `dict[ThatEnum, Value]` instead of `dict[str, Value]`. Here,
// `PROJECT_IDS`/`EXPERIENCE_IDS` are the Enum (a `const` tuple, so TypeScript
// narrows `(typeof PROJECT_IDS)[number]` to the literal union of ids rather
// than plain `string`), and content/types.ts types `SiteContent.work` as
// `Record<ProjectId, ProjectCopy>`. Omit one project's copy in content/zh.ts
// and `tsc` reports "Property 'ai-usage' is missing" — a build-time catch
// instead of a reader silently seeing 4 projects on the Chinese page.
//
// Order here IS render order — content/site.ts builds the page's arrays by
// mapping over these tuples, so neither content/en.ts nor content/zh.ts has
// any say over project or experience ordering. That's deliberate: order is
// structure, not prose, so it belongs here rather than being something two
// locale files could each get right or wrong independently.
export const PROJECT_IDS = [
  "redblue",
  "jobagent",
  "ai-detective",
  "ai-usage",
  "what-to-eat",
] as const;

export type ProjectId = (typeof PROJECT_IDS)[number];

export const EXPERIENCE_IDS = [
  "st-engineering",
  "dbs",
  "trust-bank",
  "ocbc-api-developer",
  "avanade",
  "ocbc-api-developer-intern",
] as const;

export type ExperienceId = (typeof EXPERIENCE_IDS)[number];

// The two locales this phase ships. app/[locale]/layout.tsx maps this same
// tuple into generateStaticParams, so adding a third locale later is a
// one-line change here rather than a change in two places that could drift.
export const LOCALES = ["en", "zh"] as const;

export type Locale = (typeof LOCALES)[number];
