import type { ComponentType, ReactNode } from "react";

/**
 * React 19.2 ships `<ViewTransition>` at runtime -- confirmed by grepping
 * the actual bundle Next.js compiles app code against:
 * node_modules/next/dist/compiled/react/cjs/react.development.js has
 * `exports.ViewTransition = REACT_VIEW_TRANSITION_TYPE`, and
 * node_modules/next/dist/compiled/react-dom/cjs/react-dom-client.development.js
 * has 300+ references to it in the reconciler. That's the "regular" bundle
 * Next uses by default (confirmed via node_modules/next/dist/lib/
 * needs-experimental-react.js: only `taint`/`transitionIndicator`/
 * `gestureTransition` switch Next to its "-experimental" React channel;
 * `experimental.viewTransition` in next.config.ts, which this project sets,
 * is not one of those three) -- so no React canary install is needed, only
 * this type, matching what the Next.js docs say ("You do not need to
 * install react@canary yourself").
 *
 * @types/react@19.2's main entry point hasn't caught up, though: only its
 * "canary" channel typings (node_modules/@types/react/canary.d.ts) know
 * about this component, and "react/canary" isn't a module Next actually
 * resolves "react" to (there's no such file in node_modules/react or in
 * Next's vendored copy) -- importing from it would type-check against the
 * wrong module and 404 at bundle time. This is the same situation
 * components/BrandIcons.tsx already solved for lucide-react: a runtime
 * capability shipped ahead of its own type declarations, so this project
 * types the one surface it actually uses instead of waiting or downgrading.
 */
declare module "react" {
  export const ViewTransition: ComponentType<{
    /** Shared identity across a navigation. A homepage project row and its
     *  article's <h1> pass the same `name` (see components/ProjectRow.tsx
     *  and app/[locale]/work/[slug]/page.tsx) so the browser morphs one
     *  into the other instead of a hard cut -- see the Next.js view
     *  transitions guide (node_modules/next/dist/docs/01-app/02-guides/
     *  view-transitions.md) for the fuller `enter`/`exit`/`share` API this
     *  project doesn't need and so doesn't type here. */
    name?: string;
    children?: ReactNode;
  }>;
}
