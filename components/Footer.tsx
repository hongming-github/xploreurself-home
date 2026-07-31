import type { FooterView } from "@/content/types";

// docs/plan.md section 3: footer = copyright + a link back to this site's
// own public source repo, "closing the loop" for a technical reader who
// wants to see how the page is built. `sourceHref` is a locale-independent
// fact (content/facts.ts's FOOTER_SOURCE_HREF) zipped in by
// content/site.ts's buildFooter — see content/facts.ts for why that link
// currently points at a repo that doesn't exist on GitHub yet.
export function Footer({ footer }: { footer: FooterView }) {
  return (
    <footer className="mt-12 flex flex-wrap items-center justify-between gap-x-4 gap-y-1 border-t border-border pt-6 text-sm text-text-muted">
      <p>{footer.copyright}</p>
      <a
        href={footer.sourceHref}
        className="underline decoration-border underline-offset-4 hover:text-accent hover:decoration-accent"
      >
        {footer.sourceLabel}
      </a>
    </footer>
  );
}
