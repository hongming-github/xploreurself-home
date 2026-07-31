# Operations

How to change things on this site without breaking them. Written for future-me, who will
have forgotten all of this.

## Deploying

Push to `main`. Vercel builds and deploys on its own — there is no manual deploy step and no
environment variable to remember. A deploy takes about a minute.

Nothing here reads `process.env`, so there is no "I changed a variable but it didn't take
effect" failure mode.

## Editing an existing article

Edit the body of `content/work/<slug>.mdx`. That is the whole job — no registration, no
index to update.

```bash
npm run dev          # then open http://localhost:3000/en/work/<slug>
```

### MDX rules that will bite you

These are not stylistic preferences, they are things that fail loudly or silently:

- **Frontmatter is a JS export, not YAML.** The file starts with
  `export const frontmatter = { ... }`, not `---`. `@next/mdx` doesn't parse YAML
  frontmatter without an extra plugin that isn't installed.
- **A comment above that `export` line breaks the compiler.** MDX stops recognising the
  block as ESM and the parser chokes. Comments go *inside* the object literal.
- **Pipe tables work** — `remark-gfm` is installed specifically for this. Without it a table
  renders as a paragraph full of literal `|` characters. If you ever see that, the plugin
  config got lost.
- **Tables and code blocks need no special markup.** `Prose` wraps them so they scroll
  inside themselves on narrow screens. Don't hand-wrap them in divs.

## Adding an article for a project that already exists

1. Create `content/work/<slug>.mdx`, copying the `frontmatter` block from an existing one.
   `frontmatter.project` must be one of the ids in `content/ids.ts`.
2. Add `"<slug>"` to `WORK_SLUGS` in `content/articles.ts`.

   **This is the only registration step.** The route, the OG image, the sitemap entry, and
   the 404-guard for unknown slugs all derive from that one array.
3. Link it from the project card, in that project's entry in `content/facts.ts`:

   ```ts
   links: [{ kind: "translated", key: "article", href: "/en/work/<slug>" }],
   ```

   The leading `/` matters. `components/LinkRow.tsx` treats a root-relative href as an
   internal route and renders it with `next/link`; a plain `<a>` would do a full page load,
   and the View Transition to the article's heading would never fire.

## Adding a whole new project

More steps, because the two locales have to stay in sync — but the type system walks you
through it. Add the id first and let `tsc` tell you what's missing.

1. Add the id to `PROJECT_IDS` in `content/ids.ts`. Order in this array is the display order
   on the homepage.
2. Run `npx tsc --noEmit`. It will fail with `TS2741: Property '<id>' is missing` until the
   project exists in **both** `content/en.ts` and `content/zh.ts`. That error is the safety
   net that stops a project appearing in one language and not the other — follow it rather
   than working around it.
3. Add the locale-independent facts to `PROJECT_FACTS` in `content/facts.ts`: metrics, tags,
   and links. Numbers and URLs live here, never in the locale files.
4. If it has an article, do the article steps above.

### A convention worth keeping

When a metric comes from a small sample, put the sample size in the label
(`ASR@3 (n=5)`), not just in the article. A reader who sees the card and then reads the
write-up should never feel the card oversold.

## Before you push

```bash
npx tsc --noEmit
npx eslint .
npm run build
```

In the build's route table, every page must be `○` or `●` — both mean prerendered at build
time. A `ƒ` means something became dynamic, which for this site is always a mistake.

Then check the one thing automated tooling won't catch: load the page at a 375px viewport
and confirm the page itself doesn't scroll sideways. Tables and code blocks scrolling
*inside* their own box is correct; the page scrolling is not.

## After it deploys

```bash
curl -sI https://xploreurself.com/en/work/<slug> | head -1     # 200
curl -s  https://xploreurself.com/sitemap.xml | grep '<loc>'   # new URL listed
```

Paste the URL into a chat app to check the Open Graph card. Social platforms cache that
first fetch aggressively, so it is worth getting right before sharing the link widely.

## Things that are deliberate, not bugs

- **Articles are English only.** `/zh/work/<slug>` returns 404 on purpose. The Chinese
  homepage links to the English article and labels it as such.
- **`/` redirects to `/en`** with a 308, and there is no `Accept-Language` sniffing.
- **`docs/` is gitignored** and never ships. Private working notes live there.
- **`redblue` has no GitHub link** on its card because that repo is not public yet.
