import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Next.js 16 renamed `middleware.ts` to `proxy.ts` (AGENTS.md, and the
// Next.js docs at node_modules/next/dist/docs/01-app/03-api-reference/
// 03-file-conventions/proxy.md) — same mechanism, new name, still exactly
// one file per project, still at the project root.
//
// `/` has no page component anywhere in app/ — there's no app/page.tsx,
// only app/[locale]/page.tsx — so a visit to `/` would otherwise 404. This
// is the one place that redirect is expressed. docs/plan.md explicitly asks
// for this to be a fixed redirect rather than one that reads the browser's
// Accept-Language header: sniffing headers makes the response depend on who's
// asking (worse for caching, and Google's own guidance is against
// auto-redirecting by language), so every visitor to `/` lands on the same
// /en, full stop.
//
// 308 (Permanent Redirect) rather than the NextResponse.redirect() default
// of 307 (Temporary): this mapping is fixed indefinitely, not a
// one-time-until-we-add-real-negotiation stopgap, so search engines and
// browsers should be told to stop asking `/` and go straight to `/en` next
// time.
export function proxy(request: NextRequest) {
  return NextResponse.redirect(new URL("/en", request.url), 308);
}

// Scoping the matcher to exactly `/` means this function does not run on
// every request (the default if `config` were omitted) — /en, /zh, static
// assets, and everything else skip it entirely and go straight to their
// prerendered HTML.
export const config = {
  matcher: "/",
};
