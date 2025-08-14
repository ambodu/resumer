// 数据中间层模板预设

import {
  ResumeTemplate,
  StyleConfig,
  FontConfig,
  ColorConfig,
  SpacingConfig,
  LayoutConfig,
  ComponentStyleConfig,
  TemplateLayoutConfig
} from './types';

// 基础样式配置
const createBaseStyleConfig = (): StyleConfig => ({
  fonts: {
    primary: {
      family: 'Helvetica',
      size: 12,
      weight: 'normal',
      lineHeight: 1.4
    },
    secondary: {
      family: 'Helvetica',
      size: 10,
      weight: 'normal',
      lineHeight: 1.3
    },
    heading: {
      family: 'Helvetica',
      size: 16,
      weight: 'bold',
      lineHeight: 1.2
    },
    body: {
      family: 'Helvetica',
      size: 11,
      weight: 'normal',
      lineHeight: 1.4
    },
    caption: {
      family: 'Helvetica',
      size: 9,
      weight: 'normal',
      lineHeight: 1.3
    }
  },
  colors: {
    primary: '#2563eb',
    secondary: '#64748b',
    accent: '#0ea5e9',
    text: {
      primary: '#1f2937',
      secondary: '#6b7280',
      muted: '#9ca3af',
      inverse: '#ffffff'
    },
    background: {
      primary: '#ffffff',
      secondary: '#f8fafc',
      accent: '#eff6ff'
    },
    border: {
      light: '#e5e7eb',
      medium: '#d1d5db',
      dark: '#9ca3af'
    }
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48
  },
  layout: {
    pageSize: 'A4',
    orientation: 'portrait',
    margins: {
      top: 40,
      right: 40,
      bottom: 40,
      left: 40
    },
    columns: 1,
    columnGap: 20
  },
  components: {
    header: {
      padding: 16,
      textAlign: 'center',
      borderBottom: {
        width: 1,
        style: 'solid',
        color: '#e5e7eb'
      }
    },
    section: {
      marginBottom: 20,
      titleStyle: {
        font: {
          family: 'Helvetica',
          size: 14,
          weight: 'bold',
          lineHeight: 1.2
        },
        color: '#1f2937',
        alignment: 'left',
        margin: { bottom: 8 }
      },
      contentStyle: {
        font: {
          family: 'Helvetica',
          size: 11,
          weight: 'normal',
          lineHeight: 1.4
        },
        color: '#374151',
        alignment: 'left'
      }
    },
    list: {
      itemSpacing: 6,
      bulletStyle: 'disc',
      indentation: 20
    },
    table: {
      headerBackground: '#f3f4f6',
      headerTextColor: '#1f2937',
      borderColor: '#d1d5db',
      borderWidth: 1,
      cellPadding: 8
    },
    divider: {
      color: '#e5e7eb',
      width: 1,
      style: 'solid',
      margin: { top: 16, bottom: 16 }
    }
  }
});

// 现代风格模板
export const modernTemplate: ResumeTemplate = {
  id: 'modern',
  name: '现代风格',
  description: '简洁现代的设计，适合技术和创意行业',
  category: 'modern',
  preview: '/templates/modern-preview.png',
  styleConfig: {
    ...createBaseStyleConfig(),
    colors: {
      primary: '#3b82f6',
      secondary: '#64748b',
      accent: '#06b6d4',
      text: {
        primary: '#1e293b',
        secondary: '#64748b',
        muted: '#94a3b8',
        inverse: '#ffffff'
      },
      background: {
        primary: '#ffffff',
        secondary: '#f1f5f9',
        accent: '#dbeafe'
      },
      border: {
        light: '#e2e8f0',
        medium: '#cbd5e1',
        dark: '#94a3b8'
      }
    }
  },
  layoutConfig: {
    type: 'single-column',
    headerPosition: 'top',
    sectionSpacing: 24,
    showSectionDividers: true
  },
  sectionOrder: [
    'personal-info',
    'summary',
    'experience',
    'education',
    'skills',
    'projects'
  ]
};

// 经典风格模板
export const classicTemplate: ResumeTemplate = {
  id: 'classic',
  name: '经典风格',
  description: '传统正式的设计，适合传统行业和正式场合',
  category: 'classic',
  preview: '/templates/classic-preview.png',
  styleConfig: {
    ...createBaseStyleConfig(),
    fonts: {
      primary: {
        family: 'Times',
        size: 12,
        weight: 'normal',
        lineHeight: 1.5
      },
      secondary: {
        family: 'Times',
        size: 10,
        weight: 'normal',
        lineHeight: 1.4
      },
      heading: {
        family: 'Times',
        size: 16,
        weight: 'bold',
        lineHeight: 1.3
      },
      body: {
        family: 'Times',
        size: 11,
        weight: 'normal',
        lineHeight: 1.5
      },
      caption: {
        family: 'Times',
        size: 9,
        weight: 'normal',
        lineHeight: 1.4
      }
    },
    colors: {
      primary: '#1f2937',
      secondary: '#4b5563',
      accent: '#374151',
      text: {
        primary: '#111827',
        secondary: '#4b5563',
        muted: '#6b7280',
        inverse: '#ffffff'
      },
      background: {
        primary: '#ffffff',
        secondary: '#f9fafb',
        accent: '#f3f4f6'
      },
      border: {
        light: '#e5e7eb',
        medium: '#d1d5db',
        dark: '#9ca3af'
      }
    }
  },
  layoutConfig: {
    type: 'single-column',
    headerPosition: 'top',
    sectionSpacing: 20,
    showSectionDividers: false
  },
  sectionOrder: [
    'personal-info',
    'summary',
    'experience',
    'education',
    'skills',
    'certifications',
    'references'
  ]
};

// 创意风格模板
export const creativeTemplate: ResumeTemplate = {
  id: 'creative',
  name: '创意风格',
  description: '富有创意的设计，适合设计师和艺术工作者',
  category: 'creative',
  preview: '/templates/creative-preview.png',
  styleConfig: {
    ...createBaseStyleConfig(),
    colors: {
      primary: '#8b5cf6',
      secondary: '#a78bfa',
      accent: '#06b6d4',
      text: {
        primary: '#1e1b4b',
        secondary: '#5b21b6',
        muted: '#8b5cf6',
        inverse: '#ffffff'
      },
      background: {
        primary: '#ffffff',
        secondary: '#faf5ff',
        accent: '#ede9fe'
      },
      border: {
        light: '#e9d5ff',
        medium: '#c4b5fd',
        dark: '#8b5cf6'
      }
    },
    fonts: {
      primary: {
        family: 'Helvetica',
        size: 12,
        weight: 'normal',
        lineHeight: 1.4
      },
      secondary: {
        family: 'Helvetica',
        size: 10,
        weight: 'normal',
        lineHeight: 1.3
      },
      heading: {
        family: 'Helvetica',
        size: 18,
        weight: 'bold',
        lineHeight: 1.2,
        letterSpacing: 0.5
      },
      body: {
        family: 'Helvetica',
        size: 11,
        weight: 'normal',
        lineHeight: 1.4
      },
      caption: {
        family: 'Helvetica',
        size: 9,
        weight: 'normal',
        lineHeight: 1.3
      }
    }
  },
  layoutConfig: {
    type: 'two-column',
    headerPosition: 'top',
    sectionSpacing: 28,
    showSectionDividers: true
  },
  sectionOrder: [
    'personal-info',
    'summary',
    'skills',
    'experience',
    'projects',
    'education'
  ]
};

// 简约风格模板
export const minimalTemplate: ResumeTemplate = {
  id: 'minimal',
  name: '简约风格',
  description: '极简设计，突出内容本身',
  category: 'minimal',
  preview: '/templates/minimal-preview.png',
  styleConfig: {
    ...createBaseStyleConfig(),
    colors: {
      primary: '#000000',
      secondary: '#666666',
      accent: '#333333',
      text: {
        primary: '#000000',
        secondary: '#333333',
        muted: '#666666',
        inverse: '#ffffff'
      },
      background: {
        primary: '#ffffff',
        secondary: '#ffffff',
        accent: '#f5f5f5'
      },
      border: {
        light: '#e0e0e0',
        medium: '#cccccc',
        dark: '#999999'
      }
    },
    spacing: {
      xs: 2,
      sm: 4,
      md: 8,
      lg: 16,
      xl: 24,
      xxl: 32
    }
  },
  layoutConfig: {
    type: 'single-column',
    headerPosition: 'top',
    sectionSpacing: 16,
    showSectionDividers: false
  },
  sectionOrder: [
    'personal-info',
    'experience',
    'education',
    'skills',
    'projects'
  ]
};

// 专业风格模板
export const professionalTemplate: ResumeTemplate = {
  id: 'professional',
  name: '专业风格',
  description: '专业商务设计，适合商业和管理岗位',
  category: 'professional',
  preview: '/templates/professional-preview.png',
  styleConfig: {
    ...createBaseStyleConfig(),
    colors: {
      primary: '#1e40af',
      secondary: '#3730a3',
      accent: '#1d4ed8',
      text: {
        primary: '#1e293b',
        secondary: '#475569',
        muted: '#64748b',
        inverse: '#ffffff'
      },
      background: {
        primary: '#ffffff',
        secondary: '#f8fafc',
        accent: '#eff6ff'
      },
      border: {
        light: '#e2e8f0',
        medium: '#cbd5e1',
        dark: '#94a3b8'
      }
    }
  },
  layoutConfig: {
    type: 'sidebar',
    headerPosition: 'top',
    sidebarWidth: 200,
    sidebarPosition: 'left',
    sectionSpacing: 20,
    showSectionDividers: true
  },
  sectionOrder: [
    'personal-info',
    'summary',
    'experience',
    'education',
    'skills',
    'certifications',
    'languages'
  ]
};

// 模板注册表
export const templateRegistry = new Map<string, ResumeTemplate>([
  ['modern', modernTemplate],
  ['classic', classicTemplate],
  ['creative', creativeTemplate],
  ['minimal', minimalTemplate],
  ['professional', professionalTemplate]
]);

// 获取所有模板
export const getAllTemplates = (): ResumeTemplate[] => {
  return Array.from(templateRegistry.values());
};

// 根据ID获取模板
export const getTemplateById = (id: string): ResumeTemplate | undefined => {
  return templateRegistry.get(id);
};

// 根据分类获取模板
export const getTemplatesByCategory = (category: string): ResumeTemplate[] => {
  return Array.from(templateRegistry.values()).filter(template => template.category === category);
};

// 创建自定义模板
export const createCustomTemplate = (
  id: string,
  name: string,
  description: string,
  category: 'modern' | 'classic' | 'creative' | 'minimal' | 'professional',
  styleOverrides: Partial<StyleConfig> = {},
  layoutOverrides: Partial<TemplateLayoutConfig> = {},
  sectionOrder?: string[]
): ResumeTemplate => {
  const baseTemplate = getTemplateById(category) || modernTemplate;
  
  return {
    id,
    name,
    description,
    category,
    preview: `/templates/${id}-preview.png`,
    styleConfig: {
      ...baseTemplate.styleConfig,
      ...styleOverrides,
      fonts: {
        ...baseTemplate.styleConfig.fonts,
        ...styleOverrides.fonts
      },
      colors: {
        ...baseTemplate.styleConfig.colors,
        ...styleOverrides.colors,
        text: {
          ...baseTemplate.styleConfig.colors.text,
          ...styleOverrides.colors?.text
        },
        background: {
          ...baseTemplate.styleConfig.colors.background,
          ...styleOverrides.colors?.background
        },
        border: {
          ...baseTemplate.styleConfig.colors.border,
          ...styleOverrides.colors?.border
        }
      },
      spacing: {
        ...baseTemplate.styleConfig.spacing,
        ...styleOverrides.spacing
      },
      layout: {
        ...baseTemplate.styleConfig.layout,
        ...styleOverrides.layout
      },
      components: {
        ...baseTemplate.styleConfig.components,
        ...styleOverrides.components
      }
    },
    layoutConfig: {
      ...baseTemplate.layoutConfig,
      ...layoutOverrides
    },
    sectionOrder: sectionOrder || baseTemplate.sectionOrder
  };
};

// 注册自定义模板
export const registerTemplate = (template: ResumeTemplate): void => {
  templateRegistry.set(template.id, template);
};

// 模板工具函数
export const TemplateUtils = {
  // 克隆模板
  cloneTemplate: (template: ResumeTemplate, newId: string, newName?: string): ResumeTemplate => {
    return {
      ...template,
      id: newId,
      name: newName || `${template.name} (副本)`,
      preview: `/templates/${newId}-preview.png`
    };
  },

  // 合并样式配置
  mergeStyleConfig: (base: StyleConfig, override: Partial<StyleConfig>): StyleConfig => {
    return {
      fonts: { ...base.fonts, ...override.fonts },
      colors: {
        ...base.colors,
        ...override.colors,
        text: { ...base.colors.text, ...override.colors?.text },
        background: { ...base.colors.background, ...override.colors?.background },
        border: { ...base.colors.border, ...override.colors?.border }
      },
      spacing: { ...base.spacing, ...override.spacing },
      layout: { ...base.layout, ...override.layout },
      components: { ...base.components, ...override.components }
    };
  },

  // 验证模板配置
  validateTemplate: (template: ResumeTemplate): { isValid: boolean; errors: string[] } => {
    const errors: string[] = [];

    if (!template.id) errors.push('模板ID不能为空');
    if (!template.name) errors.push('模板名称不能为空');
    if (!template.styleConfig) errors.push('样式配置不能为空');
    if (!template.layoutConfig) errors.push('布局配置不能为空');
    if (!template.sectionOrder || template.sectionOrder.length === 0) {
      errors.push('章节顺序不能为空');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  },

  // 获取模板预览数据
  getTemplatePreview: (template: ResumeTemplate) => {
    return {
      id: template.id,
      name: template.name,
      description: template.description,
      category: template.category,
      preview: template.preview,
      features: [
        `${template.layoutConfig.type === 'single-column' ? '单栏' : '多栏'}布局`,
        `${template.sectionOrder.length}个章节`,
        template.layoutConfig.showSectionDividers ? '带分割线' : '无分割线',
        `${template.styleConfig.layout.pageSize}页面`
      ]
    };
  }
};