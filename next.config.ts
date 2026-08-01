import type { NextConfig } from "next";
import createMDX from "@next/mdx";

// Security response headers. docs/plan.md P6.5/P6.6 has the audit behind this:
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
  // read by different audiences. `frame-ancestors` (below, part of the
  // CSP) is the modern form and the one browsers actually enforce;
  // X-Frame-Options is the older header that some scanners/checklists
  // still grep for specifically, so it stays for scanner hygiene even
  // though CSP supersedes it.
  {
    key: "X-Frame-Options",
    value: "DENY",
  },
  // Full CSP, one header — a response with two `Content-Security-Policy`
  // headers has both enforced and the effective policy is their
  // *intersection*, which is a confusing thing to debug later, so every
  // directive lives in this single string rather than being split across
  // multiple header entries.
  //
  // `script-src` keeps `'unsafe-inline'` on purpose — this is the one
  // directive in this policy that isn't fully locked down, and it's worth
  // explaining why rather than leaving it looking like an oversight.
  // Measured on the built page: 14 inline `<script>` blocks, almost all
  // of them Next's own streaming hydration payload
  // (`self.__next_f.push(...)`), whose contents change on every build.
  // The two standard alternatives to `'unsafe-inline'` both cost more
  // than this site's threat model justifies:
  //   - hashes: would mean extracting the hash of every inline script
  //     from the built HTML and feeding it back into this header — a
  //     pipeline that drifts (and silently breaks the site) the moment
  //     a build changes what Next inlines, which is every build.
  //   - nonces: need a fresh value per request, which forces every page
  //     using them out of static prerendering and into dynamic
  //     rendering — trading away the site's core property (fully static,
  //     no server) to guard an attack surface this site doesn't have:
  //     no user input, no query params rendered into the page, no
  //     database, every byte of content is a build-time constant.
  // So `'unsafe-inline'` here is a deliberate, measured trade-off, not
  // something to "fix" by hashing or nonce-ing later.
  //
  // Every other directive below is free — this page has zero inline
  // styles and loads zero external resources, so locking them down to
  // `'self'` (or `'none'`) costs nothing — and they're what actually
  // block the realistic attack path for a static site like this: a
  // compromised npm dependency injecting an *external* script
  // (`script-src 'self'` refuses it even with `'unsafe-inline'` present,
  // since that keyword only covers inline/attribute script, not
  // cross-origin script URLs), form-based exfiltration (`form-action
  // 'none'`, and this site has no forms anyway), `<base>` tag hijacking
  // that would silently redirect other relative URLs (`base-uri 'none'`),
  // and data exfiltration over fetch/XHR/WebSocket to an attacker's
  // origin (`connect-src 'self'`).
  {
    key: "Content-Security-Policy",
    value: [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline'",
      "style-src 'self'",
      "img-src 'self' data:",
      "font-src 'self'",
      "connect-src 'self'",
      "object-src 'none'",
      "base-uri 'none'",
      "form-action 'none'",
      "frame-ancestors 'none'",
    ].join("; "),
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
  // @next/mdx only compiles files ending in .mdx by default — this project
  // has no plain .md files, so unlike the Next.js MDX guide's own example
  // (node_modules/next/dist/docs/01-app/02-guides/mdx.md) this list omits
  // "md" rather than including a format nothing here uses. The other four
  // extensions are Next's own default `pageExtensions`; this array
  // *replaces* that default rather than adding to it, so they have to be
  // repeated here or .ts/.tsx pages would stop being recognised as pages
  // at all.
  pageExtensions: ["js", "jsx", "ts", "tsx", "mdx"],
  experimental: {
    // Enables Next's integration with React's <ViewTransition> component
    // (see components/ProjectRow.tsx and app/[locale]/work/[slug]/page.tsx
    // for the one pair this project uses it on) — node_modules/next/dist/
    // docs/01-app/03-api-reference/05-config/01-next-config-js/
    // viewTransition.md. React ships the component itself; this flag is
    // what makes a route navigation through next/link automatically count
    // as a transition, rather than only firing inside a manual
    // useTransition call.
    viewTransition: true,
  },
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

// remark-gfm is the one plugin added on top of bare @next/mdx, and it's
// load-bearing, not decorative: pipe tables (`| a | b |`) are a GitHub
// Flavored Markdown extension, not part of CommonMark, and @mdx-js/mdx's
// default parser only understands CommonMark. Verified the hard way —
// without this plugin, content/work/redblue.mdx's "Both readings" table
// rendered as one literal-pipe-characters paragraph, not a <table> at all,
// which is a broken implementation of the P4 brief's explicit "Prose must
// handle tables" requirement, not a stylistic gap. Fenced code blocks don't
// need it (those are plain CommonMark already, no GFM extension involved) —
// this plugin exists for the tables alone. No other remark/rehype plugin is
// added (no syntax highlighter, no table of contents, ...).
//
// Passed as the string "remark-gfm", not the imported function — Turbopack
// (this project's bundler; see AGENTS.md) can't serialize a plugin function
// reference across the Rust/JS boundary, and errors at build time
// ("does not have serializable options") if you try. The Next.js MDX guide
// covers this exact case (node_modules/next/dist/docs/01-app/02-guides/
// mdx.md, "Using Plugins with Turbopack"): a string module specifier lets
// Turbopack resolve the plugin by name on its own side instead.
const withMDX = createMDX({
  options: {
    remarkPlugins: ["remark-gfm"],
  },
});

export default withMDX(nextConfig);
