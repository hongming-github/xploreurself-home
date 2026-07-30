import { en } from "@/content/en";
import { LocaleSwitch } from "@/components/LocaleSwitch";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Prose } from "@/components/Prose";
import { LinkRow } from "@/components/LinkRow";
import { SectionHeading } from "@/components/SectionHeading";
import { ProjectRow } from "@/components/ProjectRow";
import { TimelineItem } from "@/components/TimelineItem";
import { Footer } from "@/components/Footer";

// This whole page is a Server Component (no "use client" here, and none is
// needed): every section below is either static markup or reads directly
// from content/en.ts at build time. The only two spots that need the
// browser — the theme toggle and the locale switch — are isolated into
// their own small Client Components and dropped in as children, exactly
// the "Layout is a Server Component with an interactive Search island"
// pattern from the Next.js docs (node_modules/next/dist/docs/01-app/01-getting-started/05-server-and-client-components.md).
// Because nothing here reads cookies(), headers(), searchParams, or uses
// force-dynamic, `next build` can render this route once at build time
// instead of on every request — that's what the "○ Static" marker in the
// build output means.
export default function Home() {
  return (
    <main className="mx-auto w-full max-w-[68ch] px-6 py-12 sm:px-8">
      <div className="space-y-10">
        {/* 1. Identity row */}
        <div className="flex items-center justify-between">
          <p className="font-medium text-text">{en.name}</p>
          <div className="flex items-center gap-4">
            <LocaleSwitch />
            <ThemeToggle />
          </div>
        </div>

        {/* 2. Positioning statement */}
        <Prose>
          {en.positioning.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </Prose>

        {/* 3. Contact row */}
        <LinkRow items={en.contact} />

        {/* 4. Selected work — differentiation before résumé, per
            docs/plan.md section 3: "项目是差异化，经历是资历". */}
        <section>
          <SectionHeading>Selected Work</SectionHeading>
          <div className="mt-4">
            {en.work.map((project) => (
              <ProjectRow key={project.name} project={project} />
            ))}
          </div>
        </section>

        {/* 5. Experience timeline */}
        <section>
          <SectionHeading>Experience</SectionHeading>
          <div className="mt-4">
            {en.experience.map((item) => (
              <TimelineItem key={`${item.org}-${item.period}`} item={item} />
            ))}
          </div>
        </section>

        {/* 6. Education — three short rows, plain markup: docs/plan.md asks
            for "3 lines", not enough structure to earn its own component. */}
        <section>
          <SectionHeading>Education</SectionHeading>
          <div className="mt-4 space-y-3">
            {en.education.map((item) => (
              <p key={`${item.org}-${item.program}`} className="text-text">
                <span className="font-medium">{item.org}</span>
                <span className="text-text-muted"> — {item.program} </span>
                <span className="font-mono text-xs text-text-muted">
                  ({item.period})
                </span>
              </p>
            ))}
          </div>
        </section>
      </div>

      {/* 7. Footer */}
      <Footer footer={en.footer} />
    </main>
  );
}
