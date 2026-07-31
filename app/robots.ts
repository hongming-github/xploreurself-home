import type { MetadataRoute } from "next";
import { SITE_URL } from "@/content/facts";

// This is the opposite of the author's other project (`eat`, which stays
// `noindex` — see docs/plan.md). That project is a private tool for two
// people; this one is a job-hunting front door meant to be found, so
// crawlers get a blanket `Allow: /` rather than being kept out.
//
// A function export (not a static app/robots.txt file) so `Sitemap:` can
// point at SITE_URL/sitemap.xml without retyping the domain a second time —
// see content/facts.ts's SITE_URL comment for why that string lives in one
// place. Next.js still emits a plain-text /robots.txt from this at build
// time; nothing about the *output* is dynamic.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
