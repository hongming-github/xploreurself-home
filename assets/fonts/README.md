# Vendored font subsets

These two files exist so that Open Graph card generation (`app/[locale]/opengraph-image.tsx`)
can run entirely from local files. `next/og` rasterises text server-side and needs real font
data; it cannot use the browser-oriented `next/font` setup the rest of the site uses. Vendoring
the bytes keeps `next build` offline and deterministic, on this machine and on Vercel alike.

Both files are **subsets** — they contain only the glyphs the two cards actually render, which
is why an 11 KB file can cover Chinese. A subset is a modified version of the original font, so
the SIL Open Font License terms travel with it. `OFL.txt` in this directory is the full licence
text, taken from <https://openfontlicense.org/documents/OFL.txt>.

## `geist-mono-subset.woff`

Geist Mono — the site's monospace face, used here for the domain line on the card.

> Copyright 2024 The Geist Project Authors (<https://github.com/vercel/geist-font>)

Licensed under the SIL Open Font License, Version 1.1. No Reserved Font Name is declared.

## `noto-sans-sc-subset.woff`

Noto Sans SC — supplies the Chinese glyphs on the `/zh` card. Nothing in `node_modules` ships
CJK coverage, and macOS's system CJK fonts are `.ttc` collections that the rasteriser cannot
read and that would not exist on a Linux build machine anyway.

> (c) 2014-2021 Adobe (<http://www.adobe.com/>), with Reserved Font Name 'Source'.

Licensed under the SIL Open Font License, Version 1.1. The licence forbids redistributing a
modified version under the Reserved Font Name: this subset is named `noto-sans-sc-subset.woff`
and reports the family name `Noto Sans SC`, neither of which contains `Source`, so the
restriction is satisfied.

## If a font here ever changes

Re-check the `name` table of the new file rather than assuming the copyright line carried over —
that is where both statements above came from, and it is also where a Reserved Font Name would
appear.
