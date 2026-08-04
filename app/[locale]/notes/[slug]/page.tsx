import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ViewTransition } from "react";
import { NOTE_SLUGS, loadNote, type NoteSlug } from "@/content/notes";
import { Prose } from "@/components/Prose";
import { ArticleNav } from "@/components/ArticleNav";

// Structural mirror of app/[locale]/work/[slug]/page.tsx — same reasoning
// throughout, see that file's comments for the fuller version of each one.
// This route only ever generates the `en` locale: returning both `locale`
// and `slug` here, paired with `dynamicParams = false` below, is what keeps
// /zh/notes/langgraph-durable-execution from ever being generated or served
// — there is no /zh counterpart for a note any more than there is for a
// work article (docs/plan.md decision 4 extends to this third content type
// too, see the GOAL brief this phase shipped against).
export function generateStaticParams() {
  return NOTE_SLUGS.map((slug) => ({ locale: "en", slug }));
}

export const dynamicParams = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const { frontmatter } = await loadNote(slug as NoteSlug);
  const path = `/en/notes/${slug}`;

  return {
    title: `${frontmatter.title} — Hongming Zhao`,
    description: frontmatter.summary,
    // metadataBase is inherited from app/[locale]/layout.tsx's own
    // generateMetadata, same as the work article route.
    alternates: {
      canonical: path,
      // No `languages` here — same reasoning as
      // app/[locale]/work/[slug]/page.tsx: this route has no /zh
      // counterpart, so declaring one would be a false signal.
    },
    openGraph: {
      type: "article",
      url: path,
      siteName: "xploreurself.com",
      title: frontmatter.title,
      description: frontmatter.summary,
      // No `images` field — the file-based opengraph-image.tsx colocated
      // in this same route segment wins automatically.
    },
    twitter: {
      card: "summary_large_image",
      title: frontmatter.title,
      description: frontmatter.summary,
    },
  };
}

export default async function NotePage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { slug } = await params;

  // Belt-and-braces narrowing, same shape as the work article page's own
  // version of this check — `dynamicParams = false` above is what actually
  // keeps this component from being asked to render an out-of-range slug in
  // production; this is what makes that failure loud instead of the `as`
  // cast below silently lying to the type checker.
  if (!NOTE_SLUGS.includes(slug as NoteSlug)) {
    notFound();
  }
  const { Note, frontmatter } = await loadNote(slug as NoteSlug);

  return (
    <>
      {/* Shared with the work article route — see that component's own
          comment for why an English-only route gets a plain "back home"
          link instead of a locale chooser with a broken option. */}
      <ArticleNav />

      <main className="mx-auto w-full max-w-[68ch] px-6 pb-16 sm:px-8">
        <header className="pt-10">
          {/* Keyed off the note's own `slug`, not a `project`-shaped id —
              unlike a work article, a note has no separate project identity
              to key the transition off (see content/notes.ts's
              NoteFrontmatter comment for why it isn't ArticleFrontmatter
              widened to make `project` optional). The homepage row sharing
              this same name lives in components/NoteRow.tsx. */}
          <ViewTransition name={`note-${slug}`}>
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
            <Note />
          </Prose>
        </div>
      </main>
    </>
  );
}
