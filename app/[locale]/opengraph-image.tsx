import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { en } from "@/content/en";
import { zh } from "@/content/zh";
import { LOCALES, type Locale } from "@/content/ids";
import type { SiteContent } from "@/content/types";
import { SITE_URL } from "@/content/facts";

// One OG image per locale, generated at build time from this site's own
// design tokens (docs/plan.md section 4) rather than a generic template —
// near-black background, the same greys, the same two type families. This
// file lives inside app/[locale]/ (not app/) specifically so Next.js
// colocates a *different* image with each locale segment — see the Next.js
// docs on opengraph-image.tsx: "the more specific image will take
// precedence", and here there's no shared app/opengraph-image.tsx above it
// to override, just one file serving both /en and /zh via `params.locale`.

// opengraph-image.tsx is documented as "a specialized Route Handler", and
// unlike page.tsx/layout.tsx it does NOT inherit the [locale] segment's
// generateStaticParams from layout.tsx — verified the hard way: without
// this export, `next build`'s route table printed this as `ƒ` (server-
// rendered on demand) instead of prerendered, and no PNG existed in
// .next/server/app/[locale]/opengraph-image at all, only a route.js. Route
// Handlers are their own rendering unit, so they need their own copy of
// the same enumeration layout.tsx already does for the page.
export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Hongming Zhao — AI Engineer, Singapore";

const CONTENT: Record<Locale, SiteContent> = { en, zh };

// --- Fonts ------------------------------------------------------------
//
// `ImageResponse` (satori under the hood) needs real font *bytes* — TTF,
// OTF, or WOFF only, not WOFF2 (see the Next.js ImageResponse docs) — not
// the CSS variable next/font hands the rest of the site. Three different
// answers for the three type needs on this card, in decreasing order of
// how easy they were to get honestly:
//
// 1. Geist Sans (the name, the positioning sentence): Next.js itself
//    ships a real Geist-Regular.ttf inside its own compiled OG package —
//    it's what `next/og` falls back to when you don't pass a `fonts`
//    option at all (see index.node.js in that package: `name: "geist"`).
//    Reading it from here means the site's actual Latin body font, with
//    zero new dependency and zero network fetch of any kind. The
//    trade-off: this is next's own internal file layout, not a
//    documented public path, so a future `next` upgrade could move or
//    remove it — if that happens this file fails loudly at build time
//    (ENOENT), not silently in a wrong font.
//
// 2. Geist Mono (the "xploreurself.com" line) and Noto Sans SC (the
//    Chinese card's CJK glyphs — Geist itself has none, same fact
//    docs/plan.md's font-fallback-chain note already makes for the
//    on-page body copy): no copy of either exists anywhere in
//    node_modules or as a usable font format on this machine (the
//    system's own CJK fonts are .ttc collections, a format satori can't
//    read, and are macOS-only besides — no help for a Linux build on
//    Vercel). Getting real glyphs for these two meant a one-time,
//    outside-the-build network fetch (Google Fonts' CSS2 API, requested
//    with an old-browser User-Agent string so it serves WOFF instead of
//    WOFF2) to vendor a *subset* — only the exact characters this file
//    renders, not the full families — into assets/fonts/. `next build`
//    itself never touches the network: both files are checked into this
//    repo and read with the same `readFile` call as #1. This is the one
//    deviation from "no dependency, no network fetch" the brief for this
//    phase asked to have flagged; see the delivery report for the
//    reasoning and the exact regeneration steps if the rendered text here
//    ever changes and the subset needs new glyphs.
const ASSETS_DIR = join(process.cwd(), "assets", "fonts");
const NEXT_OG_DIR = join(
  process.cwd(),
  "node_modules",
  "next",
  "dist",
  "compiled",
  "@vercel",
  "og",
);

// Matches the shape ImageResponse's `fonts` option expects (see the
// Next.js ImageResponse docs). Named and declared up front rather than
// letting TypeScript infer it from the array literal below: inference
// would narrow `weight`/`style` to the literal values of the *first* two
// entries pushed, which then rejects the third `fonts.push(...)` call for
// the zh-only Noto entry below with a different weight.
type OgFont = {
  name: string;
  data: Buffer;
  weight: 400 | 500;
  style: "normal" | "italic";
};

async function loadFonts(locale: Locale): Promise<OgFont[]> {
  const [geistSans, geistMono] = await Promise.all([
    readFile(join(NEXT_OG_DIR, "Geist-Regular.ttf")),
    readFile(join(ASSETS_DIR, "geist-mono-subset.woff")),
  ]);

  const fonts: OgFont[] = [
    { name: "Geist", data: geistSans, weight: 400, style: "normal" },
    { name: "Geist Mono", data: geistMono, weight: 500, style: "normal" },
  ];

  // The subset Noto Sans SC file only has glyphs for the exact Chinese
  // text rendered below (name, positioning sentence, domain) — see the
  // comment above. It's only loaded for /zh: shipping it into the /en
  // render would cost a file read for a font that page's ASCII-only text
  // would never fall through to.
  if (locale === "zh") {
    const notoSansSC = await readFile(join(ASSETS_DIR, "noto-sans-sc-subset.woff"));
    fonts.push({
      name: "Noto Sans SC",
      data: notoSansSC,
      weight: 400,
      style: "normal",
    });
  }

  return fonts;
}

export default async function Image({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = (await params) as { locale: Locale };
  const content = CONTENT[locale];
  const fonts = await loadFonts(locale);

  // Font-family stacks, same idea as app/globals.css's --font-sans: Geist
  // first, with a CJK-capable fallback appended only for the locale that
  // needs one. satori resolves a comma-separated family list per glyph the
  // same way a browser does, so English text inside the /zh card (the "AI"
  // in "新加坡 AI 工程师") still renders in Geist rather than Noto.
  const sansStack = locale === "zh" ? "Geist, Noto Sans SC" : "Geist";
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
        {/* Name + positioning sentence, grouped so the thin rule between
            them only separates these two, not the whole card. */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", fontFamily: "Geist", fontSize: 58, color: "#E8E9EC" }}>
            {content.name}
          </div>

          {/* A hairline rule instead of a second font weight — Geist
              Regular is the only weight available (see the font comment
              above), so hierarchy here comes from size and this border
              token, the same "restrained, no decoration" system the rest
              of the site uses (app/globals.css's --border). */}
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

          {/* The first positioning sentence, read from content/en.ts or
              content/zh.ts rather than retyped — see this file's header
              comment. Capped width so it wraps to 2–3 lines instead of
              running the full 1200px card edge to edge. */}
          <div
            style={{
              display: "flex",
              fontFamily: sansStack,
              fontSize: 38,
              lineHeight: 1.5,
              color: "#E8E9EC",
              width: "980px",
            }}
          >
            {content.positioning[0]}
          </div>
        </div>

        {/* Domain, small and muted, in the mono face — docs/plan.md
            section 4's own vocabulary for "this is metadata, not
            substance" (--text-muted), same distinction the on-page
            contact block and metric labels already use. */}
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
    { ...size, fonts },
  );
}
