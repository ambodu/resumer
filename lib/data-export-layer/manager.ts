// 数据导出层管理器和队列系统

import {
  ExportOptions,
  ExportResult,
  ExportTask,
  ExportQueue,
  ExportManagerConfig,
  PDFGenerator
} from './types';
import { StyledResumeData } from '../data-transform-layer/types';
import { ResumePDFGenerator } from './core';

// 导出任务实现
class ExportTaskImpl implements ExportTask {
  id: string;
  data: StyledResumeData;
  options: ExportOptions;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  progress: number;
  startTime?: number;
  endTime?: number;
  result?: ExportResult;
  error?: Error;
  
  constructor(id: string, data: StyledResumeData, options: ExportOptions) {
    this.id = id;
    this.data = data;
    this.options = options;
    this.status = 'pending';
    this.progress = 0;
  }
  
  updateProgress(progress: number): void {
    this.progress = Math.max(0, Math.min(100, progress));
    if (this.options.onProgress) {
      this.options.onProgress(this.progress);
    }
  }
  
  markAsStarted(): void {
    this.status = 'processing';
    this.startTime = Date.now();
    this.updateProgress(0);
  }
  
  markAsCompleted(result: ExportResult): void {
    this.status = 'completed';
    this.endTime = Date.now();
    this.result = result;
    this.updateProgress(100);
    
    if (this.options.onComplete) {
      this.options.onComplete(result);
    }
  }
  
  markAsFailed(error: Error): void {
    this.status = 'failed';
    this.endTime = Date.now();
    this.error = error;
    
    if (this.options.onError) {
      this.options.onError(error);
    }
  }
}

// 导出队列实现
export class ExportQueueImpl implements ExportQueue {
  private tasks: Map<string, ExportTaskImpl> = new Map();
  private processingTasks: Set<string> = new Set();
  private maxConcurrent: number;
  private generator: PDFGenerator;
  
  constructor(maxConcurrent: number = 3, generator?: PDFGenerator) {
    this.maxConcurrent = maxConcurrent;
    this.generator = generator || new ResumePDFGenerator();
  }
  
  async addTask(data: StyledResumeData, options: ExportOptions): Promise<string> {
    const taskId = this.generateTaskId();
    const task = new ExportTaskImpl(taskId, data, options);
    
    this.tasks.set(taskId, task);
    
    // 尝试立即处理任务
    this.processNextTask();
    
    return taskId;
  }
  
  getTaskStatus(taskId: string): ExportTask | null {
    const task = this.tasks.get(taskId);
    return task ? { ...task } : null;
  }
  
  cancelTask(taskId: string): boolean {
    const task = this.tasks.get(taskId);
    if (!task) return false;
    
    if (task.status === 'pending') {
      task.status = 'failed';
      task.error = new Error('Task cancelled');
      return true;
    }
    
    return false;
  }
  
  clearQueue(): void {
    // 只清除未开始的任务
    for (const [taskId, task] of this.tasks.entries()) {
      if (task.status === 'pending') {
        this.tasks.delete(taskId);
      }
    }
  }
  
  getQueueStatus(): { pending: number; processing: number; completed: number; failed: number } {
    const status = { pending: 0, processing: 0, completed: 0, failed: 0 };
    
    for (const task of this.tasks.values()) {
      status[task.status]++;
    }
    
    return status;
  }
  
  private async processNextTask(): Promise<void> {
    // 检查是否可以处理更多任务
    if (this.processingTasks.size >= this.maxConcurrent) {
      return;
    }
    
    // 找到下一个待处理的任务
    const nextTask = Array.from(this.tasks.values())
      .find(task => task.status === 'pending');
    
    if (!nextTask) return;
    
    // 开始处理任务
    this.processingTasks.add(nextTask.id);
    nextTask.markAsStarted();
    
    try {
      // 模拟进度更新
      nextTask.updateProgress(10);
      
      // 生成 PDF
      const result = await this.generator.generatePDF(nextTask.data, nextTask.options);
      
      nextTask.updateProgress(90);
      
      // 标记完成
      nextTask.markAsCompleted(result);
    } catch (error) {
      nextTask.markAsFailed(error as Error);
    } finally {
      this.processingTasks.delete(nextTask.id);
      
      // 处理下一个任务
      setTimeout(() => this.processNextTask(), 0);
    }
  }
  
  private generateTaskId(): string {
    return `task_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}

// 导出管理器实现
export class ExportManager {
  private config: ExportManagerConfig;
  private generator: PDFGenerator;
  private queue: ExportQueue;
  private cache: Map<string, ExportResult> = new Map();
  private cacheTimestamps: Map<string, number> = new Map();
  
  constructor(config?: Partial<ExportManagerConfig>) {
    this.config = {
      defaultOptions: {
        format: 'pdf',
        pageSize: 'A4',
        pageOrientation: 'portrait',
        compress: true,
        optimizeForPrint: true
      },
      enableCache: true,
      cacheSize: 100,
      cacheTTL: 5 * 60 * 1000, // 5分钟
      maxConcurrentExports: 3,
      timeoutMs: 30000, // 30秒
      retryAttempts: 3,
      retryDelay: 1000,
      enableLogging: true,
      logLevel: 'info',
      ...config
    };
    
    this.generator = new ResumePDFGenerator();
    this.queue = new ExportQueueImpl(this.config.maxConcurrentExports, this.generator);
    
    // 启动缓存清理定时器
    if (this.config.enableCache) {
      this.startCacheCleanup();
    }
  }
  
  // 导出 PDF（同步）
  async exportPDF(data: StyledResumeData, options?: Partial<ExportOptions>): Promise<ExportResult> {
    const mergedOptions = { ...this.config.defaultOptions, ...options } as ExportOptions;
    
    // 检查缓存
    if (this.config.enableCache) {
      const cacheKey = this.generateCacheKey(data, mergedOptions);
      const cachedResult = this.getCachedResult(cacheKey);
      if (cachedResult) {
        this.log('info', `Cache hit for export: ${cacheKey}`);
        return cachedResult;
      }
    }
    
    // 执行导出
    const result = await this.executeExportWithRetry(data, mergedOptions);
    
    // 缓存结果
    if (this.config.enableCache && result.success) {
      const cacheKey = this.generateCacheKey(data, mergedOptions);
      this.setCachedResult(cacheKey, result);
    }
    
    return result;
  }
  
  // 导出 PDF（异步队列）
  async exportPDFAsync(data: StyledResumeData, options?: Partial<ExportOptions>): Promise<string> {
    const mergedOptions = { ...this.config.defaultOptions, ...options } as ExportOptions;
    return this.queue.addTask(data, mergedOptions);
  }
  
  // 获取任务状态
  getTaskStatus(taskId: string): ExportTask | null {
    return this.queue.getTaskStatus(taskId);
  }
  
  // 取消任务
  cancelTask(taskId: string): boolean {
    return this.queue.cancelTask(taskId);
  }
  
  // 获取队列状态
  getQueueStatus() {
    return this.queue.getQueueStatus();
  }
  
  // 清空队列
  clearQueue(): void {
    this.queue.clearQueue();
  }
  
  // 清空缓存
  clearCache(): void {
    this.cache.clear();
    this.cacheTimestamps.clear();
    this.log('info', 'Cache cleared');
  }
  
  // 获取缓存统计
  getCacheStats() {
    return {
      size: this.cache.size,
      maxSize: this.config.cacheSize!,
      hitRate: 0, // 可以实现命中率统计
      ttl: this.config.cacheTTL!
    };
  }
  
  // 更新配置
  updateConfig(config: Partial<ExportManagerConfig>): void {
    this.config = { ...this.config, ...config };
    this.log('info', 'Configuration updated');
  }
  
  // 获取当前配置
  getConfig(): ExportManagerConfig {
    return { ...this.config };
  }
  
  // 验证数据
  validateData(data: StyledResumeData): { isValid: boolean; errors: any[]; warnings: any[] } {
    return this.generator.validateData(data);
  }
  
  // 获取支持的选项
  getSupportedOptions(): Partial<ExportOptions> {
    return this.generator.getSupportedOptions();
  }
  
  // 私有方法：执行导出（带重试）
  private async executeExportWithRetry(data: StyledResumeData, options: ExportOptions): Promise<ExportResult> {
    let lastError: Error | null = null;
    
    for (let attempt = 1; attempt <= this.config.retryAttempts!; attempt++) {
      try {
        this.log('debug', `Export attempt ${attempt}/${this.config.retryAttempts}`);
        
        // 设置超时
        const timeoutPromise = new Promise<never>((_, reject) => {
          setTimeout(() => reject(new Error('Export timeout')), this.config.timeoutMs);
        });
        
        const exportPromise = this.generator.generatePDF(data, options);
        
        const result = await Promise.race([exportPromise, timeoutPromise]);
        
        if (result.success) {
          this.log('info', `Export completed successfully on attempt ${attempt}`);
          return result;
        } else {
          throw new Error(result.errors?.[0]?.message || 'Export failed');
        }
      } catch (error) {
        lastError = error as Error;
        this.log('warn', `Export attempt ${attempt} failed: ${lastError.message}`);
        
        if (attempt < this.config.retryAttempts!) {
          await this.delay(this.config.retryDelay! * attempt);
        }
      }
    }
    
    this.log('error', `Export failed after ${this.config.retryAttempts} attempts`);
    
    return {
      success: false,
      errors: [{
        code: 'EXPORT_FAILED',
        message: lastError?.message || 'Export failed after multiple attempts',
        type: 'processing',
        stack: lastError?.stack
      }]
    };
  }
  
  // 私有方法：生成缓存键
  private generateCacheKey(data: StyledResumeData, options: ExportOptions): string {
    const dataHash = this.hashObject({
      personalInfo: data.personalInfo,
      experience: data.experience,
      education: data.education,
      skills: data.skills,
      projects: data.projects
    });
    
    const optionsHash = this.hashObject({
      format: options.format,
      pageSize: options.pageSize,
      pageOrientation: options.pageOrientation,
      compress: options.compress
    });
    
    return `${dataHash}_${optionsHash}`;
  }
  
  // 私有方法：获取缓存结果
  private getCachedResult(key: string): ExportResult | null {
    const result = this.cache.get(key);
    const timestamp = this.cacheTimestamps.get(key);
    
    if (!result || !timestamp) return null;
    
    // 检查是否过期
    if (Date.now() - timestamp > this.config.cacheTTL!) {
      this.cache.delete(key);
      this.cacheTimestamps.delete(key);
      return null;
    }
    
    return result;
  }
  
  // 私有方法：设置缓存结果
  private setCachedResult(key: string, result: ExportResult): void {
    // 检查缓存大小限制
    if (this.cache.size >= this.config.cacheSize!) {
      // 删除最旧的缓存项
      const oldestKey = Array.from(this.cacheTimestamps.entries())
        .sort((a, b) => a[1] - b[1])[0]?.[0];
      
      if (oldestKey) {
        this.cache.delete(oldestKey);
        this.cacheTimestamps.delete(oldestKey);
      }
    }
    
    this.cache.set(key, result);
    this.cacheTimestamps.set(key, Date.now());
  }
  
  // 私有方法：启动缓存清理
  private startCacheCleanup(): void {
    setInterval(() => {
      const now = Date.now();
      const expiredKeys: string[] = [];
      
      for (const [key, timestamp] of this.cacheTimestamps.entries()) {
        if (now - timestamp > this.config.cacheTTL!) {
          expiredKeys.push(key);
        }
      }
      
      expiredKeys.forEach(key => {
        this.cache.delete(key);
        this.cacheTimestamps.delete(key);
      });
      
      if (expiredKeys.length > 0) {
        this.log('debug', `Cleaned up ${expiredKeys.length} expired cache entries`);
      }
    }, this.config.cacheTTL! / 2); // 每半个TTL时间清理一次
  }
  
  // 私有方法：简单哈希函数
  private hashObject(obj: any): string {
    const str = JSON.stringify(obj, Object.keys(obj).sort());
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // 转换为32位整数
    }
    return hash.toString(36);
  }
  
  // 私有方法：延迟函数
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  
  // 私有方法：日志记录
  private log(level: 'debug' | 'info' | 'warn' | 'error', message: string): void {
    if (!this.config.enableLogging) return;
    
    const levels = { debug: 0, info: 1, warn: 2, error: 3 };
    const configLevel = levels[this.config.logLevel!];
    const messageLevel = levels[level];
    
    if (messageLevel >= configLevel) {
      const timestamp = new Date().toISOString();
      console[level](`[${timestamp}] [ExportManager] ${message}`);
    }
  }
}

// 导出管理器工厂
export class ExportManagerFactory {
  private static instance: ExportManager | null = null;
  
  // 创建新的管理器实例
  static create(config?: Partial<ExportManagerConfig>): ExportManager {
    return new ExportManager(config);
  }
  
  // 获取单例实例
  static getInstance(config?: Partial<ExportManagerConfig>): ExportManager {
    if (!this.instance) {
      this.instance = new ExportManager(config);
    }
    return this.instance;
  }
  
  // 重置单例实例
  static resetInstance(): void {
    this.instance = null;
  }
}

// 便捷函数
export const createExportManager = (config?: Partial<ExportManagerConfig>): ExportManager => {
  return ExportManagerFactory.create(config);
};

export const getExportManager = (config?: Partial<ExportManagerConfig>): ExportManager => {
  return ExportManagerFactory.getInstance(config);
};

// 快速导出函数
export const quickExportPDF = async (
  data: StyledResumeData,
  options?: Partial<ExportOptions>
): Promise<ExportResult> => {
  const manager = getExportManager();
  return manager.exportPDF(data, options);
};

export const quickExportPDFAsync = async (
  data: StyledResumeData,
  options?: Partial<ExportOptions>
): Promise<string> => {
  const manager = getExportManager();
  return manager.exportPDFAsync(data, options);
};