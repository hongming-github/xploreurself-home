import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { WORK_SLUGS, loadArticle, type WorkSlug } from "@/content/articles";
import { SITE_URL } from "@/content/facts";

// Same P5 finding app/[locale]/opengraph-image.tsx's own comment documents,
// one level deeper: a file-based image route does NOT inherit its page's
// generateStaticParams, even when (as here) it's nested two dynamic
// segments deep. Without this export, `next build`'s route table would
// show this as `ƒ` (server-rendered on demand) with no PNG on disk — see
// this phase's delivery report for the confirmed build output. Only `en`,
// matching the page's own generateStaticParams: deep-dive articles have no
// /zh version to generate an image for.
export function generateStaticParams() {
  return WORK_SLUGS.map((slug) => ({ locale: "en", slug }));
}

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
// Not per-article (Next's file-based image conventions read `alt` as a
// static export, not from `params`) — same accepted imprecision as
// app/[locale]/opengraph-image.tsx's single English `alt` already covering
// both /en and /zh's differently-worded cards.
export const alt = "Hongming Zhao — deep-dive article";

// Same two font sources as app/[locale]/opengraph-image.tsx, and for the
// same reasons documented there — see that file for the fuller comment.
// Only Geist Sans + Geist Mono are needed here, never Noto Sans SC: these
// articles are English only, so there's no Chinese glyph this card ever
// has to render.
const NEXT_OG_DIR = join(
  process.cwd(),
  "node_modules",
  "next",
  "dist",
  "compiled",
  "@vercel",
  "og",
);
const ASSETS_DIR = join(process.cwd(), "assets", "fonts");

export default async function Image({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { slug } = (await params) as { locale: string; slug: WorkSlug };
  const { frontmatter } = await loadArticle(slug);

  const [geistSans, geistMono] = await Promise.all([
    readFile(join(NEXT_OG_DIR, "Geist-Regular.ttf")),
    readFile(join(ASSETS_DIR, "geist-mono-subset.woff")),
  ]);

  const domain = new URL(SITE_URL).hostname;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundColor: "#0E0F12",
          padding: "88px",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column" }}>
          {/* Where the homepage card (app/[locale]/opengraph-image.tsx)
              puts the positioning sentence, this card puts the article
              title — docs/plan.md P4 item 5's explicit instruction. */}
          <div
            style={{
              display: "flex",
              fontFamily: "Geist",
              fontSize: 52,
              lineHeight: 1.3,
              color: "#E8E9EC",
              width: "980px",
            }}
          >
            {frontmatter.title}
          </div>

          {/* Same hairline-rule-instead-of-a-second-weight trick as the
              homepage card, for the same reason: Geist Regular is the only
              weight available (see that file's font comment), so hierarchy
              comes from size and this border token. */}
          <div
            style={{
              display: "flex",
              width: "96px",
              height: "1px",
              backgroundColor: "#23252B",
              marginTop: "32px",
              marginBottom: "32px",
            }}
          />

          <div
            style={{
              display: "flex",
              fontFamily: "Geist Mono",
              fontSize: 22,
              letterSpacing: "0.02em",
              color: "#9A9EA6",
            }}
          >
            Hongming Zhao
          </div>
        </div>

        <div
          style={{
            display: "flex",
            fontFamily: "Geist Mono",
            fontSize: 26,
            letterSpacing: "0.02em",
            color: "#9A9EA6",
          }}
        >
          {domain}
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Geist", data: geistSans, weight: 400, style: "normal" },
        { name: "Geist Mono", data: geistMono, weight: 500, style: "normal" },
      ],
    },
  );
}
