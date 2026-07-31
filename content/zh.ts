import type { SiteContent } from "./types";

// Chinese copy for the homepage. This is reviewed, final copy (docs/plan.md
// section 3) — transcribed verbatim, not machine-translated or touched up
// here. See content/en.ts for the shared background on why copy lives in a
// data module, and content/facts.ts for the numbers/tags/URLs that this
// file does not repeat because they don't change by locale.
export const zh: SiteContent = {
  meta: {
    // Latin name here too — same as `name` and `footer.copyright` below.
    // This is a settled decision, not a placeholder: the site shows the
    // name in Latin script in every locale, deliberately.
    title: "Hongming Zhao — AI 工程师，新加坡",
    description:
      "新加坡 AI 工程师。九年在受监管的银行业做生产系统，现在端到端构建多智能体 LLM 系统。",
  },

  // The name stays in Latin script on the Chinese page, by decision — not
  // because a translation is outstanding. Any Chinese rendering would have
  // to be guessed ("Hongming" could be 洪明, 鸿明, 宏明, 红明 and more), and
  // a guessed spelling of someone's own name on their own site is a worse
  // outcome than Latin. Don't "complete" this later; there is nothing to
  // complete.
  name: "Hongming Zhao",

  positioning: [
    "新加坡 AI 工程师。九年在受监管的银行业做生产系统 —— OCBC、Trust Bank、DBS —— 现在端到端构建多智能体 LLM 系统。",
    "我从一开始就把评估建进系统里：金标集、多模型对比，以及为失败模式做设计，而不是假设模型输出是对的。",
  ],

  nav: {
    work: "项目",
    experience: "经历",
    education: "教育",
  },

  sections: {
    work: "精选项目",
    experience: "工作经历",
    education: "教育背景",
  },

  // Only "live" is left here — see content/facts.ts's LinkKey comment.
  linkLabels: {
    live: "线上",
  },

  metricLabels: {
    // Technical term, left unchanged per the brief.
    asr3: "ASR@3",
    benignFalseRefusal: "良性请求误拒率",
    outputTokens: "输出 token",
    promptCacheHit: "prompt 缓存命中率",
    decoysRejected: "诱饵剔除",
  },

  present: "至今",

  work: {
    redblue: {
      description:
        "一支红队反复攻击冻结的模型，一支蓝队据成功的攻击迭代加固防御，产出一条可度量的鲁棒性曲线。",
    },
    jobagent: {
      description:
        "LangGraph supervisor 协调一组窄领域 LLM 专家，每天处理约 2000 条招聘信息。",
      note: "代码未公开",
    },
    "ai-detective": {
      description:
        "在对抗性语料上做 RAG —— 八份文档里有三份是话题相同但明确无关的诱饵，相似度检索会主动把人带偏。",
    },
    "ai-usage": {
      description:
        "macOS 菜单栏应用，读取 Claude 桌面端自己的 cookie 存储来显示订阅额度。",
    },
    "what-to-eat": {
      description:
        "两个人的周末晚饭决策。我的第一个 TypeScript 项目，为学 Next.js 而做。",
      note: "代码未公开",
    },
  },

  experience: {
    "st-engineering": {
      role: "AI 工程师实习生",
      description:
        "让非技术用户用自然语言驱动 6 个已有的 AI 微服务；LangGraph 意图路由，加一套版本化的评估 harness。",
    },
    dbs: {
      role: "技术负责人",
      description:
        "带 4 人团队交付 pre-trade check engine，覆盖 4 个区域银行系统，从需求到生产端到端负责。",
    },
    "trust-bank": {
      role: "高级后端工程师",
      description:
        "用事件驱动架构解耦服务；搭生产日志监控看板；带新人、做 code review。",
    },
    "ocbc-api-developer": {
      role: "API 开发工程师",
      description:
        "OCBC Enterprise API 平台的主要技术对接人，为数十家企业伙伴完成接入，覆盖 4 个区域。",
    },
    avanade: {
      role: "软件工程师",
      description: "政府项目；用 Spring / Spring Data JPA 构建 RESTful 服务。",
    },
    "ocbc-api-developer-intern": {
      role: "API 开发实习生",
      description: "Open API 平台；定制 OAuth2 流程。",
    },
  },

  // Periods aren't listed here — see content/facts.ts's EDUCATION_PERIODS
  // (matched by array position) and `present` above. Previously this file
  // stored the period as one string including the English word "Present",
  // which is what made "Present" render on this Chinese page; now the
  // digits live in the fact layer and `present`/"至今" supplies the word.
  education: [
    {
      org: "National University of Singapore",
      program: "人工智能系统 硕士（MTech）",
    },
    {
      org: "National University of Singapore",
      program: "系统分析 研究生文凭",
    },
    {
      org: "Zhejiang University of Technology",
      program: "计算机科学（数字媒体技术）学士",
    },
  ],

  footer: {
    // Copyright line is unchanged per the brief — same as content/en.ts.
    copyright: "© 2026 Hongming Zhao",
    sourceLabel: "本站源码",
  },
};
