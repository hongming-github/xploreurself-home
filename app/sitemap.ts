import type { MetadataRoute } from "next";
import { SITE_URL } from "@/content/facts";
import { LOCALES } from "@/content/ids";
import { WORK_SLUGS } from "@/content/articles";

// One `lastModified` shared by every entry (computed once, not `new Date()`
// written out per URL) so none of them report a different build timestamp
// for what was actually the same build.
export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  const localeEntries: MetadataRoute.Sitemap = LOCALES.map((locale) => ({
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

  // The two P4 deep-dive articles. No `alternates.languages` here — unlike
  // the locale entries above, these URLs have no /zh counterpart to be a
  // translation of (docs/plan.md decision 4), so adding that field would
  // assert something false to search engines rather than omit something
  // neutral. This is the "add both article URLs" follow-up docs/plan.md's
  // P4 entry noted was left for this phase.
  const articleEntries: MetadataRoute.Sitemap = WORK_SLUGS.map((slug) => ({
    url: `${SITE_URL}/en/work/${slug}`,
    lastModified,
  }));

  return [...localeEntries, ...articleEntries];
}
