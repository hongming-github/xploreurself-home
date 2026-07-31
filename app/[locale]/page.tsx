import { en } from "@/content/en";
import { zh } from "@/content/zh";
import type { Locale } from "@/content/ids";
import type { SiteContent } from "@/content/types";
import {
  buildContact,
  buildEducation,
  buildExperience,
  buildFooter,
  buildProjects,
} from "@/content/site";
import { Nav } from "@/components/Nav";
import { Prose } from "@/components/Prose";
import { ContactLinks } from "@/components/ContactLinks";
import { SectionHeading } from "@/components/SectionHeading";
import { ProjectRow } from "@/components/ProjectRow";
import { TimelineItem } from "@/components/TimelineItem";
import { Footer } from "@/components/Footer";

// This whole page is a Server Component (no "use client" here, and none is
// needed): every section below is either static markup or reads directly
// from content/en.ts / content/zh.ts at build time. The only spot that
// needs the browser is <Nav> (locale switch, theme toggle, and
// active-section tracking) — isolated into its own small Client Component,
// exactly the "Layout is a Server Component with an interactive island"
// pattern from the Next.js docs. Because nothing here reads cookies(),
// headers(), searchParams, or uses force-dynamic, and generateStaticParams
// in layout.tsx enumerates both locales, `next build` renders /en and /zh
// once each at build time — the "○ Static" marker in the build output.
// generateStaticParams and dynamicParams=false live in layout.tsx, not
// here — they're segment config for `[locale]` as a whole, and defining
// them twice for the same segment would just be two sources of truth for
// one answer.
const CONTENT: Record<Locale, SiteContent> = { en, zh };

// `params` is typed with `locale: string`, not `Locale`, for the same
// reason as app/[locale]/layout.tsx's generateMetadata: that's the type
// Next.js's own generated PageProps expects. The cast below is safe because
// layout.tsx's `dynamicParams = false` guarantees this page never renders
// for a `locale` outside LOCALES.
export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const content = CONTENT[locale as Locale];

  // content/site.ts zips this locale's prose together with the shared
  // numbers/URLs in content/facts.ts into the flat shapes ProjectRow,
  // TimelineItem, and LinkRow already know how to render — see that file's
  // header comment.
  const projects = buildProjects(content);
  const experience = buildExperience(content);
  const education = buildEducation(content);
  // No `content` argument — the contact block's three values are
  // locale-independent (see content/facts.ts's CONTACT_LINKS), so there's
  // no locale prose for buildContact to zip in, unlike the calls above.
  const contact = buildContact();
  const footer = buildFooter(content);

  const navItems = [
    { id: "work", label: content.nav.work },
    { id: "experience", label: content.nav.experience },
    { id: "education", label: content.nav.education },
  ];

  return (
    <>
      {/* Page header — name, positioning, contact. Not sticky: this is
          identity, read once, not a tool you need reachable mid-scroll. */}
      <header className="mx-auto w-full max-w-[68ch] px-6 pt-12 sm:px-8">
        <div className="space-y-10">
          <p className="font-medium text-text">{content.name}</p>

          <Prose>
            {content.positioning.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </Prose>

          <ContactLinks items={contact} />
        </div>
      </header>

      {/* Sticky nav — section anchors plus the locale switch and theme
          toggle, so both stay reachable no matter how far down a reader
          has scrolled. See components/Nav.tsx for why it must be a Client
          Component and how the active-section highlight works. */}
      <Nav items={navItems} />

      <main className="mx-auto w-full max-w-[68ch] px-6 pb-12 sm:px-8">
        {/* space-y-14 (wider than the space-y-10 used for header content
            above) so each section boundary reads as a real break. */}
        <div className="space-y-14 pt-10">
          {/* Selected work — differentiation before résumé, per
              docs/plan.md section 3. `scroll-mt-16` offsets anchor jumps by
              roughly the sticky nav's own height, so `#work` etc. land with
              the heading visible below the bar instead of hidden underneath
              it. Verified in a real browser, not assumed: see the DoD
              report. */}
          <section id="work" className="scroll-mt-16">
            <SectionHeading>{content.sections.work}</SectionHeading>
            <div className="mt-4">
              {projects.map((project) => (
                <ProjectRow key={project.name} project={project} />
              ))}
            </div>
          </section>

          {/* Experience timeline */}
          <section id="experience" className="scroll-mt-16">
            <SectionHeading>{content.sections.experience}</SectionHeading>
            <div className="mt-4">
              {experience.map((item) => (
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
            <SectionHeading>{content.sections.education}</SectionHeading>
            <div className="mt-4 space-y-3">
              {education.map((item) => (
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

        <Footer footer={footer} />
      </main>
    </>
  );
}
