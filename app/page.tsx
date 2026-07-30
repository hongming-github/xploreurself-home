import { en } from "@/content/en";
import { Nav } from "@/components/Nav";
import { Prose } from "@/components/Prose";
import { LinkRow } from "@/components/LinkRow";
import { SectionHeading } from "@/components/SectionHeading";
import { ProjectRow } from "@/components/ProjectRow";
import { TimelineItem } from "@/components/TimelineItem";
import { Footer } from "@/components/Footer";

// This whole page is a Server Component (no "use client" here, and none is
// needed): every section below is either static markup or reads directly
// from content/en.ts at build time. The only spot that needs the browser is
// <Nav> (locale switch, theme toggle, and active-section tracking all live
// inside it now) — isolated into its own small Client Component and dropped
// in as a child, exactly the "Layout is a Server Component with an
// interactive Search island" pattern from the Next.js docs
// (node_modules/next/dist/docs/01-app/01-getting-started/05-server-and-client-components.md).
// Because nothing here reads cookies(), headers(), searchParams, or uses
// force-dynamic, `next build` can render this route once at build time
// instead of on every request — that's what the "○ Static" marker in the
// build output means.
//
// Layout is three siblings, not one wrapping <main>: a non-sticky <header>
// (name, positioning, contact — scrolls away normally), the sticky <Nav>,
// and <main> holding the three anchorable sections. Splitting them this way
// means <Nav>'s `sticky top-0` has nothing above it in the document but the
// header, so it starts pinning to the viewport top exactly when the header
// scrolls out of view — an element can only ever stick to the top of *its
// own* scroll container, not to "after the header", so the ordering here is
// what produces that behaviour, not any explicit offset.
const NAV_ITEMS = [
  { id: "work", label: en.nav.work },
  { id: "experience", label: en.nav.experience },
  { id: "education", label: en.nav.education },
];

export default function Home() {
  return (
    <>
      {/* Page header — name, positioning, contact. Not sticky: this is
          identity, read once, not a tool you need reachable mid-scroll. */}
      <header className="mx-auto w-full max-w-[68ch] px-6 pt-12 sm:px-8">
        <div className="space-y-10">
          <p className="font-medium text-text">{en.name}</p>

          <Prose>
            {en.positioning.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </Prose>

          <LinkRow items={en.contact} />
        </div>
      </header>

      {/* Sticky nav — section anchors plus the locale switch and theme
          toggle, so both stay reachable no matter how far down a reader
          has scrolled. See components/Nav.tsx for why it must be a Client
          Component and how the active-section highlight works. */}
      <Nav items={NAV_ITEMS} />

      <main className="mx-auto w-full max-w-[68ch] px-6 pb-12 sm:px-8">
        {/* space-y-14 (wider than the space-y-10 used for header content
            above) so each section boundary reads as a real break, now that
            the boundary can no longer lean on SectionHeading being muted —
            see components/SectionHeading.tsx. */}
        <div className="space-y-14 pt-10">
          {/* Selected work — differentiation before résumé, per
              docs/plan.md section 3: "项目是差异化，经历是资历".
              `scroll-mt-16` (64px) offsets anchor jumps by roughly the
              sticky nav's own height, so `#work` etc. land with the heading
              visible below the bar instead of hidden underneath it — the
              classic sticky-header-plus-anchor-link bug. Verified in a real
              browser, not assumed: see the DoD report. */}
          <section id="work" className="scroll-mt-16">
            <SectionHeading>Selected Work</SectionHeading>
            <div className="mt-4">
              {en.work.map((project) => (
                <ProjectRow key={project.name} project={project} />
              ))}
            </div>
          </section>

          {/* Experience timeline */}
          <section id="experience" className="scroll-mt-16">
            <SectionHeading>Experience</SectionHeading>
            <div className="mt-4">
              {en.experience.map((item) => (
                <TimelineItem
                  key={`${item.org}-${item.period}`}
                  item={item}
                />
              ))}
            </div>
          </section>

          {/* Education — three short rows, plain markup: docs/plan.md asks
              for "3 lines", not enough structure to earn its own component. */}
          <section id="education" className="scroll-mt-16">
            <SectionHeading>Education</SectionHeading>
            <div className="mt-4 space-y-3">
              {en.education.map((item) => (
                <p key={`${item.org}-${item.program}`} className="text-text">
                  <span className="font-medium">{item.org}</span>
                  {/* The programme name is substance (what was studied),
                      not metadata — full `text` colour. Only the
                      parenthetical year range that follows is metadata. */}
                  <span className="text-text"> — {item.program} </span>
                  <span className="font-mono text-xs text-text-muted">
                    ({item.period})
                  </span>
                </p>
              ))}
            </div>
          </section>
        </div>

        <Footer footer={en.footer} />
      </main>
    </>
  );
}
