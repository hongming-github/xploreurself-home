import type { NextConfig } from "next";

// Security response headers. docs/plan.md P6.5 has the audit behind this:
// zero API routes, zero Server Actions, zero forms, zero `process.env`
// reads. The only runtime code is proxy.ts (a fixed `/` -> `/en` redirect),
// and the one `dangerouslySetInnerHTML` (the JSON-LD block) is fed from
// build-time constants with `<` escaped. So none of this is patching a
// live hole — it's defence-in-depth and scanner hygiene for a site that,
// by construction, has no injection points, no session, and no state to
// hijack. Picking the strictest value that can't break anything, rather
// than a generic "security headers" list copied from a blog post.
const securityHeaders = [
  // Stops the browser from re-guessing content-types (e.g. treating a
  // response as executable script because its bytes look script-ish
  // instead of trusting the Content-Type Next.js already sent). Nothing
  // on this site depends on MIME-sniffing, so there's no cost to this.
  {
    key: "X-Content-Type-Options",
    value: "nosniff",
  },
  // Clickjacking defence: stop this site's pages from being framed inside
  // someone else's page. Two headers for one goal because the two are
  // read by different audiences. `frame-ancestors` is the modern CSP form
  // and the one browsers actually enforce; X-Frame-Options is the older
  // header that some scanners/checklists still grep for specifically, so
  // it stays for scanner hygiene even though CSP supersedes it.
  //
  // Deliberately setting *only* `frame-ancestors` here, not a full CSP
  // with `default-src`/`script-src`. A CSP only restricts the directives
  // it names; with no `default-src` fallback, the other directives are
  // simply not enforced. That's what keeps this safe to ship today: the
  // two inline scripts on this site (the theme anti-flash script and the
  // JSON-LD block) are untouched by a CSP that only speaks about framing.
  // A real script-src CSP needs hashes for those two inline scripts —
  // that's real work, deliberately out of scope here, tracked as its own
  // follow-up rather than half-done in this pass.
  {
    key: "X-Frame-Options",
    value: "DENY",
  },
  {
    key: "Content-Security-Policy",
    value: "frame-ancestors 'none'",
  },
  // When a link on this site is followed, don't leak the full URL
  // (including path/query) to other-origin destinations — only the
  // origin. Same-origin navigations still get the full referrer, which is
  // harmless and occasionally useful (e.g. analytics). There's no query
  // string or path segment on this site that's sensitive, but there's
  // also no reason to hand it out by default.
  {
    key: "Referrer-Policy",
    value: "strict-origin-when-cross-origin",
  },
  // Explicitly deny browser features this static page never calls:
  // camera, microphone, geolocation. An empty allowlist `()` means "not
  // even this origin," which is correct since nothing here ever requests
  // them. `interest-cohort=()` (the old FLoC opt-out) is deliberately
  // left out — FLoC was discontinued industry-wide years ago, so that
  // directive is now cargo cult copied between config files rather than
  // something anyone chose for a reason; including it would just signal
  // this list was copied, not thought through.
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=()",
  },
];

// No Strict-Transport-Security header here, on purpose. Vercel (the host)
// already injects `Strict-Transport-Security: max-age=63072000` on every
// response, verified against the live site. Setting a second HSTS header
// from the app risks a weaker value winning at the client, and gains
// nothing over what the platform already guarantees — so the correct move
// is to leave it alone, not to duplicate it "for completeness."
const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        // Matches every route, same as Python's `@app.route("/<path:_>")`
        // catch-all would: static pages, robots.txt, sitemap.xml, the OG
        // image routes, and the redirect proxy.ts issues for `/`.
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
