# xploreurself-home

Source for [xploreurself.com](https://xploreurself.com) — a single-page personal
site: a short bio, a list of projects with real before/after metrics, and a
work history. Static, no backend, no database.

## Stack

- [Next.js](https://nextjs.org) 16 (App Router, Turbopack, React 19)
- [Tailwind CSS](https://tailwindcss.com) 4, design tokens defined in
  `app/globals.css` via `@theme`
- TypeScript throughout
- [lucide-react](https://lucide.dev) for icons

The whole page is statically prerendered at build time (`next build` emits
`/` as a static route) — there's no server-side rendering per request, and
no client-side data fetching. The only client-side JavaScript is three small
islands (theme toggle, locale switch, and the sticky nav's active-section
tracking) that need the browser for state a server render can't have.

## Running locally

```bash
npm install
npm run dev
```

Then open `http://localhost:3000`.

`npm run build` produces the production build; `npm run lint` runs ESLint.

## Content

Page copy lives in `content/en.ts` and `content/zh.ts`, typed against
`content/types.ts` — not inline in the JSX. Components in `components/` read that
data and render it; they don't contain copy themselves. This keeps the two
concerns — what the page says, and how it's laid out — separate, and makes a
translation a data change rather than a rewrite of every component.

Long-form write-ups are MDX under `content/work/`, rendered at `/en/work/<slug>`.

See [OPERATIONS.md](OPERATIONS.md) for how to edit an article, add a new one, or
add a project — including the MDX gotchas that fail in non-obvious ways.
