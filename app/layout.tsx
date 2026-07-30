import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { buildThemeInitScript } from "@/lib/theme";
import { en } from "@/content/en";

// next/font self-hosts these two fonts and writes their computed font-family
// (plus @font-face rules) onto a CSS variable — --font-geist-sans /
// --font-geist-mono — rather than a className with a fixed font-family. We
// read those variables back inside app/globals.css's `@theme inline` block,
// appended with the explicit Chinese fallback chain from docs/plan.md
// section 4. Only "latin" is requested here: Geist itself has no CJK glyphs
// to subset, so there'd be nothing to gain from a larger subset — the CJK
// glyphs come entirely from the OS-installed fallback fonts, not from this
// download.
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: en.meta.title,
  description: en.meta.description,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable}`}
      // The blocking script below (id="theme-init") sets `data-theme`
      // directly on this element before React hydrates, based on
      // localStorage — something the server has no way to know when it
      // renders this same <html> tag without that attribute. React would
      // otherwise flag that as a hydration mismatch and log a warning on
      // every load. suppressHydrationWarning tells React "I know this one
      // attribute on this one element is expected to differ, don't warn
      // about it" — it does not suppress mismatches anywhere else in the
      // tree, only on this element.
      suppressHydrationWarning
    >
      <body className="bg-bg text-text antialiased">
        {/*
          Why this script exists and why it must load `beforeInteractive`:
          the theme is decided by a `data-theme` attribute on <html> (see
          app/globals.css), but that attribute only gets set by
          components/ThemeToggle.tsx — a Client Component that can't run
          until React hydrates. Without this script, a returning visitor who
          chose "light" on a dark-mode OS would see one flash of dark, then
          a jump to light, on every page load. `beforeInteractive` is the one
          next/script strategy documented to inject into the initial HTML
          and run before hydration, which is exactly the window we need to
          close. It touches only localStorage and one DOM attribute — no
          framework state — which is why it's plain JS in a string, not a
          Client Component.
        */}
        <Script id="theme-init" strategy="beforeInteractive">
          {buildThemeInitScript()}
        </Script>
        {children}
      </body>
    </html>
  );
}
