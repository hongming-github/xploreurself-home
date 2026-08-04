import type { MDXContent } from "mdx/types";

// A third content type alongside content/articles.ts's deep-dive articles:
// short-form learning notes under content/notes/*.mdx. Deliberately the
// same shape as content/articles.ts, not a new invention -- same slug
// tuple + type pattern, same dynamic-import-with-cast loader. See that
// file's header comment for the full reasoning; this one only calls out
// where notes diverge.
export const NOTE_SLUGS = ["langgraph-durable-execution"] as const;

export type NoteSlug = (typeof NOTE_SLUGS)[number];

/**
 * The shape of each content/notes/*.mdx file's `export const frontmatter`
 * block. Deliberately NOT a widened `ArticleFrontmatter` (making `project`
 * optional there so both content types could share one interface) --
 * `ArticleFrontmatter.project: ProjectId` is a real requirement for
 * articles (it's the View Transition key linking a card to its write-up),
 * and a note has no project to be about. An optional field that's only
 * ever present for one of the two use sites doesn't describe either case
 * correctly; it just describes "sometimes an article, sometimes a note"
 * with the two halves left to the reader to work out. A sibling type says
 * plainly which fields exist for which content — the same call
 * components/ContactLinks.tsx made against components/LinkRow.tsx
 * (docs/plan.md section 十一): two shapes with a similar-looking job get
 * two small types/components rather than one with a mode flag.
 *
 * `kind` exists for a future "reading" note -- a living page whose `date`
 * means "last updated" rather than "published", unlike a note or article's
 * fixed publish date. Only `"note"` is used today; no reading-list content
 * is built yet (deliberately deferred, not an oversight).
 */
export interface NoteFrontmatter {
  title: string;
  summary: string;
  /** ISO date string ("2026-08-04"), not a Date -- same reasoning as
   *  content/articles.ts's ArticleFrontmatter.date: only ever printed,
   *  never used for date arithmetic. */
  date: string;
  kind: "note" | "reading";
}

/**
 * Loads one note's compiled component + frontmatter -- the same pairing
 * app/[locale]/notes/[slug]/page.tsx and its opengraph-image.tsx both need,
 * and the same app/[locale]/page.tsx homepage section needs (to read
 * title/summary/date for components/NoteRow.tsx without inventing a second
 * copy of that prose in content/en.ts / content/zh.ts).
 *
 * The `as` cast is load-bearing, not decorative -- identical reasoning to
 * content/articles.ts's loadArticle: types/mdx.d.ts's ambient `"*.mdx"`
 * module declaration types `frontmatter` as `ArticleFrontmatter` (it has
 * no way to know some `.mdx` files are notes instead), and that
 * declaration doesn't reliably resolve at all for a *dynamic*
 * template-literal import specifier like the one below. Without the cast,
 * `mod` would be `any`; with it, a typo like `frontmatter.titel` is a
 * `tsc` error instead of a silent runtime `undefined`.
 */
export async function loadNote(slug: NoteSlug): Promise<{
  Note: MDXContent;
  frontmatter: NoteFrontmatter;
}> {
  const mod = (await import(`./notes/${slug}.mdx`)) as {
    default: MDXContent;
    frontmatter: NoteFrontmatter;
  };
  return { Note: mod.default, frontmatter: mod.frontmatter };
}
