"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LOCALES, type Locale } from "@/content/ids";

// Short label shown in the switcher itself — deliberately separate from
// content/en.ts / content/zh.ts's `nav`/`sections` copy, because this label
// names the *other* language from the reader's own point of view ("EN" is
// meaningful to a Chinese reader, "中" to an English reader) rather than
// being a translation of anything on the page they're currently looking at.
const SWITCH_LABEL: Record<Locale, string> = { en: "EN", zh: "中" };

// Why this has to be a Client Component: figuring out "the current path"
// needs `usePathname`, a browser-navigation hook with no Server Component
// equivalent — the server rendering /en's HTML has no way to know a reader
// might later navigate to /en/work/redblue and expect the switcher to still
// work from there.
//
// Path-preserving by construction, not by special-casing today's one route:
// this splits the pathname into "locale segment" + "everything after it"
// and only ever replaces the first piece. Right now `rest` is always empty
// (the only route in either locale is the homepage), so both locales'
// hrefs happen to just be `/en` and `/zh` — but the logic already
// generalizes to phase P4's `/en/work/[slug]` without changes here.
//
// Deliberately NOT handled yet (see docs/plan.md decision 4): P4's deep-dive
// articles are English-only by design, so `/en/work/redblue` has no /zh
// equivalent to switch to. What the switcher should do on that page — grey
// out, jump to /zh, jump to /zh/#work — is a P4 decision, not a P3 one; the
// `rest`-preserving shape below is written so that decision can be made
// later without a rewrite, not so it's already made.
export function LocaleSwitch() {
  const pathname = usePathname();
  const segments = pathname.split("/");
  const currentLocale = segments[1] as Locale;
  const rest = segments.slice(2).join("/");

  return (
    <div
      role="group"
      aria-label="Language"
      className="flex items-center gap-1.5 font-mono text-xs text-text-muted"
    >
      {LOCALES.map((locale, index) => (
        <span key={locale} className="flex items-center gap-1.5">
          {locale === currentLocale ? (
            <span aria-current="true" className="text-text">
              {SWITCH_LABEL[locale]}
            </span>
          ) : (
            <Link
              href={`/${locale}${rest ? `/${rest}` : ""}`}
              className="hover:text-text"
            >
              {SWITCH_LABEL[locale]}
            </Link>
          )}
          {index < LOCALES.length - 1 && (
            <span aria-hidden="true">/</span>
          )}
        </span>
      ))}
    </div>
  );
}
