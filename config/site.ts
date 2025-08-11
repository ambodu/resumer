export type SiteConfig = typeof siteConfig;

export const siteConfig = {
  name: "Resume Builder",
  description: "专业的在线简历制作工具，提供精美模板和智能优化功能",
  url: "https://resume-builder.com",
  ogImage: "https://resume-builder.com/og.jpg",
  creator: "@resumebuilder",
  keywords: [
    "简历制作",
    "简历编辑器",
    "简历模板",
    "CV制作",
    "求职工具",
    "在线简历",
  ],
  authors: [
    {
      name: "Resume Builder Team",
      url: "https://resume-builder.com",
    },
  ],
  navItems: [
    {
      label: "首页",
      href: "/",
    },
    {
      label: "模板",
      href: "/templates",
    },
    {
      label: "编辑器",
      href: "/editor",
    },
    {
      label: "我的简历",
      href: "/user",
    },
  ],
  navMenuItems: [
    {
      label: "我的简历",
      href: "/user",
    },
    {
      label: "模板库",
      href: "/templates",
    },
    {
      label: "编辑器",
      href: "/editor",
    },
    {
      label: "帮助中心",
      href: "/help",
    },
    {
      label: "反馈建议",
      href: "/feedback",
    },
    {
      label: "设置",
      href: "/settings",
    },
  ],
  links: {
    github: "https://github.com/resume-builder/resume-builder",
    twitter: "https://twitter.com/resumebuilder",
    docs: "https://docs.resume-builder.com",
    support: "mailto:support@resume-builder.com",
    privacy: "/privacy",
    terms: "/terms",
  },
  features: [
    "专业模板设计",
    "智能内容优化",
    "一键PDF导出",
    "多语言支持",
    "实时预览",
    "云端同步",
  ],
  supportedLanguages: [
    { code: "zh", name: "中文", flag: "🇨🇳" },
    { code: "en", name: "English", flag: "🇺🇸" },
  ],
};
