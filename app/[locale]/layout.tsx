import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import "../globals.css";
import { buildThemeInitScript } from "@/lib/theme";
import { LOCALES, type Locale } from "@/content/ids";
import { en } from "@/content/en";
import { zh } from "@/content/zh";
import type { SiteContent } from "@/content/types";
import { SITE_URL } from "@/content/facts";

// Phase P3: this file replaces app/layout.tsx as the project's ROOT layout.
// The Next.js docs' internationalization guide is explicit that the root
// layout "can also be nested in the new folder (e.g. app/[lang]/layout.js)"
// (node_modules/next/dist/docs/01-app/02-guides/internationalization.md) —
// there is nothing left at app/ for a separate app/layout.tsx to do once
// every page lives under app/[locale]/, so this IS the top of the tree now.
// It still must define <html> and <body> itself, same as any root layout.
const CONTENT: Record<Locale, SiteContent> = { en, zh };

// next/font self-hosts these two fonts and writes their computed
// font-family onto a CSS variable rather than a fixed value — see
// app/globals.css for how the Chinese fallback chain gets appended to it.
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// generateStaticParams is what makes `next build` render /en and /zh once,
// ahead of time, instead of on every request — the "○ Static" marker in the
// build output. Pairing it with `dynamicParams = false` below is what makes
// an unlisted locale like /fr 404 instead of silently rendering: without
// that second export, Next.js would treat /fr as "not generated yet" and
// try to render it on demand at request time using whatever `locale` string
// showed up in the URL, which would blow up the moment CONTENT[locale]
// below turns out to be undefined.
export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

export const dynamicParams = false;

// generateMetadata (rather than a static `export const metadata`) because
// the title/description genuinely depend on which locale segment this is —
// see the Next.js docs on generateMetadata: "Dynamic metadata depends on
// dynamic information, such as the current route parameters". `params` is a
// Promise here (Next 16 requirement — see AGENTS.md), so it has to be
// awaited, the same way you'd `await` an async DB call in Python rather
// than treat it as already-resolved.
// `params` is typed as `Promise<{ locale: string }>`, not
// `Promise<{ locale: Locale }>`: Next.js generates its own `LayoutProps`
// type for this segment (from the route file structure, not from our
// content types) with `locale: string`, since in principle a URL can
// contain anything. Narrowing it to `Locale` here would make this
// function's signature incompatible with the one Next.js's build-time type
// checking expects. The cast to `Locale` just below is safe specifically
// *because* `dynamicParams = false` plus `generateStaticParams` above mean
// Next.js never calls this function with any `locale` other than the ones
// in LOCALES — anything else 404s before rendering gets this far.
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const content = CONTENT[locale as Locale];

  // Every URL-shaped field below is written as a path relative to
  // metadataBase ("/en", not "https://xploreurself.com/en") rather than
  // concatenating SITE_URL onto each one by hand. That's what the Next.js
  // docs' metadataBase section recommends — "URL composition favors
  // developer intent" — and it means SITE_URL is only ever typed out once
  // in this function (right below), not once per field.
  const path = `/${locale}`;

  // Open Graph's `locale` field wants an underscore-joined language_TERRITORY
  // tag (en_US, zh_CN) — a different format from the `en`/`zh` this project
  // otherwise uses everywhere else (URL segments, <html lang>, LOCALES).
  // That's why this is a small literal branch here instead of a third field
  // threaded through content/ids.ts: nothing else in the codebase needs the
  // underscore form, so giving it a shared home would just be a lookup
  // table with one caller.
  const ogLocale = locale === "en" ? "en_US" : "zh_CN";

  return {
    title: content.meta.title,
    description: content.meta.description,

    // Without this, Next.js warns at build time on every relative URL below
    // and would otherwise have no base to resolve them against, so every
    // OG/canonical URL on the page would resolve relative to whatever host
    // actually served the request — wrong the moment this deploys anywhere
    // but xploreurself.com itself (a Vercel preview URL, a fork, etc).
    metadataBase: new URL(SITE_URL),

    alternates: {
      canonical: path,
      // Both locales must list the *same* complete set here (including
      // themselves) — that's what tells Google "these two pages are
      // translations of each other" instead of "these are two unrelated
      // pages that happen to look similar" (the latter risks a duplicate-
      // content penalty). x-default is the entry a search engine falls
      // back to for a visitor whose language doesn't match either
      // alternate; it points at /en for the same reason proxy.ts's `/` →
      // `/en` redirect does — English is this site's default, not a
      // language-negotiated guess.
      languages: {
        en: "/en",
        zh: "/zh",
        "x-default": "/en",
      },
    },

    openGraph: {
      type: "website",
      locale: ogLocale,
      url: path,
      siteName: "xploreurself.com",
      title: content.meta.title,
      description: content.meta.description,
      // No `images` field here on purpose: app/[locale]/opengraph-image.tsx
      // is a *file-based* convention colocated in this same route segment,
      // and the Next.js docs are explicit that file-based metadata "has the
      // higher priority and will override" whatever a manual `images` array
      // here would say. Setting both would just be two sources of truth for
      // one og:image tag, with the file always winning anyway.
    },

    twitter: {
      card: "summary_large_image",
      title: content.meta.title,
      description: content.meta.description,
      // No `images` field here either — same reasoning as openGraph above,
      // and verified rather than assumed: curling the built `/en` page
      // shows Next.js already emits a real `twitter:image` meta tag
      // pointing at the same file-based opengraph-image.tsx URL, with no
      // second render and nothing declared here. One image, one build step,
      // both card formats covered.
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;

  return (
    <html
      lang={locale}
      className={`${geistSans.variable} ${geistMono.variable}`}
      // The blocking script below sets `data-theme` before React hydrates,
      // based on localStorage — something the server can't know when it
      // renders this same <html> tag. suppressHydrationWarning tells React
      // "this one attribute on this one element is expected to differ,
      // don't warn" — it doesn't suppress mismatches anywhere else.
      suppressHydrationWarning
    >
      <body className="bg-bg text-text antialiased">
        {/* beforeInteractive is the one next/script strategy documented to
            inject into the initial HTML and run before hydration — see
            lib/theme.ts for why this has to run before first paint. */}
        <Script id="theme-init" strategy="beforeInteractive">
          {buildThemeInitScript()}
        </Script>
        {children}
      </body>
    </html>
  );
}
