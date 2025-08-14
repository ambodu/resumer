// 数据中间层工具函数

import {
  ResumeData,
  StyledResumeData,
  ResumeTemplate,
  StyleConfig,
  TransformationOptions,
  TransformationResult,
  ValidationError,
  ValidationWarning
} from './types';

// 日期格式化工具
export const DateUtils = {
  // 格式化日期为字符串
  formatDate: (date: Date | string | null, format: 'full' | 'short' | 'year' = 'short'): string => {
    if (!date) return '';
    
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    if (isNaN(dateObj.getTime())) return '';
    
    switch (format) {
      case 'full':
        return dateObj.toLocaleDateString('zh-CN', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        });
      case 'year':
        return dateObj.getFullYear().toString();
      case 'short':
      default:
        return dateObj.toLocaleDateString('zh-CN', {
          year: 'numeric',
          month: '2-digit'
        });
    }
  },

  // 格式化日期范围
  formatDateRange: (
    startDate: Date | string | null,
    endDate: Date | string | null,
    format: 'full' | 'short' | 'year' = 'short'
  ): string => {
    const start = DateUtils.formatDate(startDate, format);
    const end = endDate ? DateUtils.formatDate(endDate, format) : '至今';
    
    if (!start) return end === '至今' ? '' : end;
    return `${start} - ${end}`;
  },

  // 计算工作时长
  calculateDuration: (startDate: Date | string | null, endDate: Date | string | null): string => {
    if (!startDate) return '';
    
    const start = typeof startDate === 'string' ? new Date(startDate) : startDate;
    const end = endDate ? (typeof endDate === 'string' ? new Date(endDate) : endDate) : new Date();
    
    if (isNaN(start.getTime()) || isNaN(end.getTime())) return '';
    
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const years = Math.floor(diffDays / 365);
    const months = Math.floor((diffDays % 365) / 30);
    
    if (years > 0 && months > 0) {
      return `${years}年${months}个月`;
    } else if (years > 0) {
      return `${years}年`;
    } else if (months > 0) {
      return `${months}个月`;
    } else {
      return '不足1个月';
    }
  }
};

// 文本处理工具
export const TextUtils = {
  // 截断文本
  truncate: (text: string, maxLength: number, suffix: string = '...'): string => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength - suffix.length) + suffix;
  },

  // 清理文本
  sanitize: (text: string): string => {
    return text
      .replace(/\s+/g, ' ') // 合并多个空格
      .replace(/\n\s*\n/g, '\n') // 合并多个换行
      .trim();
  },

  // 提取关键词
  extractKeywords: (text: string, maxCount: number = 10): string[] => {
    const words = text
      .toLowerCase()
      .replace(/[^\u4e00-\u9fa5a-zA-Z0-9\s]/g, '') // 只保留中文、英文、数字和空格
      .split(/\s+/)
      .filter(word => word.length > 1);
    
    const wordCount = new Map<string, number>();
    words.forEach(word => {
      wordCount.set(word, (wordCount.get(word) || 0) + 1);
    });
    
    return Array.from(wordCount.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, maxCount)
      .map(([word]) => word);
  },

  // 计算字数
  countWords: (text: string): number => {
    // 中文字符按字计算，英文按单词计算
    const chineseChars = (text.match(/[\u4e00-\u9fa5]/g) || []).length;
    const englishWords = (text.match(/[a-zA-Z]+/g) || []).length;
    return chineseChars + englishWords;
  },

  // 生成摘要
  generateSummary: (text: string, maxLength: number = 100): string => {
    const sentences = text.split(/[。！？.!?]/).filter(s => s.trim().length > 0);
    let summary = '';
    
    for (const sentence of sentences) {
      if (summary.length + sentence.length > maxLength) break;
      summary += sentence.trim() + '。';
    }
    
    return summary || TextUtils.truncate(text, maxLength);
  }
};

// 技能等级工具
export const SkillUtils = {
  // 技能等级映射
  levelMap: {
    1: { label: '入门', description: '基础了解' },
    2: { label: '初级', description: '能够使用' },
    3: { label: '中级', description: '熟练掌握' },
    4: { label: '高级', description: '精通应用' },
    5: { label: '专家', description: '专家级别' }
  } as const,

  // 获取技能等级标签
  getLevelLabel: (level: number): string => {
    return SkillUtils.levelMap[level as keyof typeof SkillUtils.levelMap]?.label || '未知';
  },

  // 获取技能等级描述
  getLevelDescription: (level: number): string => {
    return SkillUtils.levelMap[level as keyof typeof SkillUtils.levelMap]?.description || '未知等级';
  },

  // 技能分组
  groupSkills: (skills: Array<{ name: string; level: number; category?: string }>) => {
    const groups = new Map<string, Array<{ name: string; level: number }>>>();
    
    skills.forEach(skill => {
      const category = skill.category || '其他';
      if (!groups.has(category)) {
        groups.set(category, []);
      }
      groups.get(category)!.push({ name: skill.name, level: skill.level });
    });
    
    // 按等级排序
    groups.forEach(skillList => {
      skillList.sort((a, b) => b.level - a.level);
    });
    
    return groups;
  },

  // 生成技能标签
  generateSkillTags: (skills: Array<{ name: string; level: number }>, minLevel: number = 3): string[] => {
    return skills
      .filter(skill => skill.level >= minLevel)
      .sort((a, b) => b.level - a.level)
      .map(skill => skill.name);
  }
};

// 数据验证工具
export const ValidationUtils = {
  // 验证邮箱
  isValidEmail: (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  // 验证电话号码
  isValidPhone: (phone: string): boolean => {
    const phoneRegex = /^[\d\s\-\+\(\)]+$/;
    return phoneRegex.test(phone) && phone.replace(/\D/g, '').length >= 7;
  },

  // 验证URL
  isValidUrl: (url: string): boolean => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  },

  // 验证必填字段
  validateRequired: (value: any, fieldName: string): ValidationError | null => {
    if (value === null || value === undefined || value === '') {
      return {
        field: fieldName,
        message: `${fieldName}是必填字段`,
        type: 'required'
      };
    }
    return null;
  },

  // 验证字符串长度
  validateLength: (
    value: string,
    fieldName: string,
    min?: number,
    max?: number
  ): ValidationError | null => {
    if (min !== undefined && value.length < min) {
      return {
        field: fieldName,
        message: `${fieldName}长度不能少于${min}个字符`,
        type: 'minLength'
      };
    }
    if (max !== undefined && value.length > max) {
      return {
        field: fieldName,
        message: `${fieldName}长度不能超过${max}个字符`,
        type: 'maxLength'
      };
    }
    return null;
  },

  // 验证简历数据完整性
  validateResumeData: (data: ResumeData): { errors: ValidationError[]; warnings: ValidationWarning[] } => {
    const errors: ValidationError[] = [];
    const warnings: ValidationWarning[] = [];

    // 验证个人信息
    if (!data.personalInfo?.name) {
      errors.push({ field: 'personalInfo.name', message: '姓名是必填项', type: 'required' });
    }
    if (!data.personalInfo?.email) {
      errors.push({ field: 'personalInfo.email', message: '邮箱是必填项', type: 'required' });
    } else if (!ValidationUtils.isValidEmail(data.personalInfo.email)) {
      errors.push({ field: 'personalInfo.email', message: '邮箱格式不正确', type: 'format' });
    }
    if (data.personalInfo?.phone && !ValidationUtils.isValidPhone(data.personalInfo.phone)) {
      warnings.push({ field: 'personalInfo.phone', message: '电话号码格式可能不正确', type: 'format' });
    }

    // 验证工作经历
    if (!data.experience || data.experience.length === 0) {
      warnings.push({ field: 'experience', message: '建议添加工作经历', type: 'recommendation' });
    } else {
      data.experience.forEach((exp, index) => {
        if (!exp.company) {
          errors.push({ field: `experience[${index}].company`, message: '公司名称是必填项', type: 'required' });
        }
        if (!exp.position) {
          errors.push({ field: `experience[${index}].position`, message: '职位名称是必填项', type: 'required' });
        }
        if (!exp.startDate) {
          errors.push({ field: `experience[${index}].startDate`, message: '开始日期是必填项', type: 'required' });
        }
      });
    }

    // 验证教育背景
    if (!data.education || data.education.length === 0) {
      warnings.push({ field: 'education', message: '建议添加教育背景', type: 'recommendation' });
    } else {
      data.education.forEach((edu, index) => {
        if (!edu.school) {
          errors.push({ field: `education[${index}].school`, message: '学校名称是必填项', type: 'required' });
        }
        if (!edu.degree) {
          errors.push({ field: `education[${index}].degree`, message: '学历是必填项', type: 'required' });
        }
      });
    }

    return { errors, warnings };
  }
};

// 样式工具
export const StyleUtils = {
  // 合并样式
  mergeStyles: <T extends Record<string, any>>(base: T, override: Partial<T>): T => {
    return { ...base, ...override };
  },

  // 计算响应式字体大小
  getResponsiveFontSize: (baseSize: number, scale: number = 1): number => {
    return Math.round(baseSize * scale);
  },

  // 生成颜色变体
  generateColorVariants: (baseColor: string) => {
    // 简单的颜色变体生成（实际项目中可能需要更复杂的颜色处理）
    return {
      light: baseColor + '20', // 添加透明度
      medium: baseColor + '60',
      dark: baseColor + 'CC'
    };
  },

  // 计算对比度
  getContrastColor: (backgroundColor: string): string => {
    // 简单的对比度计算（实际项目中可能需要更精确的算法）
    const isLight = backgroundColor.includes('f') || backgroundColor.includes('e');
    return isLight ? '#000000' : '#ffffff';
  },

  // 生成间距值
  generateSpacing: (base: number) => {
    return {
      xs: base * 0.25,
      sm: base * 0.5,
      md: base,
      lg: base * 1.5,
      xl: base * 2,
      xxl: base * 3
    };
  }
};

// 布局工具
export const LayoutUtils = {
  // 计算列宽
  calculateColumnWidth: (totalWidth: number, columns: number, gap: number): number => {
    return (totalWidth - gap * (columns - 1)) / columns;
  },

  // 生成网格布局
  generateGridLayout: (items: any[], columns: number) => {
    const rows: any[][] = [];
    for (let i = 0; i < items.length; i += columns) {
      rows.push(items.slice(i, i + columns));
    }
    return rows;
  },

  // 计算内容高度
  estimateContentHeight: (content: string, fontSize: number, lineHeight: number, width: number): number => {
    const charactersPerLine = Math.floor(width / (fontSize * 0.6)); // 估算每行字符数
    const lines = Math.ceil(content.length / charactersPerLine);
    return lines * fontSize * lineHeight;
  }
};

// 性能优化工具
export const PerformanceUtils = {
  // 防抖函数
  debounce: <T extends (...args: any[]) => any>(
    func: T,
    wait: number
  ): ((...args: Parameters<T>) => void) => {
    let timeout: NodeJS.Timeout;
    return (...args: Parameters<T>) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), wait);
    };
  },

  // 节流函数
  throttle: <T extends (...args: any[]) => any>(
    func: T,
    limit: number
  ): ((...args: Parameters<T>) => void) => {
    let inThrottle: boolean;
    return (...args: Parameters<T>) => {
      if (!inThrottle) {
        func(...args);
        inThrottle = true;
        setTimeout(() => (inThrottle = false), limit);
      }
    };
  },

  // 深度克隆
  deepClone: <T>(obj: T): T => {
    if (obj === null || typeof obj !== 'object') return obj;
    if (obj instanceof Date) return new Date(obj.getTime()) as unknown as T;
    if (obj instanceof Array) return obj.map(item => PerformanceUtils.deepClone(item)) as unknown as T;
    if (typeof obj === 'object') {
      const clonedObj = {} as T;
      for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
          clonedObj[key] = PerformanceUtils.deepClone(obj[key]);
        }
      }
      return clonedObj;
    }
    return obj;
  },

  // 缓存装饰器
  memoize: <T extends (...args: any[]) => any>(fn: T): T => {
    const cache = new Map();
    return ((...args: Parameters<T>) => {
      const key = JSON.stringify(args);
      if (cache.has(key)) {
        return cache.get(key);
      }
      const result = fn(...args);
      cache.set(key, result);
      return result;
    }) as T;
  }
};

// 导出所有工具
export const DataTransformUtils = {
  DateUtils,
  TextUtils,
  SkillUtils,
  ValidationUtils,
  StyleUtils,
  LayoutUtils,
  PerformanceUtils
};