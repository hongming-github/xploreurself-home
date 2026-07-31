import type { MDXComponents } from "mdx/types";
import { mdxComponents } from "@/components/Prose";

// Required by @next/mdx for the App Router — node_modules/next/dist/docs/
// 01-app/03-api-reference/03-file-conventions/mdx-components.md is explicit
// that this file "will not work without it". It's the convention @next/mdx's
// compiler looks for to learn which native tag a compiled .mdx file's
// markdown should render as instead of (h2 -> <h2>, a table row -> <tr>,
// ...). The actual styled components live in components/Prose.tsx, next to
// the <Prose> container they're designed to sit inside — this file only
// wires them in.
export function useMDXComponents(): MDXComponents {
  return mdxComponents;
}
