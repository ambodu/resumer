"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Locale, locales, defaultLocale } from '@/lib/i18n';

// 翻译键类型
export type TranslationKey = 
  // 通用
  | 'common.save'
  | 'common.cancel'
  | 'common.delete'
  | 'common.edit'
  | 'common.add'
  | 'common.remove'
  | 'common.confirm'
  | 'common.loading'
  | 'common.error'
  | 'common.success'
  | 'common.warning'
  | 'common.info'
  | 'common.close'
  | 'common.back'
  | 'common.next'
  | 'common.previous'
  | 'common.search'
  | 'common.filter'
  | 'common.sort'
  | 'common.export'
  | 'common.import'
  | 'common.download'
  | 'common.upload'
  | 'common.preview'
  | 'common.settings'
  | 'common.help'
  | 'common.about'
  
  // 导航
  | 'nav.home'
  | 'nav.editor'
  | 'nav.templates'
  | 'nav.account'
  | 'nav.help'
  | 'nav.language'
  
  // 简历编辑器
  | 'editor.title'
  | 'editor.personalInfo'
  | 'editor.experience'
  | 'editor.education'
  | 'editor.skills'
  | 'editor.projects'
  | 'editor.generate'
  | 'editor.optimize'
  | 'editor.score'
  | 'editor.preview'
  
  // 个人信息
  | 'personalInfo.fullName'
  | 'personalInfo.email'
  | 'personalInfo.phone'
  | 'personalInfo.location'
  | 'personalInfo.website'
  | 'personalInfo.linkedin'
  | 'personalInfo.github'
  | 'personalInfo.summary'
  | 'personalInfo.avatar'
  
  // 工作经验
  | 'experience.company'
  | 'experience.position'
  | 'experience.startDate'
  | 'experience.endDate'
  | 'experience.current'
  | 'experience.description'
  | 'experience.achievements'
  | 'experience.addExperience'
  
  // 教育背景
  | 'education.school'
  | 'education.degree'
  | 'education.major'
  | 'education.startDate'
  | 'education.endDate'
  | 'education.gpa'
  | 'education.description'
  | 'education.addEducation'
  
  // 技能
  | 'skills.name'
  | 'skills.level'
  | 'skills.category'
  | 'skills.addSkill'
  | 'skills.technical'
  | 'skills.soft'
  | 'skills.language'
  
  // 项目经验
  | 'projects.name'
  | 'projects.description'
  | 'projects.technologies'
  | 'projects.url'
  | 'projects.startDate'
  | 'projects.endDate'
  | 'projects.addProject'
  
  // AI功能
  | 'ai.generate.title'
  | 'ai.generate.description'
  | 'ai.generate.industry'
  | 'ai.generate.position'
  | 'ai.generate.experience'
  | 'ai.generate.tone'
  | 'ai.generate.length'
  | 'ai.generate.skills'
  | 'ai.generate.button'
  | 'ai.optimize.title'
  | 'ai.optimize.description'
  | 'ai.optimize.analyze'
  | 'ai.optimize.suggestions'
  | 'ai.optimize.keywords'
  | 'ai.optimize.score'
  
  // 模板
  | 'templates.title'
  | 'templates.search'
  | 'templates.category'
  | 'templates.industry'
  | 'templates.level'
  | 'templates.free'
  | 'templates.premium'
  | 'templates.popular'
  | 'templates.newest'
  | 'templates.rating'
  | 'templates.downloads'
  | 'templates.preview'
  | 'templates.use'
  
  // 账户
  | 'account.profile'
  | 'account.resumes'
  | 'account.settings'
  | 'account.statistics'
  | 'account.subscription'
  | 'account.billing'
  | 'account.security'
  | 'account.notifications'
  
  // 错误信息
  | 'error.required'
  | 'error.invalid'
  | 'error.tooShort'
  | 'error.tooLong'
  | 'error.network'
  | 'error.server'
  | 'error.notFound'
  | 'error.unauthorized'
  | 'error.forbidden'
  
  // 成功信息
  | 'success.saved'
  | 'success.deleted'
  | 'success.updated'
  | 'success.created'
  | 'success.exported'
  | 'success.imported'
  | 'success.uploaded'
  | 'success.downloaded';

// 翻译对象类型
type Translations = Record<TranslationKey, string>;

// 中文翻译
const zhTranslations: Translations = {
  // 通用
  'common.save': '保存',
  'common.cancel': '取消',
  'common.delete': '删除',
  'common.edit': '编辑',
  'common.add': '添加',
  'common.remove': '移除',
  'common.confirm': '确认',
  'common.loading': '加载中...',
  'common.error': '错误',
  'common.success': '成功',
  'common.warning': '警告',
  'common.info': '信息',
  'common.close': '关闭',
  'common.back': '返回',
  'common.next': '下一步',
  'common.previous': '上一步',
  'common.search': '搜索',
  'common.filter': '筛选',
  'common.sort': '排序',
  'common.export': '导出',
  'common.import': '导入',
  'common.download': '下载',
  'common.upload': '上传',
  'common.preview': '预览',
  'common.settings': '设置',
  'common.help': '帮助',
  'common.about': '关于',
  
  // 导航
  'nav.home': '首页',
  'nav.editor': '编辑器',
  'nav.templates': '模板',
  'nav.account': '账户',
  'nav.help': '帮助',
  'nav.language': '语言',
  
  // 简历编辑器
  'editor.title': '简历编辑器',
  'editor.personalInfo': '个人信息',
  'editor.experience': '工作经验',
  'editor.education': '教育背景',
  'editor.skills': '技能',
  'editor.projects': '项目经验',
  'editor.generate': 'AI生成',
  'editor.optimize': 'AI优化',
  'editor.score': '评分',
  'editor.preview': '预览',
  
  // 个人信息
  'personalInfo.fullName': '姓名',
  'personalInfo.email': '邮箱',
  'personalInfo.phone': '电话',
  'personalInfo.location': '所在地',
  'personalInfo.website': '个人网站',
  'personalInfo.linkedin': 'LinkedIn',
  'personalInfo.github': 'GitHub',
  'personalInfo.summary': '个人简介',
  'personalInfo.avatar': '头像',
  
  // 工作经验
  'experience.company': '公司',
  'experience.position': '职位',
  'experience.startDate': '开始时间',
  'experience.endDate': '结束时间',
  'experience.current': '至今',
  'experience.description': '工作描述',
  'experience.achievements': '主要成就',
  'experience.addExperience': '添加工作经验',
  
  // 教育背景
  'education.school': '学校',
  'education.degree': '学位',
  'education.major': '专业',
  'education.startDate': '开始时间',
  'education.endDate': '结束时间',
  'education.gpa': 'GPA',
  'education.description': '描述',
  'education.addEducation': '添加教育背景',
  
  // 技能
  'skills.name': '技能名称',
  'skills.level': '熟练程度',
  'skills.category': '技能类别',
  'skills.addSkill': '添加技能',
  'skills.technical': '技术技能',
  'skills.soft': '软技能',
  'skills.language': '语言技能',
  
  // 项目经验
  'projects.name': '项目名称',
  'projects.description': '项目描述',
  'projects.technologies': '使用技术',
  'projects.url': '项目链接',
  'projects.startDate': '开始时间',
  'projects.endDate': '结束时间',
  'projects.addProject': '添加项目',
  
  // AI功能
  'ai.generate.title': 'AI简历生成',
  'ai.generate.description': '基于您的信息智能生成专业简历',
  'ai.generate.industry': '行业',
  'ai.generate.position': '目标职位',
  'ai.generate.experience': '经验水平',
  'ai.generate.tone': '语调风格',
  'ai.generate.length': '简历长度',
  'ai.generate.skills': '技能',
  'ai.generate.button': '生成简历',
  'ai.optimize.title': 'AI简历优化',
  'ai.optimize.description': '分析并优化您的简历内容',
  'ai.optimize.analyze': '分析简历',
  'ai.optimize.suggestions': '优化建议',
  'ai.optimize.keywords': '关键词分析',
  'ai.optimize.score': '简历评分',
  
  // 模板
  'templates.title': '简历模板',
  'templates.search': '搜索模板',
  'templates.category': '分类',
  'templates.industry': '行业',
  'templates.level': '级别',
  'templates.free': '免费',
  'templates.premium': '高级',
  'templates.popular': '热门',
  'templates.newest': '最新',
  'templates.rating': '评分',
  'templates.downloads': '下载量',
  'templates.preview': '预览',
  'templates.use': '使用模板',
  
  // 账户
  'account.profile': '个人资料',
  'account.resumes': '我的简历',
  'account.settings': '账户设置',
  'account.statistics': '统计数据',
  'account.subscription': '订阅',
  'account.billing': '账单',
  'account.security': '安全',
  'account.notifications': '通知',
  
  // 错误信息
  'error.required': '此字段为必填项',
  'error.invalid': '格式不正确',
  'error.tooShort': '内容过短',
  'error.tooLong': '内容过长',
  'error.network': '网络连接错误',
  'error.server': '服务器错误',
  'error.notFound': '未找到',
  'error.unauthorized': '未授权',
  'error.forbidden': '禁止访问',
  
  // 成功信息
  'success.saved': '保存成功',
  'success.deleted': '删除成功',
  'success.updated': '更新成功',
  'success.created': '创建成功',
  'success.exported': '导出成功',
  'success.imported': '导入成功',
  'success.uploaded': '上传成功',
  'success.downloaded': '下载成功'
};

// 英文翻译
const enTranslations: Translations = {
  // 通用
  'common.save': 'Save',
  'common.cancel': 'Cancel',
  'common.delete': 'Delete',
  'common.edit': 'Edit',
  'common.add': 'Add',
  'common.remove': 'Remove',
  'common.confirm': 'Confirm',
  'common.loading': 'Loading...',
  'common.error': 'Error',
  'common.success': 'Success',
  'common.warning': 'Warning',
  'common.info': 'Info',
  'common.close': 'Close',
  'common.back': 'Back',
  'common.next': 'Next',
  'common.previous': 'Previous',
  'common.search': 'Search',
  'common.filter': 'Filter',
  'common.sort': 'Sort',
  'common.export': 'Export',
  'common.import': 'Import',
  'common.download': 'Download',
  'common.upload': 'Upload',
  'common.preview': 'Preview',
  'common.settings': 'Settings',
  'common.help': 'Help',
  'common.about': 'About',
  
  // 导航
  'nav.home': 'Home',
  'nav.editor': 'Editor',
  'nav.templates': 'Templates',
  'nav.account': 'Account',
  'nav.help': 'Help',
  'nav.language': 'Language',
  
  // 简历编辑器
  'editor.title': 'Resume Editor',
  'editor.personalInfo': 'Personal Info',
  'editor.experience': 'Experience',
  'editor.education': 'Education',
  'editor.skills': 'Skills',
  'editor.projects': 'Projects',
  'editor.generate': 'AI Generate',
  'editor.optimize': 'AI Optimize',
  'editor.score': 'Score',
  'editor.preview': 'Preview',
  
  // 个人信息
  'personalInfo.fullName': 'Full Name',
  'personalInfo.email': 'Email',
  'personalInfo.phone': 'Phone',
  'personalInfo.location': 'Location',
  'personalInfo.website': 'Website',
  'personalInfo.linkedin': 'LinkedIn',
  'personalInfo.github': 'GitHub',
  'personalInfo.summary': 'Summary',
  'personalInfo.avatar': 'Avatar',
  
  // 工作经验
  'experience.company': 'Company',
  'experience.position': 'Position',
  'experience.startDate': 'Start Date',
  'experience.endDate': 'End Date',
  'experience.current': 'Current',
  'experience.description': 'Description',
  'experience.achievements': 'Achievements',
  'experience.addExperience': 'Add Experience',
  
  // 教育背景
  'education.school': 'School',
  'education.degree': 'Degree',
  'education.major': 'Major',
  'education.startDate': 'Start Date',
  'education.endDate': 'End Date',
  'education.gpa': 'GPA',
  'education.description': 'Description',
  'education.addEducation': 'Add Education',
  
  // 技能
  'skills.name': 'Skill Name',
  'skills.level': 'Level',
  'skills.category': 'Category',
  'skills.addSkill': 'Add Skill',
  'skills.technical': 'Technical Skills',
  'skills.soft': 'Soft Skills',
  'skills.language': 'Language Skills',
  
  // 项目经验
  'projects.name': 'Project Name',
  'projects.description': 'Description',
  'projects.technologies': 'Technologies',
  'projects.url': 'Project URL',
  'projects.startDate': 'Start Date',
  'projects.endDate': 'End Date',
  'projects.addProject': 'Add Project',
  
  // AI功能
  'ai.generate.title': 'AI Resume Generator',
  'ai.generate.description': 'Generate professional resume based on your information',
  'ai.generate.industry': 'Industry',
  'ai.generate.position': 'Target Position',
  'ai.generate.experience': 'Experience Level',
  'ai.generate.tone': 'Tone',
  'ai.generate.length': 'Resume Length',
  'ai.generate.skills': 'Skills',
  'ai.generate.button': 'Generate Resume',
  'ai.optimize.title': 'AI Resume Optimizer',
  'ai.optimize.description': 'Analyze and optimize your resume content',
  'ai.optimize.analyze': 'Analyze Resume',
  'ai.optimize.suggestions': 'Suggestions',
  'ai.optimize.keywords': 'Keyword Analysis',
  'ai.optimize.score': 'Resume Score',
  
  // 模板
  'templates.title': 'Resume Templates',
  'templates.search': 'Search Templates',
  'templates.category': 'Category',
  'templates.industry': 'Industry',
  'templates.level': 'Level',
  'templates.free': 'Free',
  'templates.premium': 'Premium',
  'templates.popular': 'Popular',
  'templates.newest': 'Newest',
  'templates.rating': 'Rating',
  'templates.downloads': 'Downloads',
  'templates.preview': 'Preview',
  'templates.use': 'Use Template',
  
  // 账户
  'account.profile': 'Profile',
  'account.resumes': 'My Resumes',
  'account.settings': 'Settings',
  'account.statistics': 'Statistics',
  'account.subscription': 'Subscription',
  'account.billing': 'Billing',
  'account.security': 'Security',
  'account.notifications': 'Notifications',
  
  // 错误信息
  'error.required': 'This field is required',
  'error.invalid': 'Invalid format',
  'error.tooShort': 'Too short',
  'error.tooLong': 'Too long',
  'error.network': 'Network error',
  'error.server': 'Server error',
  'error.notFound': 'Not found',
  'error.unauthorized': 'Unauthorized',
  'error.forbidden': 'Forbidden',
  
  // 成功信息
  'success.saved': 'Saved successfully',
  'success.deleted': 'Deleted successfully',
  'success.updated': 'Updated successfully',
  'success.created': 'Created successfully',
  'success.exported': 'Exported successfully',
  'success.imported': 'Imported successfully',
  'success.uploaded': 'Uploaded successfully',
  'success.downloaded': 'Downloaded successfully'
};

// 所有翻译
const translations: Record<Locale, Translations> = {
  zh: zhTranslations,
  en: enTranslations
};

// 国际化上下文
interface I18nContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: TranslationKey, params?: Record<string, string | number>) => string;
  formatDate: (date: Date | string) => string;
  formatNumber: (number: number) => string;
  formatCurrency: (amount: number, currency?: string) => string;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

// 国际化提供者组件
interface I18nProviderProps {
  children: ReactNode;
  initialLocale?: Locale;
}

export function I18nProvider({ children, initialLocale }: I18nProviderProps) {
  const router = useRouter();
  const pathname = usePathname();
  
  // 从路径中提取当前语言
  const getLocaleFromPath = (): Locale => {
    const segments = pathname.split('/');
    const potentialLocale = segments[1];
    
    if (locales.includes(potentialLocale as Locale)) {
      return potentialLocale as Locale;
    }
    
    return initialLocale || defaultLocale;
  };
  
  const [locale, setLocaleState] = useState<Locale>(getLocaleFromPath);
  
  // 监听路径变化更新语言
  useEffect(() => {
    const currentLocale = getLocaleFromPath();
    if (currentLocale !== locale) {
      setLocaleState(currentLocale);
    }
  }, [pathname, locale]);
  
  // 设置语言并更新路径
  const setLocale = (newLocale: Locale) => {
    if (newLocale !== locale) {
      // 构建新的路径
      const segments = pathname.split('/');
      const currentLocale = segments[1];
      
      let newPath: string;
      if (locales.includes(currentLocale as Locale)) {
        // 替换现有语言
        segments[1] = newLocale;
        newPath = segments.join('/');
      } else {
        // 添加语言前缀
        newPath = `/${newLocale}${pathname}`;
      }
      
      // 保存到本地存储
      localStorage.setItem('preferred-locale', newLocale);
      
      // 导航到新路径
      router.push(newPath);
    }
  };
  
  // 翻译函数
  const t = (key: TranslationKey, params?: Record<string, string | number>): string => {
    const translation = translations[locale][key] || key;
    
    if (!params) {
      return translation;
    }
    
    // 替换参数
    return translation.replace(/\{\{(\w+)\}\}/g, (match, paramKey) => {
      return params[paramKey]?.toString() || match;
    });
  };
  
  // 格式化日期
  const formatDate = (date: Date | string): string => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    };
    
    const intlLocale = locale === 'zh' ? 'zh-CN' : 'en-US';
    return new Intl.DateTimeFormat(intlLocale, options).format(dateObj);
  };
  
  // 格式化数字
  const formatNumber = (number: number): string => {
    const intlLocale = locale === 'zh' ? 'zh-CN' : 'en-US';
    return new Intl.NumberFormat(intlLocale).format(number);
  };
  
  // 格式化货币
  const formatCurrency = (amount: number, currency: string = 'CNY'): string => {
    const intlLocale = locale === 'zh' ? 'zh-CN' : 'en-US';
    return new Intl.NumberFormat(intlLocale, {
      style: 'currency',
      currency
    }).format(amount);
  };
  
  const value: I18nContextType = {
    locale,
    setLocale,
    t,
    formatDate,
    formatNumber,
    formatCurrency
  };
  
  return (
    <I18nContext.Provider value={value}>
      {children}
    </I18nContext.Provider>
  );
}

// Hook: 使用国际化
export function useI18n() {
  const context = useContext(I18nContext);
  
  if (!context) {
    throw new Error('useI18n must be used within an I18nProvider');
  }
  
  return context;
}

// Hook: 使用翻译
export function useTranslation() {
  const { t, locale } = useI18n();
  
  return {
    t,
    locale,
    isRTL: false // 目前支持的语言都是LTR
  };
}

// 语言切换器组件
export function LanguageSwitcher() {
  const { locale, setLocale } = useI18n();
  
  const languages = [
    { code: 'zh' as const, name: '中文', nativeName: '中文' },
    { code: 'en' as const, name: 'English', nativeName: 'English' }
  ];
  
  return (
    <select
      value={locale}
      onChange={(e) => setLocale(e.target.value as Locale)}
      className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
    >
      {languages.map((lang) => (
        <option key={lang.code} value={lang.code}>
          {lang.nativeName}
        </option>
      ))}
    </select>
  );
}

// 导出类型
export type { I18nContextType, TranslationKey };