import { Metadata } from "next";
import { siteConfig } from "@/config/site";

interface MetadataProps {
  title?: string;
  description?: string;
  keywords?: string[];
  image?: string;
  url?: string;
  locale?: string;
  type?: "website" | "article";
}

export function generateMetadata({
  title,
  description,
  keywords = [],
  image,
  url,
  locale = "zh",
  type = "website",
}: MetadataProps = {}): Metadata {
  const metaTitle = title ? `${title} | ${siteConfig.name}` : siteConfig.name;
  const metaDescription = description || siteConfig.description;
  const metaImage = image || siteConfig.ogImage;
  const metaUrl = url || siteConfig.url;
  const allKeywords = [...siteConfig.keywords, ...keywords];

  return {
    title: metaTitle,
    description: metaDescription,
    keywords: allKeywords,
    authors: siteConfig.authors,
    creator: siteConfig.creator,

    // Open Graph
    openGraph: {
      type,
      locale,
      url: metaUrl,
      title: metaTitle,
      description: metaDescription,
      siteName: siteConfig.name,
      images: [
        {
          url: metaImage,
          width: 1200,
          height: 630,
          alt: metaTitle,
        },
      ],
    },

    // Twitter
    twitter: {
      card: "summary_large_image",
      title: metaTitle,
      description: metaDescription,
      images: [metaImage],
      creator: "@resumebuilder",
    },

    // 其他元数据
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },

    // 语言和地区
    alternates: {
      canonical: metaUrl,
      languages: {
        "zh-CN": `${siteConfig.url}/zh`,
        "en-US": `${siteConfig.url}/en`,
      },
    },

    // 应用相关
    applicationName: siteConfig.name,
    category: "productivity",

    // 验证
    verification: {
      google: "your-google-verification-code",
      yandex: "your-yandex-verification-code",
      yahoo: "your-yahoo-verification-code",
    },
  };
}

// 页面特定的元数据生成器
export const pageMetadata = {
  home: (locale: string) =>
    generateMetadata({
      title:
        locale === "zh" ? "专业简历制作工具" : "Professional Resume Builder",
      description:
        locale === "zh"
          ? "免费在线简历制作工具，提供专业模板，支持多语言，一键导出PDF。让您的简历脱颖而出。"
          : "Free online resume builder with professional templates, multi-language support, and one-click PDF export. Make your resume stand out.",
      keywords:
        locale === "zh"
          ? ["简历制作", "简历模板", "在线简历", "PDF导出", "求职工具"]
          : [
              "resume builder",
              "resume templates",
              "online resume",
              "PDF export",
              "job search",
            ],
      locale,
    }),

  templates: (locale: string) =>
    generateMetadata({
      title: locale === "zh" ? "简历模板" : "Resume Templates",
      description:
        locale === "zh"
          ? "精选专业简历模板，适合各行各业。现代设计，ATS友好，助您获得面试机会。"
          : "Curated professional resume templates for all industries. Modern design, ATS-friendly, helping you land interviews.",
      keywords:
        locale === "zh"
          ? ["简历模板", "专业模板", "ATS简历", "现代设计"]
          : [
              "resume templates",
              "professional templates",
              "ATS resume",
              "modern design",
            ],
      locale,
    }),

  editor: (locale: string) =>
    generateMetadata({
      title: locale === "zh" ? "简历编辑器" : "Resume Editor",
      description:
        locale === "zh"
          ? "强大的在线简历编辑器，实时预览，智能建议，轻松创建专业简历。"
          : "Powerful online resume editor with real-time preview, smart suggestions, and easy professional resume creation.",
      keywords:
        locale === "zh"
          ? ["简历编辑", "在线编辑器", "实时预览", "智能建议"]
          : [
              "resume editing",
              "online editor",
              "real-time preview",
              "smart suggestions",
            ],
      locale,
    }),

  user: (locale: string) =>
    generateMetadata({
      title: locale === "zh" ? "用户中心" : "User Dashboard",
      description:
        locale === "zh"
          ? "管理您的简历，查看统计数据，导出历史记录。一站式简历管理平台。"
          : "Manage your resumes, view statistics, export history. One-stop resume management platform.",
      keywords:
        locale === "zh"
          ? ["用户中心", "简历管理", "统计数据", "导出记录"]
          : [
              "user dashboard",
              "resume management",
              "statistics",
              "export history",
            ],
      locale,
    }),
};

// 结构化数据生成器
export function generateStructuredData(
  type: "website" | "organization" | "breadcrumb",
  data?: any
) {
  switch (type) {
    case "website":
      return {
        "@context": "https://schema.org",
        "@type": "WebSite",
        name: siteConfig.name,
        description: siteConfig.description,
        url: siteConfig.url,
        potentialAction: {
          "@type": "SearchAction",
          target: `${siteConfig.url}/search?q={search_term_string}`,
          "query-input": "required name=search_term_string",
        },
      };

    case "organization":
      return {
        "@context": "https://schema.org",
        "@type": "Organization",
        name: siteConfig.name,
        description: siteConfig.description,
        url: siteConfig.url,
        logo: siteConfig.ogImage,
        sameAs: [siteConfig.links.github, siteConfig.links.twitter],
      };

    case "breadcrumb":
      return {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement:
          data?.items?.map((item: any, index: number) => ({
            "@type": "ListItem",
            position: index + 1,
            name: item.name,
            item: item.url,
          })) || [],
      };

    default:
      return null;
  }
}
