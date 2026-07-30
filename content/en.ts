import type { SiteContent } from "./types";

// English copy for the homepage. See docs/plan.md section 6 for the source
// of truth this was transcribed from, and content/types.ts for why this is
// a data module instead of JSX.
//
// A note on missing links (decision 5 in docs/plan.md: ship an honest v1,
// never a placeholder link or "coming soon" text). Two kinds of links are
// deliberately left out of this phase rather than guessed at:
//
//   1. Deep-dive pages (redblue, jobagent) — the MDX routes don't exist
//      until phase P4. No href would go anywhere.
//   2. redblue's GitHub link — checked with `gh repo list` while writing
//      this: the repo isn't public yet. docs/plan.md's own delivery plan
//      (phase P7) adds this link only *after* the repo goes public, which
//      happens after the homepage ships. Linking to it now would 404.
//
// GitHub links for AI Detective and ai-usage below ARE real — verified live
// via `gh repo list hongming-github` before writing this file (both
// isPrivate: false). "What to Eat" (eat)'s repo is confirmed private via the
// same command, so it gets a "Code private." note instead of a link; it has
// no separately-confirmed live URL either, so no Live link is included yet.
//
// Resume: docs/plan.md's P0 checklist (marked done as of 2026-07-30) records
// the finalized, no-phone-number PDF at ~/Downloads/site-resume-edited.pdf.
// Verified before wiring it in — `pdftotext` + grep for phone patterns and
// "hotmail" came back empty, and the header matches the spec'd
// "ZHAO HONGMING / Singapore PR | hi@xploreurself.com | ..." format — then
// copied to public/resume.pdf, which Next.js serves as a static file at
// the URL below without any route code.
export const en: SiteContent = {
  meta: {
    title: "Hongming Zhao — AI Engineer, Singapore",
    description:
      "AI engineer in Singapore. Nine years building production systems in regulated banking, now building multi-agent LLM systems end to end.",
  },

  name: "Hongming Zhao",

  positioning: [
    "AI engineer in Singapore. Nine years building production systems in regulated banking — OCBC, Trust Bank, DBS — now building multi-agent LLM systems end to end.",
    "I build evaluation in from the start: golden sets, multi-model comparison, and designing for failure modes instead of assuming model output is correct.",
  ],

  contact: [
    { label: "Email", href: "mailto:hi@xploreurself.com" },
    { label: "GitHub", href: "https://github.com/hongming-github" },
    {
      label: "LinkedIn",
      href: "https://www.linkedin.com/in/hongming-zhao-6abab1138/",
    },
    { label: "Resume", href: "/resume.pdf" },
  ],

  work: [
    {
      name: "redblue",
      description:
        "A red team and a blue team co-evolve against a frozen model, producing a measurable robustness curve.",
      metrics: [
        { label: "ASR@3", from: "20%", value: "0%", sentiment: "pos" },
        {
          label: "benign false refusal",
          from: "10%",
          value: "30%",
          sentiment: "neg",
        },
      ],
      // Deep dive is P4; GitHub repo isn't public yet (see file-level comment).
      links: [],
    },
    {
      name: "jobagent",
      description:
        "LangGraph supervisor coordinating narrow LLM specialists over ~2,000 job listings a day.",
      metrics: [
        { label: "output tokens", value: "−61%", sentiment: "pos" },
        {
          label: "prompt cache hit",
          from: "47.7%",
          value: "95.4%",
          sentiment: "pos",
        },
      ],
      tags: ["LangGraph"],
      links: [],
      note: "Code private.",
    },
    {
      name: "AI Detective",
      description:
        "RAG over an adversarial corpus where similarity search actively misleads — three of eight documents are topical decoys.",
      metrics: [
        { label: "decoys rejected", value: "3/3", sentiment: "pos" },
      ],
      tags: ["RAG"],
      links: [
        {
          label: "GitHub",
          href: "https://github.com/hongming-github/AI-Detective-Challenge",
        },
      ],
    },
    {
      name: "ai-usage",
      description:
        "macOS menu bar app for Claude subscription quota, reading the desktop app's own cookie store.",
      metrics: [],
      tags: ["macOS"],
      links: [
        { label: "GitHub", href: "https://github.com/hongming-github/ai-usage" },
      ],
    },
    {
      name: "What to Eat",
      description:
        "Weekend dinner decisions for two people. My first TypeScript project — built to learn Next.js.",
      metrics: [],
      tags: ["Next.js", "TypeScript"],
      links: [],
      note: "Code private.",
    },
  ],

  experience: [
    {
      period: "2026-03 – Present",
      org: "ST Engineering",
      role: "AI Engineer Intern",
      description:
        "Let non-technical users drive 6 existing AI microservices via natural language; LangGraph intent routing plus a versioned evaluation harness.",
    },
    {
      period: "2024-10 – 2025-08",
      org: "DBS Bank",
      role: "Tech Lead",
      description:
        "Led a team of 4 delivering a pre-trade check engine across 4 regional banking systems, end to end from requirements to production.",
    },
    {
      period: "2023-04 – 2024-09",
      org: "Trust Bank Singapore",
      role: "Senior Backend Engineer",
      description:
        "Decoupled services with an event-driven architecture; built a production log monitoring dashboard; mentored new hires and ran code reviews.",
    },
    {
      period: "2019-03 – 2023-03",
      org: "OCBC Bank",
      role: "API Developer",
      description:
        "Primary technical point of contact for the OCBC Enterprise API platform, onboarding dozens of enterprise partners across 4 regions.",
    },
    {
      period: "2017-07 – 2019-02",
      org: "Avanade",
      role: "Software Engineer",
      description:
        "Government project; built RESTful services with Spring / Spring Data JPA.",
    },
    {
      period: "2016-10 – 2017-03",
      org: "OCBC Bank",
      role: "API Developer Intern",
      description: "Open API platform; customized OAuth2 flows.",
    },
  ],

  education: [
    {
      org: "National University of Singapore",
      program: "MTech, Artificial Intelligence Systems",
      period: "2025 – Present",
    },
    {
      org: "National University of Singapore",
      program: "Graduate Diploma, Systems Analysis",
      period: "2016 – 2017",
    },
    {
      org: "Zhejiang University of Technology",
      program: "BEng, Computer Science / Digital Media Technology",
      period: "2012 – 2016",
    },
  ],

  footer: {
    copyright: "© 2026 Hongming Zhao",
    sourceLabel: "Site source",
    // Per docs/plan.md decision 9 the repo name is xploreurself-home under
    // this GitHub account — a spec'd value, not a guess. It will 404 until
    // the P0 "create the public repo" step happens and this project is
    // pushed to it; that's a deployment-sequencing detail outside P1/P2.
    sourceHref: "https://github.com/hongming-github/xploreurself-home",
  },
};
