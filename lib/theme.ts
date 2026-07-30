// Shared, framework-agnostic theme constants.
//
// Why this file has no "use client" and no React in it at all: it gets
// imported from two very different places —
//   1. app/layout.tsx (a Server Component) uses THEME_STORAGE_KEY to build
//      the literal text of a blocking <script> tag that runs in the browser
//      BEFORE React ever loads.
//   2. components/ThemeToggle.tsx (a Client Component) imports the same
//      constant to read/write localStorage after hydration.
// If the key were hardcoded as the string "theme" in both places, they could
// drift apart silently (e.g. someone renames it in one file and not the
// other) and the toggle would stop matching what the blocking script reads.
// One constant, two consumers — same idea as sharing an Enum between two
// Python modules instead of typing the same magic string in both.
export const THEME_STORAGE_KEY = "theme";

export type ThemeMode = "system" | "light" | "dark";

/**
 * Builds the source of the blocking anti-flash script.
 *
 * Why this needs to run synchronously before paint: our CSS decides the
 * theme from `:root[data-theme="..."]`, with `@media (prefers-color-scheme)`
 * as the fallback. On first load there's no data-theme attribute yet, so if
 * the user previously chose "light" or "dark" explicitly, the page would
 * paint once with the OS default and then jump to their saved choice — a
 * visible flash. Reading localStorage and setting the attribute here, before
 * hydration, avoids that. "system" needs no entry: leaving the attribute
 * unset is exactly what lets the `prefers-color-scheme` media query decide.
 */
export function buildThemeInitScript(): string {
  return `(function(){try{var m=localStorage.getItem("${THEME_STORAGE_KEY}");if(m==="light"||m==="dark"){document.documentElement.setAttribute("data-theme",m);}}catch(e){}})();`;
}
