// 数据导出层主导出文件

// 类型定义导出
export type {
  // PDFMake 相关类型
  PDFMakeMargins,
  PDFMakePageSize,
  PDFMakeStyle,
  PDFMakeColumn,
  PDFMakeTableCell,
  PDFMakeTable,
  PDFMakeCanvas,
  PDFMakeImage,
  PDFMakeText,
  PDFMakeInlineStyle,
  PDFMakeStack,
  PDFMakeColumns,
  PDFMakeOrderedList,
  PDFMakeUnorderedList,
  PDFMakeContent,
  PDFMakeDocumentDefinition,
  
  // 导出相关类型
  ExportOptions,
  ExportResult,
  ExportError,
  ExportWarning,
  PDFGenerator,
  DataConverter,
  StyleConverter,
  PDFRenderer,
  ExportManagerConfig,
  ExportTask,
  ExportQueue
} from './types';

// 核心功能导出
export {
  ResumeStyleConverter,
  ResumeDataConverter,
  ResumePDFRenderer,
  ResumePDFGenerator
} from './core';

// 管理器和队列导出
export {
  ExportQueueImpl,
  ExportManager,
  ExportManagerFactory,
  createExportManager,
  getExportManager,
  quickExportPDF,
  quickExportPDFAsync
} from './manager';

// 工具函数导出
export {
  PDFStyleUtils,
  PDFContentUtils,
  PDFLayoutUtils,
  PDFValidationUtils,
  PDFUtils
} from './utils';

// 便捷导出函数
import { StyledResumeData } from '../data-transform-layer/types';
import { ExportOptions, ExportResult } from './types';
import { getExportManager } from './manager';

/**
 * 快速导出 PDF（同步）
 * @param data 样式化的简历数据
 * @param options 导出选项
 * @returns 导出结果
 */
export const exportToPDF = async (
  data: StyledResumeData,
  options?: Partial<ExportOptions>
): Promise<ExportResult> => {
  const manager = getExportManager();
  return manager.exportPDF(data, options);
};

/**
 * 快速导出 PDF（异步队列）
 * @param data 样式化的简历数据
 * @param options 导出选项
 * @returns 任务ID
 */
export const exportToPDFAsync = async (
  data: StyledResumeData,
  options?: Partial<ExportOptions>
): Promise<string> => {
  const manager = getExportManager();
  return manager.exportPDFAsync(data, options);
};

/**
 * 获取任务状态
 * @param taskId 任务ID
 * @returns 任务状态
 */
export const getTaskStatus = (taskId: string) => {
  const manager = getExportManager();
  return manager.getTaskStatus(taskId);
};

/**
 * 取消任务
 * @param taskId 任务ID
 * @returns 是否成功取消
 */
export const cancelTask = (taskId: string): boolean => {
  const manager = getExportManager();
  return manager.cancelTask(taskId);
};

/**
 * 获取队列状态
 * @returns 队列状态统计
 */
export const getQueueStatus = () => {
  const manager = getExportManager();
  return manager.getQueueStatus();
};

/**
 * 清空导出队列
 */
export const clearQueue = (): void => {
  const manager = getExportManager();
  manager.clearQueue();
};

/**
 * 清空导出缓存
 */
export const clearCache = (): void => {
  const manager = getExportManager();
  manager.clearCache();
};

/**
 * 验证简历数据
 * @param data 简历数据
 * @returns 验证结果
 */
export const validateResumeData = (data: StyledResumeData) => {
  const manager = getExportManager();
  return manager.validateData(data);
};

/**
 * 获取支持的导出选项
 * @returns 支持的选项
 */
export const getSupportedOptions = () => {
  const manager = getExportManager();
  return manager.getSupportedOptions();
};

// 预设配置
export const ExportPresets = {
  // 默认配置
  default: {
    format: 'pdf' as const,
    pageSize: 'A4' as const,
    pageOrientation: 'portrait' as const,
    compress: true,
    optimizeForPrint: true
  },
  
  // 高质量打印
  highQuality: {
    format: 'pdf' as const,
    pageSize: 'A4' as const,
    pageOrientation: 'portrait' as const,
    compress: false,
    optimizeForPrint: true,
    quality: 'high' as const
  },
  
  // 快速预览
  quickPreview: {
    format: 'pdf' as const,
    pageSize: 'A4' as const,
    pageOrientation: 'portrait' as const,
    compress: true,
    optimizeForPrint: false,
    quality: 'medium' as const
  },
  
  // 移动端优化
  mobile: {
    format: 'pdf' as const,
    pageSize: 'A5' as const,
    pageOrientation: 'portrait' as const,
    compress: true,
    optimizeForPrint: false,
    quality: 'medium' as const
  },
  
  // 横向布局
  landscape: {
    format: 'pdf' as const,
    pageSize: 'A4' as const,
    pageOrientation: 'landscape' as const,
    compress: true,
    optimizeForPrint: true
  }
};

// 常量定义
export const DATA_EXPORT_CONSTANTS = {
  // 支持的格式
  FORMATS: {
    PDF: 'pdf'
  } as const,
  
  // 支持的页面大小
  PAGE_SIZES: {
    A4: 'A4',
    A3: 'A3',
    A5: 'A5',
    LETTER: 'LETTER',
    LEGAL: 'LEGAL'
  } as const,
  
  // 支持的方向
  ORIENTATIONS: {
    PORTRAIT: 'portrait',
    LANDSCAPE: 'landscape'
  } as const,
  
  // 质量级别
  QUALITY_LEVELS: {
    LOW: 'low',
    MEDIUM: 'medium',
    HIGH: 'high'
  } as const,
  
  // 默认边距
  DEFAULT_MARGINS: [40, 60, 40, 60] as const,
  
  // 最大文件大小（字节）
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
  
  // 超时时间（毫秒）
  DEFAULT_TIMEOUT: 30000, // 30秒
  
  // 重试次数
  DEFAULT_RETRY_ATTEMPTS: 3,
  
  // 缓存TTL（毫秒）
  DEFAULT_CACHE_TTL: 5 * 60 * 1000, // 5分钟
  
  // 最大并发导出数
  MAX_CONCURRENT_EXPORTS: 5
};

// 错误代码
export const EXPORT_ERROR_CODES = {
  // 数据错误
  INVALID_DATA: 'INVALID_DATA',
  MISSING_REQUIRED_FIELD: 'MISSING_REQUIRED_FIELD',
  DATA_VALIDATION_FAILED: 'DATA_VALIDATION_FAILED',
  
  // 配置错误
  INVALID_OPTIONS: 'INVALID_OPTIONS',
  UNSUPPORTED_FORMAT: 'UNSUPPORTED_FORMAT',
  UNSUPPORTED_PAGE_SIZE: 'UNSUPPORTED_PAGE_SIZE',
  
  // 处理错误
  CONVERSION_FAILED: 'CONVERSION_FAILED',
  RENDERING_FAILED: 'RENDERING_FAILED',
  EXPORT_FAILED: 'EXPORT_FAILED',
  
  // 系统错误
  TIMEOUT: 'TIMEOUT',
  MEMORY_LIMIT_EXCEEDED: 'MEMORY_LIMIT_EXCEEDED',
  FILE_SIZE_EXCEEDED: 'FILE_SIZE_EXCEEDED',
  
  // 队列错误
  QUEUE_FULL: 'QUEUE_FULL',
  TASK_NOT_FOUND: 'TASK_NOT_FOUND',
  TASK_CANCELLED: 'TASK_CANCELLED'
} as const;

// 工具函数集合
export const DataExportUtils = {
  // 创建默认选项
  createDefaultOptions: (overrides?: Partial<ExportOptions>): ExportOptions => ({
    ...ExportPresets.default,
    ...overrides
  }),
  
  // 验证选项
  validateOptions: (options: Partial<ExportOptions>): { isValid: boolean; errors: string[] } => {
    const errors: string[] = [];
    
    if (options.format && !Object.values(DATA_EXPORT_CONSTANTS.FORMATS).includes(options.format as any)) {
      errors.push(`Unsupported format: ${options.format}`);
    }
    
    if (options.pageSize && !Object.values(DATA_EXPORT_CONSTANTS.PAGE_SIZES).includes(options.pageSize as any)) {
      errors.push(`Unsupported page size: ${options.pageSize}`);
    }
    
    if (options.pageOrientation && !Object.values(DATA_EXPORT_CONSTANTS.ORIENTATIONS).includes(options.pageOrientation as any)) {
      errors.push(`Unsupported orientation: ${options.pageOrientation}`);
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  },
  
  // 估算文件大小
  estimateFileSize: (data: StyledResumeData): number => {
    // 简单的文件大小估算
    const textLength = JSON.stringify(data).length;
    return Math.round(textLength * 0.5); // 估算压缩后大小
  },
  
  // 检查是否支持格式
  isFormatSupported: (format: string): boolean => {
    return Object.values(DATA_EXPORT_CONSTANTS.FORMATS).includes(format as any);
  },
  
  // 检查是否支持页面大小
  isPageSizeSupported: (pageSize: string): boolean => {
    return Object.values(DATA_EXPORT_CONSTANTS.PAGE_SIZES).includes(pageSize as any);
  },
  
  // 获取推荐配置
  getRecommendedConfig: (dataSize: 'small' | 'medium' | 'large'): Partial<ExportOptions> => {
    switch (dataSize) {
      case 'small':
        return ExportPresets.quickPreview;
      case 'medium':
        return ExportPresets.default;
      case 'large':
        return ExportPresets.highQuality;
      default:
        return ExportPresets.default;
    }
  }
};

// 默认导出
export default {
  // 核心功能
  exportToPDF,
  exportToPDFAsync,
  getTaskStatus,
  cancelTask,
  getQueueStatus,
  clearQueue,
  clearCache,
  validateResumeData,
  getSupportedOptions,
  
  // 管理器
  createExportManager,
  getExportManager,
  
  // 预设和常量
  ExportPresets,
  DATA_EXPORT_CONSTANTS,
  EXPORT_ERROR_CODES,
  
  // 工具
  DataExportUtils,
  PDFUtils
};