"use client";

import React from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { ResumeData } from '@/lib/types';

// SEO配置接口
interface SEOConfig {
  title: string;
  description: string;
  keywords?: string[];
  author?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article' | 'profile';
  locale?: string;
  siteName?: string;
  twitterCard?: 'summary' | 'summary_large_image' | 'app' | 'player';
  robots?: string;
  canonical?: string;
  alternateLanguages?: Array<{ hreflang: string; href: string }>;
}

// 结构化数据类型
interface StructuredData {
  '@context': string;
  '@type': string;
  [key: string]: any;
}

// 默认SEO配置
const DEFAULT_SEO: SEOConfig = {
  title: '在线简历编辑器 - 专业简历制作工具',
  description: '免费的在线简历编辑器，提供专业模板、AI优化建议和一键导出功能。快速创建令人印象深刻的简历。',
  keywords: ['简历编辑器', '简历制作', '简历模板', 'CV编辑器', '求职', '在线简历'],
  type: 'website',
  locale: 'zh_CN',
  siteName: 'Resume Builder',
  twitterCard: 'summary_large_image',
  robots: 'index,follow'
};

// SEO优化器组件
interface SEOOptimizerProps {
  config?: Partial<SEOConfig>;
  resumeData?: ResumeData;
  structuredData?: StructuredData[];
  children?: React.ReactNode;
}

export function SEOOptimizer({
  config = {},
  resumeData,
  structuredData = [],
  children
}: SEOOptimizerProps) {
  const router = useRouter();
  
  // 合并SEO配置
  const seoConfig: SEOConfig = {
    ...DEFAULT_SEO,
    ...config
  };
  
  // 根据简历数据生成动态SEO
  if (resumeData) {
    const personalInfo = resumeData.personalInfo;
    
    if (personalInfo.fullName) {
      seoConfig.title = `${personalInfo.fullName}的简历 - ${seoConfig.siteName}`;
      seoConfig.author = personalInfo.fullName;
    }
    
    if (personalInfo.summary) {
      seoConfig.description = personalInfo.summary.length > 160 
        ? personalInfo.summary.substring(0, 157) + '...'
        : personalInfo.summary;
    }
    
    // 生成关键词
    const skills = resumeData.skills?.map(skill => skill.name) || [];
    const jobTitles = resumeData.experience?.map(exp => exp.position) || [];
    seoConfig.keywords = [...(seoConfig.keywords || []), ...skills, ...jobTitles];
  }
  
  // 生成当前页面URL
  const currentUrl = typeof window !== 'undefined' 
    ? `${window.location.origin}${router.asPath}`
    : seoConfig.url;
  
  // 生成结构化数据
  const generateStructuredData = (): StructuredData[] => {
    const data: StructuredData[] = [...structuredData];
    
    // 网站基本信息
    data.push({
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: seoConfig.siteName || '',
      url: currentUrl || '',
      description: seoConfig.description,
      potentialAction: {
        '@type': 'SearchAction',
        target: `${currentUrl}/search?q={search_term_string}`,
        'query-input': 'required name=search_term_string'
      }
    });
    
    // 应用程序信息
    data.push({
      '@context': 'https://schema.org',
      '@type': 'SoftwareApplication',
      name: seoConfig.siteName || '',
      applicationCategory: 'BusinessApplication',
      operatingSystem: 'Web Browser',
      description: seoConfig.description,
      url: currentUrl || '',
      offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'CNY'
      },
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: '4.8',
        ratingCount: '1250'
      }
    });
    
    // 如果有简历数据，生成个人资料结构化数据
    if (resumeData) {
      const personalInfo = resumeData.personalInfo;
      
      data.push({
        '@context': 'https://schema.org',
        '@type': 'Person',
        name: personalInfo.fullName || '',
        email: personalInfo.email || '',
        telephone: personalInfo.phone || '',
        address: personalInfo.location || '',
        description: personalInfo.summary || '',
        url: personalInfo.website || '',
        sameAs: [
          personalInfo.linkedin,
          personalInfo.github
        ].filter(Boolean),
        worksFor: resumeData.experience?.[0] ? {
          '@type': 'Organization',
          name: resumeData.experience[0].company
        } : undefined,
        alumniOf: resumeData.education?.map(edu => ({
          '@type': 'EducationalOrganization',
          name: edu.school
        })),
        knowsAbout: resumeData.skills?.map(skill => skill.name)
      });
    }
    
    return data;
  };
  
  const structuredDataArray = generateStructuredData();
  
  return (
    <>
      <Head>
        {/* 基本元数据 */}
        <title>{seoConfig.title}</title>
        <meta name="description" content={seoConfig.description} />
        {seoConfig.keywords && (
          <meta name="keywords" content={seoConfig.keywords.join(', ')} />
        )}
        {seoConfig.author && <meta name="author" content={seoConfig.author} />}
        <meta name="robots" content={seoConfig.robots || 'index,follow'} />
        
        {/* 视口和字符集 */}
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta charSet="utf-8" />
        
        {/* 语言和地区 */}
        <meta httpEquiv="content-language" content={seoConfig.locale || 'zh-CN'} />
        <html lang={seoConfig.locale?.split('_')[0] || 'zh'} />
        
        {/* 规范链接 */}
        {(seoConfig.canonical || currentUrl) && (
          <link rel="canonical" href={seoConfig.canonical || currentUrl} />
        )}
        
        {/* 备用语言链接 */}
        {seoConfig.alternateLanguages?.map((alt, index) => (
          <link
            key={index}
            rel="alternate"
            hrefLang={alt.hreflang}
            href={alt.href}
          />
        ))}
        
        {/* Open Graph */}
        <meta property="og:type" content={seoConfig.type || 'website'} />
        <meta property="og:title" content={seoConfig.title} />
        <meta property="og:description" content={seoConfig.description} />
        {currentUrl && <meta property="og:url" content={currentUrl} />}
        {seoConfig.image && <meta property="og:image" content={seoConfig.image} />}
        {seoConfig.siteName && <meta property="og:site_name" content={seoConfig.siteName} />}
        {seoConfig.locale && <meta property="og:locale" content={seoConfig.locale} />}
        
        {/* Twitter Cards */}
        <meta name="twitter:card" content={seoConfig.twitterCard || 'summary_large_image'} />
        <meta name="twitter:title" content={seoConfig.title} />
        <meta name="twitter:description" content={seoConfig.description} />
        {seoConfig.image && <meta name="twitter:image" content={seoConfig.image} />}
        
        {/* 应用程序元数据 */}
        <meta name="application-name" content={seoConfig.siteName} />
        <meta name="apple-mobile-web-app-title" content={seoConfig.siteName} />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="mobile-web-app-capable" content="yes" />
        
        {/* 主题颜色 */}
        <meta name="theme-color" content="#3b82f6" />
        <meta name="msapplication-TileColor" content="#3b82f6" />
        
        {/* 图标 */}
        <link rel="icon" type="image/x-icon" href="/favicon.ico" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/site.webmanifest" />
        
        {/* 预连接和DNS预取 */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://www.google-analytics.com" />
        
        {/* 结构化数据 */}
        {structuredDataArray.map((data, index) => (
          <script
            key={index}
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify(data)
            }}
          />
        ))}
        
        {/* 安全策略 */}
        <meta httpEquiv="X-Content-Type-Options" content="nosniff" />
        <meta httpEquiv="X-Frame-Options" content="DENY" />
        <meta httpEquiv="X-XSS-Protection" content="1; mode=block" />
        
        {/* 缓存控制 */}
        <meta httpEquiv="Cache-Control" content="public, max-age=31536000" />
      </Head>
      {children}
    </>
  );
}

// SEO分析工具
export class SEOAnalyzer {
  // 分析页面SEO
  static analyzePage(): {
    score: number;
    issues: Array<{ type: 'error' | 'warning' | 'info'; message: string }>;
    recommendations: string[];
  } {
    const issues: Array<{ type: 'error' | 'warning' | 'info'; message: string }> = [];
    const recommendations: string[] = [];
    let score = 100;
    
    // 检查标题
    const title = document.querySelector('title')?.textContent;
    if (!title) {
      issues.push({ type: 'error', message: '缺少页面标题' });
      score -= 20;
    } else if (title.length < 30 || title.length > 60) {
      issues.push({ type: 'warning', message: '页面标题长度不理想（建议30-60字符）' });
      score -= 5;
    }
    
    // 检查描述
    const description = document.querySelector('meta[name="description"]')?.getAttribute('content');
    if (!description) {
      issues.push({ type: 'error', message: '缺少页面描述' });
      score -= 15;
    } else if (description.length < 120 || description.length > 160) {
      issues.push({ type: 'warning', message: '页面描述长度不理想（建议120-160字符）' });
      score -= 5;
    }
    
    // 检查H1标签
    const h1Tags = document.querySelectorAll('h1');
    if (h1Tags.length === 0) {
      issues.push({ type: 'error', message: '缺少H1标签' });
      score -= 10;
    } else if (h1Tags.length > 1) {
      issues.push({ type: 'warning', message: '页面有多个H1标签' });
      score -= 5;
    }
    
    // 检查图片alt属性
    const images = document.querySelectorAll('img');
    const imagesWithoutAlt = Array.from(images).filter(img => !img.getAttribute('alt'));
    if (imagesWithoutAlt.length > 0) {
      issues.push({ 
        type: 'warning', 
        message: `${imagesWithoutAlt.length}张图片缺少alt属性` 
      });
      score -= Math.min(imagesWithoutAlt.length * 2, 10);
    }
    
    // 检查内部链接
    const internalLinks = document.querySelectorAll('a[href^="/"], a[href^="#"]');
    if (internalLinks.length < 3) {
      issues.push({ type: 'info', message: '内部链接较少，建议增加相关页面链接' });
      recommendations.push('增加内部链接以改善网站结构');
    }
    
    // 检查页面加载速度
    if (typeof window !== 'undefined' && 'performance' in window) {
      const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
      if (loadTime > 3000) {
        issues.push({ type: 'warning', message: '页面加载时间较长' });
        score -= 10;
        recommendations.push('优化页面加载速度');
      }
    }
    
    // 检查移动端适配
    const viewport = document.querySelector('meta[name="viewport"]');
    if (!viewport) {
      issues.push({ type: 'error', message: '缺少viewport元标签' });
      score -= 15;
    }
    
    // 检查结构化数据
    const structuredData = document.querySelectorAll('script[type="application/ld+json"]');
    if (structuredData.length === 0) {
      issues.push({ type: 'info', message: '建议添加结构化数据' });
      recommendations.push('添加结构化数据以提高搜索引擎理解');
    }
    
    // 生成建议
    if (score < 80) {
      recommendations.push('修复所有错误和警告以提高SEO得分');
    }
    
    if (!document.querySelector('link[rel="canonical"]')) {
      recommendations.push('添加规范链接以避免重复内容问题');
    }
    
    return {
      score: Math.max(0, score),
      issues,
      recommendations
    };
  }
  
  // 生成SEO报告
  static generateReport(): string {
    const analysis = this.analyzePage();
    
    let report = `SEO分析报告\n`;
    report += `=================\n`;
    report += `总分: ${analysis.score}/100\n\n`;
    
    if (analysis.issues.length > 0) {
      report += `问题列表:\n`;
      analysis.issues.forEach((issue, index) => {
        report += `${index + 1}. [${issue.type.toUpperCase()}] ${issue.message}\n`;
      });
      report += `\n`;
    }
    
    if (analysis.recommendations.length > 0) {
      report += `优化建议:\n`;
      analysis.recommendations.forEach((rec, index) => {
        report += `${index + 1}. ${rec}\n`;
      });
    }
    
    return report;
  }
}

// 关键词密度分析
export function analyzeKeywordDensity(content: string, keywords: string[]): Array<{
  keyword: string;
  count: number;
  density: number;
  recommendation: string;
}> {
  const words = content.toLowerCase().split(/\s+/);
  const totalWords = words.length;
  
  return keywords.map(keyword => {
    const keywordLower = keyword.toLowerCase();
    const count = words.filter(word => word.includes(keywordLower)).length;
    const density = (count / totalWords) * 100;
    
    let recommendation = '';
    if (density < 0.5) {
      recommendation = '关键词密度过低，建议适当增加';
    } else if (density > 3) {
      recommendation = '关键词密度过高，可能被视为关键词堆砌';
    } else {
      recommendation = '关键词密度适中';
    }
    
    return {
      keyword,
      count,
      density: Number(density.toFixed(2)),
      recommendation
    };
  });
}

// 生成站点地图
export function generateSitemap(pages: Array<{
  url: string;
  lastModified?: string;
  changeFreq?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority?: number;
}>): string {
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages.map(page => `  <url>
    <loc>${page.url}</loc>
    ${page.lastModified ? `<lastmod>${page.lastModified}</lastmod>\n` : ''}    ${page.changeFreq ? `<changefreq>${page.changeFreq}</changefreq>\n` : ''}    ${page.priority ? `<priority>${page.priority}</priority>\n` : ''}  </url>`).join('\n')}
</urlset>`;
  
  return sitemap;
}

// 生成robots.txt
export function generateRobotsTxt(config: {
  userAgent?: string;
  disallow?: string[];
  allow?: string[];
  sitemapUrl?: string;
  crawlDelay?: number;
}): string {
  const { userAgent = '*', disallow = [], allow = [], sitemapUrl, crawlDelay } = config;
  
  let robotsTxt = `User-agent: ${userAgent}\n`;
  
  disallow.forEach(path => {
    robotsTxt += `Disallow: ${path}\n`;
  });
  
  allow.forEach(path => {
    robotsTxt += `Allow: ${path}\n`;
  });
  
  if (crawlDelay) {
    robotsTxt += `Crawl-delay: ${crawlDelay}\n`;
  }
  
  if (sitemapUrl) {
    robotsTxt += `\nSitemap: ${sitemapUrl}`;
  }
  
  return robotsTxt;
}

export default SEOOptimizer;