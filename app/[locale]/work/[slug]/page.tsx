import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ViewTransition } from "react";
import { WORK_SLUGS, loadArticle, type WorkSlug } from "@/content/articles";
import { Prose } from "@/components/Prose";
import { ArticleNav } from "@/components/ArticleNav";

// This route lives under app/[locale]/ — reusing that segment's layout
// (app/[locale]/layout.tsx: <html>/<body>, fonts, the theme anti-flash
// script) rather than standing up a second root layout — but it only ever
// generates the `en` locale. Returning both `locale` and `slug` from this
// page's own generateStaticParams, instead of letting the segment inherit
// whatever locale its parent produced, is the "generate params from the
// bottom up" pattern the Next.js docs describe (node_modules/next/dist/
// docs/01-app/03-api-reference/04-functions/generate-static-params.md,
// "Multiple Dynamic Segments in a Route") — paired with `dynamicParams =
// false` below, it's what keeps /zh/work/redblue from ever being generated
// or served, matching docs/plan.md decision 4 (deep-dive articles are
// English only, with no /zh equivalent to fall back to).
export function generateStaticParams() {
  return WORK_SLUGS.map((slug) => ({ locale: "en", slug }));
}

export const dynamicParams = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const { frontmatter } = await loadArticle(slug as WorkSlug);
  const path = `/en/work/${slug}`;

  return {
    title: `${frontmatter.title} — Hongming Zhao`,
    description: frontmatter.summary,
    // metadataBase is inherited from app/[locale]/layout.tsx's own
    // generateMetadata — Next.js merges metadata down the segment tree, so
    // this only needs a root-relative path, same reasoning as that file's
    // "URL composition favors developer intent" comment.
    alternates: {
      canonical: path,
      // Deliberately no `languages` here, unlike app/[locale]/layout.tsx's
      // version of this field. That field asserts "these pages are
      // translations of each other" to search engines; this route has no
      // /zh counterpart, so declaring one would be a false signal, not a
      // neutral omission — same reasoning behind leaving these two URLs
      // out of app/sitemap.ts's per-locale `alternates.languages`.
    },
    openGraph: {
      type: "article",
      url: path,
      siteName: "xploreurself.com",
      title: frontmatter.title,
      description: frontmatter.summary,
      // No `images` field — the file-based opengraph-image.tsx colocated
      // in this same route segment wins automatically, same reasoning as
      // app/[locale]/layout.tsx's own generateMetadata.
    },
    twitter: {
      card: "summary_large_image",
      title: frontmatter.title,
      description: frontmatter.summary,
    },
  };
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { slug } = await params;

  // Belt-and-braces narrowing, same shape as app/[locale]/page.tsx's
  // `CONTENT[locale as Locale]` cast: `dynamicParams = false` above is what
  // actually keeps this component from ever being asked to render a slug
  // outside WORK_SLUGS in production. This check (and notFound() as the
  // fallback) means an out-of-range slug fails loudly and correctly instead
  // of the `as` cast below silently lying to the type checker.
  if (!WORK_SLUGS.includes(slug as WorkSlug)) {
    notFound();
  }
  const { Article, frontmatter } = await loadArticle(slug as WorkSlug);

  return (
    <>
      {/* No <LocaleSwitch> here — see components/ArticleNav.tsx's own
          comment for why a locale chooser has nothing correct to offer on
          an English-only route. ThemeToggle still applies, so it stays. */}
      <ArticleNav />

      <main className="mx-auto w-full max-w-[68ch] px-6 pb-16 sm:px-8">
        <header className="pt-10">
          {/* `name` matches the one components/ProjectRow.tsx sets on the
              homepage row that links here — see that file's comment for
              what the shared name buys. Keyed off `frontmatter.project`
              (the ProjectId, e.g. "redblue"), not the URL's `slug` — the
              two are the same string today, but tying the transition to
              the *project's* identity rather than to the route parameter
              is the more principled dependency, matching what the article
              is actually about. */}
          <ViewTransition name={`project-${frontmatter.project}`}>
            <h1 className="text-xl font-medium leading-snug text-text sm:text-2xl">
              {frontmatter.title}
            </h1>
          </ViewTransition>
          <p className="mt-3 font-mono text-xs text-text-muted">
            {frontmatter.date}
          </p>
        </header>

        <div className="mt-8">
          <Prose>
            <Article />
          </Prose>
        </div>
      </main>
    </>
  );
}
