import type { SiteContent } from "./types";

// English copy for the homepage. See docs/plan.md section 6 for the source
// of truth this was transcribed from, content/types.ts for why this is a
// data module instead of JSX, and content/facts.ts for the numbers, tags,
// and URLs that live outside this file because they don't change by locale.
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
// GitHub links for AI Detective and ai-usage below ARE real (see
// content/facts.ts). "What to Eat" (eat)'s repo is private, hence the
// "Code private." note instead of a GitHub link.
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

  nav: {
    work: "Work",
    experience: "Experience",
    education: "Education",
  },

  sections: {
    work: "Selected Work",
    experience: "Experience",
    education: "Education",
    contact: "Contact",
  },

  // Only "live" is left here — see content/facts.ts's LinkKey comment for
  // why the contact row and the GitHub project links no longer go through
  // a translated label at all.
  linkLabels: {
    live: "Live",
  },

  metricLabels: {
    asr3: "ASR@3",
    benignFalseRefusal: "benign false refusal",
    outputTokens: "output tokens",
    promptCacheHit: "prompt cache hit",
    decoysRejected: "decoys rejected",
  },

  present: "Present",

  work: {
    redblue: {
      description:
        "A red team and a blue team co-evolve against a frozen model, producing a measurable robustness curve.",
    },
    jobagent: {
      description:
        "LangGraph supervisor coordinating narrow LLM specialists over ~2,000 job listings a day.",
      note: "Code private.",
    },
    "ai-detective": {
      description:
        "RAG over an adversarial corpus where similarity search actively misleads — three of eight documents are topical decoys.",
    },
    "ai-usage": {
      description:
        "macOS menu bar app for Claude subscription quota, reading the desktop app's own cookie store.",
    },
    "what-to-eat": {
      description:
        "Weekend dinner decisions for two people. My first TypeScript project — built to learn Next.js.",
      note: "Code private.",
    },
  },

  experience: {
    "st-engineering": {
      role: "AI Engineer Intern",
      description:
        "Let non-technical users drive 6 existing AI microservices via natural language; LangGraph intent routing plus a versioned evaluation harness.",
    },
    dbs: {
      role: "Tech Lead",
      description:
        "Led a team of 4 delivering a pre-trade check engine across 4 regional banking systems, end to end from requirements to production.",
    },
    "trust-bank": {
      role: "Senior Backend Engineer",
      description:
        "Decoupled services with an event-driven architecture; built a production log monitoring dashboard; mentored new hires and ran code reviews.",
    },
    "ocbc-api-developer": {
      role: "API Developer",
      description:
        "Primary technical point of contact for the OCBC Enterprise API platform, onboarding dozens of enterprise partners across 4 regions.",
    },
    avanade: {
      role: "Software Engineer",
      description:
        "Government project; built RESTful services with Spring / Spring Data JPA.",
    },
    "ocbc-api-developer-intern": {
      role: "API Developer Intern",
      description: "Open API platform; customized OAuth2 flows.",
    },
  },

  // Periods aren't listed here — see content/facts.ts's EDUCATION_PERIODS
  // (matched by array position) and content/types.ts's EducationItem for
  // why the year digits live in the fact layer instead of per locale.
  education: [
    {
      org: "National University of Singapore",
      program: "MTech, Artificial Intelligence Systems",
    },
    {
      org: "National University of Singapore",
      program: "Graduate Diploma, Systems Analysis",
    },
    {
      org: "Zhejiang University of Technology",
      program: "BEng, Computer Science / Digital Media Technology",
    },
  ],

  footer: {
    copyright: "© 2026 Hongming Zhao",
    sourceLabel: "Site source",
  },
};
