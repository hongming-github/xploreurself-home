import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import "../globals.css";
import { buildThemeInitScript } from "@/lib/theme";
import { LOCALES, type Locale } from "@/content/ids";
import { en } from "@/content/en";
import { zh } from "@/content/zh";
import type { SiteContent } from "@/content/types";

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
  return {
    title: content.meta.title,
    description: content.meta.description,
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
