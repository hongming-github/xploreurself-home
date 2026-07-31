import { EXPERIENCE_IDS, PROJECT_IDS } from "./ids";
import {
  CONTACT_LINKS,
  EDUCATION_PERIODS,
  EXPERIENCE_FACTS,
  FOOTER_SOURCE_HREF,
  PROJECT_FACTS,
} from "./facts";
import type { Period } from "./facts";
import type {
  EducationView,
  ExperienceItem,
  FooterView,
  LinkItem,
  Project,
  SiteContent,
} from "./types";

// Turns a fact-layer Period into the string components actually render,
// e.g. { from: "2026-03" } + present="Present" -> "2026-03 – Present".
// This assembly happens here — not in content/facts.ts, not in
// content/en.ts/zh.ts — because a period mixes two things that must NOT
// live in the same string: `from`/`to` are digits, identical in every
// locale (a fact); "still ongoing" is a word, different per locale
// (prose). Storing "2026-03 – Present" as one opaque string, like the code
// did before this fix, forces that English word into data that's supposed
// to be locale-independent, which is exactly how "Present" ended up
// rendered on the Chinese page. Keeping the two apart until this seam,
// where a locale's `content` is already in scope, is what prevents that.
function formatPeriod(period: Period, present: string): string {
  return `${period.from} – ${period.to ?? present}`;
}

// Zips the locale-independent structure (content/ids.ts, content/facts.ts)
// together with one locale's prose (content/en.ts or content/zh.ts) into the
// flat arrays the existing components already know how to render. This is
// the one place that needs to know content is split into "facts" and
// "copy" at all — ProjectRow, TimelineItem, etc. still just take a
// Project[] / ExperienceItem[], same as before phase P3. Adding a locale
// later means adding a content/xx.ts file; these functions and every
// component stay untouched.

export function buildProjects(content: SiteContent): Project[] {
  return PROJECT_IDS.map((id) => {
    const fact = PROJECT_FACTS[id];
    const copy = content.work[id];
    return {
      name: fact.name,
      description: copy.description,
      metrics: fact.metrics.map((metric) => ({
        label: content.metricLabels[metric.key],
        value: metric.value,
        from: metric.from,
        sentiment: metric.sentiment,
      })),
      tags: fact.tags,
      links: fact.links.map((link) => ({
        label: content.linkLabels[link.key],
        href: link.href,
      })),
      note: copy.note,
    };
  });
}

export function buildExperience(content: SiteContent): ExperienceItem[] {
  return EXPERIENCE_IDS.map((id) => {
    const fact = EXPERIENCE_FACTS[id];
    const copy = content.experience[id];
    return {
      period: formatPeriod(fact.period, content.present),
      org: fact.org,
      role: copy.role,
      description: copy.description,
    };
  });
}

// Positional zip, same caveat content/types.ts's EducationItem comment
// already documents: education isn't Record<Id, ...>-guarded, so this
// trusts content/en.ts and content/zh.ts's `education` arrays to be the
// same length and order as content/facts.ts's EDUCATION_PERIODS. That's an
// accepted gap (three rows that essentially never change), not something
// this fix introduces.
export function buildEducation(content: SiteContent): EducationView[] {
  return content.education.map((item, i) => ({
    org: item.org,
    program: item.program,
    period: formatPeriod(EDUCATION_PERIODS[i], content.present),
  }));
}

export function buildContact(content: SiteContent): LinkItem[] {
  return CONTACT_LINKS.map((link) => ({
    label: content.linkLabels[link.key],
    href: link.href,
  }));
}

export function buildFooter(content: SiteContent): FooterView {
  return {
    copyright: content.footer.copyright,
    sourceLabel: content.footer.sourceLabel,
    sourceHref: FOOTER_SOURCE_HREF,
  };
}
