import type { MDXContent } from "mdx/types";
import type { ProjectId } from "./ids";

// Phase P4: the two deep-dive articles under content/work/*.mdx. English
// only, by docs/plan.md decision 4 -- there is no Chinese counterpart, so
// unlike PROJECT_IDS / EXPERIENCE_IDS in content/ids.ts, this tuple carries
// no Record<Id, ...> parity requirement: nothing in content/zh.ts needs to
// enumerate these, because nothing on /zh renders an article body.
export const WORK_SLUGS = ["redblue", "jobagent"] as const;

export type WorkSlug = (typeof WORK_SLUGS)[number];

/**
 * The shape of each content/work/*.mdx file's `export const frontmatter`
 * block. @next/mdx does not parse YAML frontmatter (the `---` convention)
 * without an extra remark plugin -- this phase's dependency budget is
 * `@next/mdx` and its required peers only, so that plugin isn't available.
 * A plain JS export is the alternative the Next.js MDX guide itself
 * documents (node_modules/next/dist/docs/01-app/02-guides/mdx.md,
 * "Frontmatter" section) and needs no new dependency at all -- see the
 * comment at the top of content/work/redblue.mdx for the actual swap.
 */
export interface ArticleFrontmatter {
  title: string;
  /** Which content/facts.ts project this write-up is about. Kept as a
   *  `ProjectId` rather than a second free-form string so the two stay
   *  linked by the type system -- e.g. this is how components/ProjectRow.tsx
   *  and this article's <h1> agree on the same View Transition name. */
  project: ProjectId;
  summary: string;
  /** ISO date string ("2026-07-27"), not a Date -- same reasoning as
   *  content/facts.ts's Period: nothing here ever does date arithmetic,
   *  it's only ever printed, so there's no reason to parse it. */
  date: string;
}

/**
 * Loads one article's compiled component + frontmatter. Both
 * app/[locale]/work/[slug]/page.tsx and its opengraph-image.tsx need this
 * exact pair, so it's factored here once rather than duplicating the
 * dynamic import (and its type cast) in both places.
 *
 * The `as` cast is load-bearing, not decorative: TypeScript's wildcard
 * ambient module declaration for MDX files (types/mdx.d.ts, matching
 * `"*.mdx"`) resolves for a *static* import specifier like
 * `import x from "./foo.mdx"`, but not reliably for a *dynamic*
 * template-literal specifier like the one below -- without the cast, `mod`
 * would silently type as `any`, and a typo like `frontmatter.titel` would
 * only be caught at runtime instead of by `tsc`.
 *
 * The Next.js MDX guide's own "Using dynamic imports" example
 * (node_modules/next/dist/docs/01-app/02-guides/mdx.md) is exactly this
 * pattern: `await import(\`@/content/${slug}.mdx\`)` paired with
 * `generateStaticParams` + `dynamicParams = false` in the page itself.
 */
export async function loadArticle(slug: WorkSlug): Promise<{
  Article: MDXContent;
  frontmatter: ArticleFrontmatter;
}> {
  const mod = (await import(`./work/${slug}.mdx`)) as {
    default: MDXContent;
    frontmatter: ArticleFrontmatter;
  };
  return { Article: mod.default, frontmatter: mod.frontmatter };
}
