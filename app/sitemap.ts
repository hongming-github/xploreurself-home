import type { MetadataRoute } from "next";
import { SITE_URL } from "@/content/facts";
import { LOCALES } from "@/content/ids";

// Only the two locale homepages exist right now. The deep-dive routes
// (/en/work/redblue, /en/work/jobagent) are phase P4 — not built yet — so
// listing them here would be exactly the placeholder-entry docs/plan.md's
// decision 5 rules out: a URL in the sitemap that 404s is worse for SEO
// than not mentioning it at all. Add them to this array when P4 ships.
//
// One `lastModified` shared by both entries (computed once, not
// `new Date()` written out twice) so the two URLs don't report two
// different build timestamps for what was actually the same build.
export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return LOCALES.map((locale) => ({
    url: `${SITE_URL}/${locale}`,
    lastModified,
    // Mirrors the hreflang set in app/[locale]/layout.tsx's
    // generateMetadata — this is the sitemap-XML form of the same "these
    // two pages are translations of each other" signal, not a new fact
    // being asserted. See the Next.js docs' "Generate a localized Sitemap"
    // example (node_modules/next/dist/docs/.../sitemap.md) for this shape.
    alternates: {
      languages: {
        en: `${SITE_URL}/en`,
        zh: `${SITE_URL}/zh`,
      },
    },
  }));
}
