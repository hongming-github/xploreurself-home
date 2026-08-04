import { ViewTransition } from "react";
import type { NoteRowView } from "@/content/types";
import { LinkRow } from "./LinkRow";

/**
 * A row in the homepage's Notes section: title, one-line summary, date.
 * components/ProjectRow.tsx carries metric pairs, a tech-stack tag list,
 * and a multi-item link group — a note has none of those, just a link to
 * the note itself. A boolean "mode" prop on ProjectRow to cover this case
 * would leave most of that component's props meaningless whenever the flag
 * was set; a small sibling component says plainly what a note row actually
 * renders, the same call docs/plan.md section 十一 already made for
 * components/ContactLinks.tsx vs components/LinkRow.tsx.
 *
 * `linkLabel` is passed in rather than hardcoded, because it's this
 * component's one piece of locale-dependent text *for the link itself*:
 * content/en.ts's `linkLabels.article` ("Read the write-up") and
 * content/zh.ts's version ("深度长文（English）") are the *existing*
 * mechanism the project already uses to mark an English-only deep-dive
 * destination on the Chinese page — reusing that key here (rather than
 * inventing a second "this is English" marker) is what docs/plan.md's
 * brief for this phase asked for.
 *
 * `note.title` stays the same English text on both locales — it's the
 * artifact's name, like a project's `name` (e.g. "redblue"), which is
 * likewise never translated. `note.summary`, unlike the title, IS
 * bilingual: it's card copy, the same category as a ProjectRow's
 * `description`, and every other card on this page already translates its
 * description even when the card links to an English-only destination
 * (see content/types.ts's NoteCopy comment). The note's *body* stays
 * English only (docs/plan.md decision 4 + section 九) — only this one-line
 * summary is bilingual, exactly as the project cards already are.
 */
export function NoteRow({
  note,
  href,
  linkLabel,
}: {
  note: NoteRowView;
  href: string;
  linkLabel: string;
}) {
  return (
    <div className="border-b border-border py-6 first:pt-0 last:border-b-0">
      {/* Shares its `name` with the matching <ViewTransition> around the
          <h1> on app/[locale]/notes/[slug]/page.tsx — same mechanism as
          components/ProjectRow.tsx's article link, keyed off the note's
          `slug` (there's no separate "project identity" for a note to key
          off instead). */}
      <ViewTransition name={`note-${note.slug}`}>
        <h3 className="text-text font-medium">{note.title}</h3>
      </ViewTransition>
      {/* Substance, not metadata — full `text` colour, same rule
          components/ProjectRow.tsx's description gets. */}
      <p className="mt-1 max-w-[60ch] text-text">{note.summary}</p>

      <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1.5 text-sm">
        <LinkRow items={[{ label: linkLabel, href }]} />
        {/* Date is metadata (when, not what) — `text-muted`, mono, same
            treatment content/types.ts reserves for dates elsewhere. */}
        <span className="font-mono text-xs text-text-muted">{note.date}</span>
      </div>
    </div>
  );
}
