// @types/mdx's own ambient declaration for "*.mdx" (node_modules/@types/mdx/
// index.d.ts) only types the default export -- its own doc comment says
// other exports "can't be typed automatically" and shows exactly this
// pattern (a second `declare module "*.mdx"` block, redeclaring `default`
// alongside the new export) as the documented fix. Both content/work/*.mdx
// files export a `frontmatter` const (see content/articles.ts's
// ArticleFrontmatter comment for why, in place of YAML frontmatter), and
// this is what makes reading it a type-checked access instead of an
// implicit `any` everywhere it's imported.
declare module "*.mdx" {
  import type { MDXContent } from "mdx/types";
  import type { ArticleFrontmatter } from "@/content/articles";

  const MDXComponent: MDXContent;
  export default MDXComponent;
  export const frontmatter: ArticleFrontmatter;
}
