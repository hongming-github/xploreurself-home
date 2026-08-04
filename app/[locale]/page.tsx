import { en } from "@/content/en";
import { zh } from "@/content/zh";
import type { Locale } from "@/content/ids";
import type { SiteContent } from "@/content/types";
import { SITE_URL } from "@/content/facts";
import {
  buildContact,
  buildEducation,
  buildExperience,
  buildFooter,
  buildNotes,
  buildProjects,
  personSameAs,
} from "@/content/site";
import { Nav } from "@/components/Nav";
import { Prose } from "@/components/Prose";
import { ContactLinks } from "@/components/ContactLinks";
import { SectionHeading } from "@/components/SectionHeading";
import { ProjectRow } from "@/components/ProjectRow";
import { NoteRow } from "@/components/NoteRow";
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

// Two-word label for the JSON-LD Person block below — not new copy being
// invented for this phase: this exact phrase already appears inside
// content.meta.title for each locale ("... — AI Engineer, Singapore" /
// "... — AI 工程师，新加坡"). It's kept as its own small literal here rather
// than string-parsing meta.title apart, which would silently break if that
// title's punctuation ever changes shape.
const JOB_TITLE: Record<Locale, string> = {
  en: "AI Engineer",
  zh: "AI 工程师",
};

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

  // Notes section: a note row is a card, same as a ProjectRow, and every
  // other card on this page already gets a translated summary even when it
  // links to an English-only destination (redblue/jobagent's deep-dive
  // links) — see content/types.ts's NoteCopy comment. So this zips
  // *this locale's* card summary (content.notes) together with the note's
  // own frontmatter (slug/title/date, content/notes.ts's loadNote) the same
  // way buildProjects zips content.work with content/facts.ts's
  // PROJECT_FACTS. Only the note *body*, rendered on its own
  // English-only route, skips this locale split entirely (docs/plan.md
  // decision 4 + section 九).
  const notes = await buildNotes(content);

  // JSON-LD Person block — search engines can already read the name and
  // contact links off the rendered page, but structured data is what lets
  // a search engine connect this specific page to *this specific person*
  // rather than just indexing prose that happens to mention a name, which
  // matters for a page whose whole job is being found by someone searching
  // for this person by name. `sameAs` comes from content/facts.ts's
  // CONTACT_LINKS via personSameAs() — GitHub and LinkedIn only, not the
  // mailto: link, since schema.org's `sameAs` is for other profile pages
  // that identify the same person, not a contact method. Nothing here is
  // invented: every field is either content.name (already on the page),
  // JOB_TITLE (see its comment above), SITE_URL, or a URL already printed
  // on the page.
  const personJsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: content.name,
    jobTitle: JOB_TITLE[locale as Locale],
    url: `${SITE_URL}/${locale}`,
    sameAs: personSameAs(),
  };

  // Three anchors, not four — see content/types.ts's `nav` field comment
  // for the 375px overflow measurement that forced this. `background` is
  // deliberately mapped to the `#experience` id (the *last* entry in this
  // array), not a new `#background` section id: components/Nav.tsx's
  // end-of-page rule always lights the last item in `items` once the
  // reader hits the bottom of the page, and pointing that last item at
  // `experience` — the last section this array actually names — is what
  // keeps the highlight correct whether the reader is looking at
  // Experience or has scrolled on into Education below it, without
  // touching Nav.tsx itself. `education` keeps its own `id`/`scroll-mt-16`
  // (app/[locale]/page.tsx below) so a direct link to it still works; it
  // just isn't a nav target any more.
  const navItems = [
    { id: "work", label: content.nav.work },
    { id: "notes", label: content.nav.notes },
    { id: "experience", label: content.nav.background },
  ];

  return (
    <>
      {/* Structured data for search engines — no visual output. See the
          Next.js JSON-LD guide (node_modules/next/dist/docs/.../json-ld.md)
          for why a plain <script> tag is the recommended approach rather
          than next/script: this is data, not code that needs next/script's
          load-timing controls. The `<` escape guards against XSS if any
          interpolated string ever contained a literal `<` — none of the
          fields here currently can (they're a proper noun, a two-word job
          title, and URLs), but the docs call this out as the correct
          default regardless. */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(personJsonLd).replace(/</g, "\\u003c"),
        }}
      />

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

          <div>
            {/* Heading only — no `id`/`scroll-mt-16` and no entry in
                `navItems` above. docs/plan.md is explicit that this block
                doesn't get a nav anchor: it sits above the sticky nav and
                is on screen at every scroll position, so there's nothing
                for a jump-link to do that isn't already true. */}
            <SectionHeading>{content.sections.contact}</SectionHeading>
            <div className="mt-4">
              <ContactLinks items={contact} />
            </div>
          </div>
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
                <ProjectRow key={project.id} project={project} />
              ))}
            </div>
          </section>

          {/* Notes — the third content type (docs/plan.md's P4 deep-dive
              pipeline mirrored for short-form learning notes), between work
              and experience per this phase's brief: differentiation first,
              résumé after, same ordering rationale docs/plan.md section 三
              gives for putting work ahead of experience. */}
          <section id="notes" className="scroll-mt-16">
            <SectionHeading>{content.sections.notes}</SectionHeading>
            <div className="mt-4">
              {notes.map((note) => (
                <NoteRow
                  key={note.slug}
                  note={note}
                  // Always /en — there is no /zh/notes/* route (see
                  // content/notes.ts and app/[locale]/notes/[slug]/page.tsx's
                  // dynamicParams = false). linkLabel reuses
                  // content.linkLabels.article, the same mechanism
                  // components/ProjectRow.tsx's deep-dive links already use
                  // to mark an English-only destination on the Chinese
                  // page — not a second marker invented for this section.
                  href={`/en/notes/${note.slug}`}
                  linkLabel={content.linkLabels.article}
                />
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
