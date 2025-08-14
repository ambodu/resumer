// 数据中间层主导出文件

// 导出类型定义
export type {
  // 基础数据类型
  ResumeData,
  PersonalInfo,
  WorkExperience,
  Education,
  Skill,
  Project,
  Certification,
  Language,
  Reference,
  CustomSection,
  
  // 样式配置类型
  StyleConfig,
  FontConfig,
  ColorConfig,
  SpacingConfig,
  LayoutConfig,
  ComponentStyleConfig,
  
  // 模板类型
  ResumeTemplate,
  TemplateLayoutConfig,
  
  // 转换结果类型
  StyledResumeData,
  StyledSection,
  StyledPersonalInfo,
  StyledExperience,
  StyledEducation,
  StyledSkill,
  StyledProject,
  
  // 转换配置类型
  TransformationOptions,
  TransformationResult,
  ValidationError,
  ValidationWarning,
  
  // 数据处理类型
  DataProcessor,
  SectionProcessor,
  StyleProcessor
} from './types';

// 导出核心功能
export {
  ResumeDataTransformer
} from './core';

// 导出模板相关
export {
  // 预设模板
  modernTemplate,
  classicTemplate,
  creativeTemplate,
  minimalTemplate,
  professionalTemplate,
  
  // 模板注册表
  templateRegistry,
  
  // 模板工具函数
  getAllTemplates,
  getTemplateById,
  getTemplatesByCategory,
  createCustomTemplate,
  registerTemplate,
  TemplateUtils
} from './templates';

// 导出工具函数
export {
  DateUtils,
  TextUtils,
  SkillUtils,
  ValidationUtils,
  StyleUtils,
  LayoutUtils,
  PerformanceUtils,
  DataTransformUtils
} from './utils';

// 创建数据转换器实例
export const createResumeTransformer = () => {
  return new ResumeDataTransformer();
};

// 快速转换函数
export const transformResumeData = async (
  data: ResumeData,
  templateId: string,
  options?: TransformationOptions
): Promise<TransformationResult> => {
  const transformer = createResumeTransformer();
  return transformer.transform(data, templateId, options);
};

// 验证简历数据
export const validateResumeData = (data: ResumeData) => {
  return ValidationUtils.validateResumeData(data);
};

// 预设配置
export const DataTransformPresets = {
  // 默认转换选项
  defaultTransformOptions: {
    validateData: true,
    optimizeForPrint: true,
    includeMetadata: true,
    customProcessors: []
  } as TransformationOptions,
  
  // 快速转换选项（跳过验证，提高性能）
  quickTransformOptions: {
    validateData: false,
    optimizeForPrint: false,
    includeMetadata: false,
    customProcessors: []
  } as TransformationOptions,
  
  // 高质量转换选项（完整验证和优化）
  highQualityTransformOptions: {
    validateData: true,
    optimizeForPrint: true,
    includeMetadata: true,
    customProcessors: [],
    enableAdvancedFormatting: true,
    optimizeImages: true,
    generateThumbnails: true
  } as TransformationOptions
};

// 常用模板分类
export const TemplateCategories = {
  MODERN: 'modern',
  CLASSIC: 'classic', 
  CREATIVE: 'creative',
  MINIMAL: 'minimal',
  PROFESSIONAL: 'professional'
} as const;

// 支持的页面尺寸
export const PageSizes = {
  A4: 'A4',
  LETTER: 'LETTER',
  LEGAL: 'LEGAL'
} as const;

// 支持的布局类型
export const LayoutTypes = {
  SINGLE_COLUMN: 'single-column',
  TWO_COLUMN: 'two-column',
  SIDEBAR: 'sidebar',
  GRID: 'grid'
} as const;

// 数据转换层常量
export const DATA_TRANSFORM_CONSTANTS = {
  // 模板相关
  TEMPLATE_CATEGORIES: TemplateCategories,
  PAGE_SIZES: PageSizes,
  LAYOUT_TYPES: LayoutTypes,
  
  // 默认值
  DEFAULT_FONT_SIZE: 12,
  DEFAULT_LINE_HEIGHT: 1.4,
  DEFAULT_MARGIN: 40,
  DEFAULT_SPACING: 16,
  
  // 限制值
  MAX_SECTION_COUNT: 20,
  MAX_EXPERIENCE_COUNT: 10,
  MAX_EDUCATION_COUNT: 5,
  MAX_SKILL_COUNT: 50,
  MAX_PROJECT_COUNT: 10,
  
  // 文本限制
  MAX_NAME_LENGTH: 50,
  MAX_TITLE_LENGTH: 100,
  MAX_SUMMARY_LENGTH: 500,
  MAX_DESCRIPTION_LENGTH: 1000,
  
  // 验证规则
  VALIDATION_RULES: {
    EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    PHONE_REGEX: /^[\d\s\-\+\(\)]+$/,
    URL_REGEX: /^https?:\/\/.+/
  }
} as const;

// 错误类型
export const TransformErrorTypes = {
  VALIDATION_ERROR: 'validation_error',
  TEMPLATE_NOT_FOUND: 'template_not_found',
  INVALID_DATA: 'invalid_data',
  PROCESSING_ERROR: 'processing_error',
  STYLE_ERROR: 'style_error'
} as const;

// 警告类型
export const TransformWarningTypes = {
  MISSING_OPTIONAL_DATA: 'missing_optional_data',
  FORMATTING_ISSUE: 'formatting_issue',
  PERFORMANCE_WARNING: 'performance_warning',
  COMPATIBILITY_WARNING: 'compatibility_warning'
} as const;

// 数据转换层工厂函数
export const DataTransformFactory = {
  // 创建转换器
  createTransformer: (options?: Partial<TransformationOptions>) => {
    const transformer = new ResumeDataTransformer();
    if (options) {
      // 可以在这里设置默认选项
    }
    return transformer;
  },
  
  // 创建自定义模板
  createTemplate: (
    id: string,
    name: string,
    description: string,
    category: keyof typeof TemplateCategories,
    styleOverrides?: Partial<StyleConfig>
  ) => {
    return createCustomTemplate(id, name, description, category, styleOverrides);
  },
  
  // 创建样式配置
  createStyleConfig: (overrides?: Partial<StyleConfig>): StyleConfig => {
    const defaultStyle = modernTemplate.styleConfig;
    return StyleUtils.mergeStyles(defaultStyle, overrides || {});
  }
};

// 数据转换层钩子（用于扩展功能）
export interface DataTransformHooks {
  beforeTransform?: (data: ResumeData, templateId: string) => ResumeData;
  afterTransform?: (result: StyledResumeData) => StyledResumeData;
  onError?: (error: Error) => void;
  onWarning?: (warning: ValidationWarning) => void;
}

// 插件系统接口
export interface DataTransformPlugin {
  name: string;
  version: string;
  install: (transformer: ResumeDataTransformer) => void;
  uninstall?: (transformer: ResumeDataTransformer) => void;
}

// 数据转换层管理器
export class DataTransformManager {
  private transformer: ResumeDataTransformer;
  private plugins: Map<string, DataTransformPlugin> = new Map();
  private hooks: DataTransformHooks = {};
  
  constructor() {
    this.transformer = new ResumeDataTransformer();
  }
  
  // 注册插件
  registerPlugin(plugin: DataTransformPlugin): void {
    this.plugins.set(plugin.name, plugin);
    plugin.install(this.transformer);
  }
  
  // 卸载插件
  unregisterPlugin(pluginName: string): void {
    const plugin = this.plugins.get(pluginName);
    if (plugin && plugin.uninstall) {
      plugin.uninstall(this.transformer);
    }
    this.plugins.delete(pluginName);
  }
  
  // 设置钩子
  setHooks(hooks: DataTransformHooks): void {
    this.hooks = { ...this.hooks, ...hooks };
  }
  
  // 转换数据（带钩子支持）
  async transform(
    data: ResumeData,
    templateId: string,
    options?: TransformationOptions
  ): Promise<TransformationResult> {
    try {
      // 执行前置钩子
      const processedData = this.hooks.beforeTransform ? 
        this.hooks.beforeTransform(data, templateId) : data;
      
      // 执行转换
      const result = await this.transformer.transform(processedData, templateId, options);
      
      // 执行后置钩子
      if (this.hooks.afterTransform && result.success) {
        result.data = this.hooks.afterTransform(result.data!);
      }
      
      // 处理警告
      if (result.warnings && this.hooks.onWarning) {
        result.warnings.forEach(warning => this.hooks.onWarning!(warning));
      }
      
      return result;
    } catch (error) {
      // 处理错误
      if (this.hooks.onError) {
        this.hooks.onError(error as Error);
      }
      throw error;
    }
  }
  
  // 获取转换器实例
  getTransformer(): ResumeDataTransformer {
    return this.transformer;
  }
  
  // 获取已注册的插件
  getPlugins(): DataTransformPlugin[] {
    return Array.from(this.plugins.values());
  }
}

// 创建管理器实例
export const createDataTransformManager = (): DataTransformManager => {
  return new DataTransformManager();
};

// 默认导出
export default {
  // 核心类
  ResumeDataTransformer,
  DataTransformManager,
  
  // 工厂函数
  createResumeTransformer,
  createDataTransformManager,
  
  // 快速函数
  transformResumeData,
  validateResumeData,
  
  // 模板
  templates: {
    modern: modernTemplate,
    classic: classicTemplate,
    creative: creativeTemplate,
    minimal: minimalTemplate,
    professional: professionalTemplate
  },
  
  // 工具
  utils: DataTransformUtils,
  
  // 常量
  constants: DATA_TRANSFORM_CONSTANTS,
  
  // 预设
  presets: DataTransformPresets,
  
  // 工厂
  factory: DataTransformFactory
};