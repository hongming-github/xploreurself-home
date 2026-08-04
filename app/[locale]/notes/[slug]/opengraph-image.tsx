import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { NOTE_SLUGS, loadNote, type NoteSlug } from "@/content/notes";
import { SITE_URL } from "@/content/facts";

// Same P4/P5 finding this project has now hit three times (see
// app/[locale]/opengraph-image.tsx and
// app/[locale]/work/[slug]/opengraph-image.tsx's matching comments): a
// file-based image route does NOT inherit its page's generateStaticParams,
// even nested two dynamic segments deep. Without this export, `next
// build`'s route table would show this as `ƒ` (server-rendered on demand)
// with no PNG on disk. Only `en`, matching the page's own
// generateStaticParams — notes have no /zh version to generate an image
// for.
export function generateStaticParams() {
  return NOTE_SLUGS.map((slug) => ({ locale: "en", slug }));
}

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Hongming Zhao — learning note";

// Same two font sources as the work article's opengraph-image.tsx, for the
// same reasons documented there. Only Geist Sans + Geist Mono are needed —
// notes are English only, so there's no Chinese glyph this card ever has to
// render.
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
  const { slug } = (await params) as { locale: string; slug: NoteSlug };
  const { frontmatter } = await loadNote(slug);

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
          {/* Where the homepage card puts the positioning sentence and the
              work article card puts its title, this card puts the note's
              title — same layout, same reasoning, different content. */}
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
              other OG cards — Geist Regular is the only weight available. */}
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
