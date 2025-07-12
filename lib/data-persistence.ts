"use client";

import { ResumeData } from './types';

// 存储键名常量
const STORAGE_KEYS = {
  RESUME_DATA: 'resume_data',
  USER_PREFERENCES: 'user_preferences',
  SAVED_RESUMES: 'saved_resumes',
  DRAFT_RESUME: 'draft_resume',
  HISTORY_STACK: 'history_stack',
  TEMPLATES: 'custom_templates',
  SETTINGS: 'app_settings'
} as const;

// 数据版本管理
const DATA_VERSION = '1.0.0';

interface StorageItem<T> {
  data: T;
  version: string;
  timestamp: number;
  checksum?: string;
}

interface SavedResume {
  id: string;
  name: string;
  data: ResumeData;
  createdAt: string;
  updatedAt: string;
  tags: string[];
  isPublic: boolean;
  thumbnail?: string;
}

interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  language: 'zh' | 'en';
  autoSave: boolean;
  saveInterval: number;
  exportFormat: 'pdf' | 'docx' | 'html';
  templatePreference: string;
}

interface SyncStatus {
  lastSync: string;
  pendingChanges: number;
  isOnline: boolean;
  syncEnabled: boolean;
}

// 数据持久化管理器
export class DataPersistenceManager {
  private static instance: DataPersistenceManager;
  private syncStatus: SyncStatus = {
    lastSync: '',
    pendingChanges: 0,
    isOnline: navigator.onLine,
    syncEnabled: false
  };
  private autoSaveTimer: NodeJS.Timeout | null = null;
  private syncQueue: Array<{ key: string; data: any; timestamp: number }> = [];
  
  private constructor() {
    this.initializeEventListeners();
    this.startAutoSave();
  }
  
  public static getInstance(): DataPersistenceManager {
    if (!DataPersistenceManager.instance) {
      DataPersistenceManager.instance = new DataPersistenceManager();
    }
    return DataPersistenceManager.instance;
  }
  
  // 初始化事件监听器
  private initializeEventListeners(): void {
    // 监听网络状态
    window.addEventListener('online', () => {
      this.syncStatus.isOnline = true;
      this.processSyncQueue();
    });
    
    window.addEventListener('offline', () => {
      this.syncStatus.isOnline = false;
    });
    
    // 监听页面卸载，保存数据
    window.addEventListener('beforeunload', () => {
      this.flushPendingData();
    });
    
    // 监听存储变化（多标签页同步）
    window.addEventListener('storage', (e) => {
      this.handleStorageChange(e);
    });
  }
  
  // 生成校验和
  private generateChecksum(data: any): string {
    const str = JSON.stringify(data);
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // 转换为32位整数
    }
    return hash.toString(16);
  }
  
  // 包装数据
  private wrapData<T>(data: T): StorageItem<T> {
    return {
      data,
      version: DATA_VERSION,
      timestamp: Date.now(),
      checksum: this.generateChecksum(data)
    };
  }
  
  // 验证数据完整性
  private validateData<T>(item: StorageItem<T>): boolean {
    if (!item.checksum) return true; // 向后兼容
    return this.generateChecksum(item.data) === item.checksum;
  }
  
  // 保存到本地存储
  public saveToLocal<T>(key: string, data: T): boolean {
    try {
      const wrappedData = this.wrapData(data);
      const serialized = JSON.stringify(wrappedData);
      
      // 检查存储空间
      if (this.getStorageSize() + serialized.length > this.getStorageQuota()) {
        this.cleanupOldData();
      }
      
      localStorage.setItem(key, serialized);
      
      // 添加到同步队列
      if (this.syncStatus.syncEnabled) {
        this.addToSyncQueue(key, data);
      }
      
      return true;
    } catch (error) {
      console.error('保存到本地存储失败:', error);
      return false;
    }
  }
  
  // 从本地存储读取
  public loadFromLocal<T>(key: string): T | null {
    try {
      const stored = localStorage.getItem(key);
      if (!stored) return null;
      
      const item: StorageItem<T> = JSON.parse(stored);
      
      // 验证数据完整性
      if (!this.validateData(item)) {
        console.warn(`数据校验失败: ${key}`);
        this.removeFromLocal(key);
        return null;
      }
      
      // 检查版本兼容性
      if (item.version !== DATA_VERSION) {
        console.warn(`数据版本不匹配: ${key}`);
        // 这里可以添加数据迁移逻辑
      }
      
      return item.data;
    } catch (error) {
      console.error('从本地存储读取失败:', error);
      return null;
    }
  }
  
  // 删除本地存储
  public removeFromLocal(key: string): boolean {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error('删除本地存储失败:', error);
      return false;
    }
  }
  
  // 保存简历数据
  public saveResumeData(data: ResumeData): boolean {
    return this.saveToLocal(STORAGE_KEYS.RESUME_DATA, data);
  }
  
  // 加载简历数据
  public loadResumeData(): ResumeData | null {
    return this.loadFromLocal<ResumeData>(STORAGE_KEYS.RESUME_DATA);
  }
  
  // 保存草稿
  public saveDraft(data: ResumeData): boolean {
    return this.saveToLocal(STORAGE_KEYS.DRAFT_RESUME, data);
  }
  
  // 加载草稿
  public loadDraft(): ResumeData | null {
    return this.loadFromLocal<ResumeData>(STORAGE_KEYS.DRAFT_RESUME);
  }
  
  // 保存用户偏好
  public saveUserPreferences(preferences: UserPreferences): boolean {
    return this.saveToLocal(STORAGE_KEYS.USER_PREFERENCES, preferences);
  }
  
  // 加载用户偏好
  public loadUserPreferences(): UserPreferences | null {
    return this.loadFromLocal<UserPreferences>(STORAGE_KEYS.USER_PREFERENCES);
  }
  
  // 保存简历列表
  public saveSavedResumes(resumes: SavedResume[]): boolean {
    return this.saveToLocal(STORAGE_KEYS.SAVED_RESUMES, resumes);
  }
  
  // 加载简历列表
  public loadSavedResumes(): SavedResume[] {
    return this.loadFromLocal<SavedResume[]>(STORAGE_KEYS.SAVED_RESUMES) || [];
  }
  
  // 添加保存的简历
  public addSavedResume(resume: Omit<SavedResume, 'id' | 'createdAt' | 'updatedAt'>): string {
    const resumes = this.loadSavedResumes();
    const id = this.generateId();
    const now = new Date().toISOString();
    
    const newResume: SavedResume = {
      ...resume,
      id,
      createdAt: now,
      updatedAt: now
    };
    
    resumes.push(newResume);
    this.saveSavedResumes(resumes);
    
    return id;
  }
  
  // 更新保存的简历
  public updateSavedResume(id: string, updates: Partial<SavedResume>): boolean {
    const resumes = this.loadSavedResumes();
    const index = resumes.findIndex(r => r.id === id);
    
    if (index === -1) return false;
    
    resumes[index] = {
      ...resumes[index],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    
    return this.saveSavedResumes(resumes);
  }
  
  // 删除保存的简历
  public deleteSavedResume(id: string): boolean {
    const resumes = this.loadSavedResumes();
    const filtered = resumes.filter(r => r.id !== id);
    
    if (filtered.length === resumes.length) return false;
    
    return this.saveSavedResumes(filtered);
  }
  
  // 导出数据
  public exportData(): string {
    const data = {
      resumeData: this.loadResumeData(),
      savedResumes: this.loadSavedResumes(),
      userPreferences: this.loadUserPreferences(),
      exportedAt: new Date().toISOString(),
      version: DATA_VERSION
    };
    
    return JSON.stringify(data, null, 2);
  }
  
  // 导入数据
  public importData(jsonData: string): boolean {
    try {
      // 验证输入参数
      if (!jsonData || typeof jsonData !== 'string') {
        throw new Error('导入数据为空或格式错误');
      }
      
      if (jsonData.trim().length === 0) {
        throw new Error('导入数据内容为空');
      }
      
      let data: any;
      try {
        data = JSON.parse(jsonData);
      } catch (parseError) {
        throw new Error('JSON格式错误，请检查文件内容');
      }
      
      // 验证数据格式
      if (!data || typeof data !== 'object') {
        throw new Error('导入数据格式无效');
      }
      
      if (!data.version || !data.exportedAt) {
        throw new Error('缺少必要的版本信息或导出时间');
      }
      
      // 检查版本兼容性
      if (data.version !== DATA_VERSION) {
        console.warn(`数据版本不匹配: 当前版本 ${DATA_VERSION}, 导入版本 ${data.version}`);
      }
      
      // 验证导出时间
      const exportDate = new Date(data.exportedAt);
      if (isNaN(exportDate.getTime())) {
        throw new Error('导出时间格式无效');
      }
      
      // 备份当前数据
      const backupKey = this.createBackup();
      if (!backupKey) {
        console.warn('创建备份失败，但继续导入数据');
      }
      
      let importedCount = 0;
      
      // 导入简历数据
      if (data.resumeData) {
        try {
          this.saveResumeData(data.resumeData);
          importedCount++;
        } catch (error) {
          console.error('导入简历数据失败:', error);
          throw new Error('简历数据导入失败');
        }
      }
      
      // 导入保存的简历
      if (data.savedResumes) {
        try {
          if (Array.isArray(data.savedResumes)) {
            this.saveSavedResumes(data.savedResumes);
            importedCount++;
          } else {
            console.warn('保存的简历数据格式错误，跳过导入');
          }
        } catch (error) {
          console.error('导入保存的简历失败:', error);
          throw new Error('保存的简历导入失败');
        }
      }
      
      // 导入用户偏好
      if (data.userPreferences) {
        try {
          this.saveUserPreferences(data.userPreferences);
          importedCount++;
        } catch (error) {
          console.error('导入用户偏好失败:', error);
          throw new Error('用户偏好导入失败');
        }
      }
      
      if (importedCount === 0) {
        throw new Error('没有找到可导入的有效数据');
      }
      
      console.log(`成功导入 ${importedCount} 项数据`);
      return true;
    } catch (error) {
      console.error('导入数据失败:', error);
      
      // 如果是存储空间不足的错误，提供更具体的信息
      if (error instanceof Error && error.message.includes('QuotaExceededError')) {
        console.error('存储空间不足，无法导入数据');
      }
      
      return false;
    }
  }
  
  // 创建备份
  public createBackup(): string {
    try {
      const backupData = this.exportData();
      
      if (!backupData || backupData.trim().length === 0) {
        throw new Error('导出数据为空，无法创建备份');
      }
      
      const backupKey = `backup_${Date.now()}`;
      
      // 检查存储空间
      const storageUsage = this.getStorageUsage();
      if (storageUsage.percentage > 90) {
        console.warn('存储空间不足，尝试清理旧数据');
        this.cleanupOldData();
        this.cleanupOldBackups();
      }
      
      try {
        localStorage.setItem(backupKey, backupData);
      } catch (storageError) {
        if (storageError instanceof Error && storageError.name === 'QuotaExceededError') {
          // 存储空间不足，尝试清理后重试
          this.cleanupOldBackups();
          this.cleanupOldData();
          
          try {
            localStorage.setItem(backupKey, backupData);
          } catch (retryError) {
            throw new Error('存储空间不足，无法创建备份');
          }
        } else {
          throw storageError;
        }
      }
      
      // 清理旧备份（保留最近5个）
      this.cleanupOldBackups();
      
      console.log(`备份创建成功: ${backupKey}`);
      return backupKey;
    } catch (error) {
      console.error('创建备份失败:', error);
      return '';
    }
  }
  
  // 恢复备份
  public restoreBackup(backupKey: string): boolean {
    try {
      // 验证备份键
      if (!backupKey || typeof backupKey !== 'string') {
        throw new Error('备份键无效');
      }
      
      if (!backupKey.startsWith('backup_')) {
        throw new Error('备份键格式错误');
      }
      
      const backupData = localStorage.getItem(backupKey);
      if (!backupData) {
        throw new Error('备份数据不存在或已损坏');
      }
      
      if (backupData.trim().length === 0) {
        throw new Error('备份数据为空');
      }
      
      // 验证备份数据格式
      try {
        const parsedData = JSON.parse(backupData);
        if (!parsedData.version || !parsedData.exportedAt) {
          throw new Error('备份数据格式无效');
        }
      } catch (parseError) {
        throw new Error('备份数据格式错误，无法解析');
      }
      
      console.log(`开始恢复备份: ${backupKey}`);
      const result = this.importData(backupData);
      
      if (result) {
        console.log(`备份恢复成功: ${backupKey}`);
      } else {
        throw new Error('备份数据导入失败');
      }
      
      return result;
    } catch (error) {
      console.error('恢复备份失败:', error);
      return false;
    }
  }
  
  // 获取备份列表
  public getBackupList(): Array<{ key: string; date: string; size: number }> {
    const backups: Array<{ key: string; date: string; size: number }> = [];
    
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('backup_')) {
        const timestamp = parseInt(key.replace('backup_', ''));
        const data = localStorage.getItem(key);
        
        backups.push({
          key,
          date: new Date(timestamp).toISOString(),
          size: data ? data.length : 0
        });
      }
    }
    
    return backups.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }
  
  // 清理旧备份
  private cleanupOldBackups(): void {
    const backups = this.getBackupList();
    
    // 保留最近5个备份
    if (backups.length > 5) {
      const toDelete = backups.slice(5);
      toDelete.forEach(backup => {
        localStorage.removeItem(backup.key);
      });
    }
  }
  
  // 清理旧数据
  private cleanupOldData(): void {
    // 清理过期的草稿和临时数据
    const cutoffTime = Date.now() - (7 * 24 * 60 * 60 * 1000); // 7天前
    
    for (let i = localStorage.length - 1; i >= 0; i--) {
      const key = localStorage.key(i);
      if (!key) continue;
      
      try {
        const data = localStorage.getItem(key);
        if (!data) continue;
        
        const item = JSON.parse(data);
        if (item.timestamp && item.timestamp < cutoffTime) {
          // 不删除重要数据
          if (!Object.values(STORAGE_KEYS).includes(key as any)) {
            localStorage.removeItem(key);
          }
        }
      } catch (error) {
        // 删除无效数据
        localStorage.removeItem(key);
      }
    }
  }
  
  // 获取存储使用情况
  public getStorageUsage(): { used: number; total: number; percentage: number } {
    const used = this.getStorageSize();
    const total = this.getStorageQuota();
    
    return {
      used,
      total,
      percentage: Math.round((used / total) * 100)
    };
  }
  
  // 获取存储大小
  private getStorageSize(): number {
    let total = 0;
    
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key) {
        const data = localStorage.getItem(key);
        if (data) {
          total += data.length;
        }
      }
    }
    
    return total;
  }
  
  // 获取存储配额
  private getStorageQuota(): number {
    // 大多数浏览器的localStorage限制为5-10MB
    return 5 * 1024 * 1024; // 5MB
  }
  
  // 启动自动保存
  private startAutoSave(): void {
    const preferences = this.loadUserPreferences();
    const interval = preferences?.saveInterval || 30000; // 默认30秒
    
    if (this.autoSaveTimer) {
      clearInterval(this.autoSaveTimer);
    }
    
    this.autoSaveTimer = setInterval(() => {
      this.flushPendingData();
    }, interval);
  }
  
  // 刷新待处理数据
  private flushPendingData(): void {
    // 这里可以实现批量保存逻辑
    if (this.syncStatus.pendingChanges > 0) {
      this.processSyncQueue();
    }
  }
  
  // 添加到同步队列
  private addToSyncQueue(key: string, data: any): void {
    this.syncQueue.push({
      key,
      data,
      timestamp: Date.now()
    });
    
    this.syncStatus.pendingChanges++;
  }
  
  // 处理同步队列
  private async processSyncQueue(): Promise<void> {
    if (!this.syncStatus.isOnline || !this.syncStatus.syncEnabled) {
      return;
    }
    
    while (this.syncQueue.length > 0) {
      const item = this.syncQueue.shift();
      if (item) {
        try {
          // 这里实现云端同步逻辑
          await this.syncToCloud(item.key, item.data);
          this.syncStatus.pendingChanges--;
        } catch (error) {
          console.error('同步失败:', error);
          // 重新加入队列
          this.syncQueue.unshift(item);
          break;
        }
      }
    }
    
    if (this.syncQueue.length === 0) {
      this.syncStatus.lastSync = new Date().toISOString();
    }
  }
  
  // 同步到云端（模拟）
  private async syncToCloud(key: string, data: any): Promise<void> {
    // 这里实现实际的云端同步逻辑
    // 例如：调用API上传数据
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // 模拟网络请求
        if (Math.random() > 0.1) { // 90%成功率
          resolve();
        } else {
          reject(new Error('网络错误'));
        }
      }, 1000);
    });
  }
  
  // 处理存储变化
  private handleStorageChange(event: StorageEvent): void {
    if (event.key && Object.values(STORAGE_KEYS).includes(event.key as any)) {
      // 通知应用数据已更新
      window.dispatchEvent(new CustomEvent('dataUpdated', {
        detail: {
          key: event.key,
          oldValue: event.oldValue,
          newValue: event.newValue
        }
      }));
    }
  }
  
  // 生成唯一ID
  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }
  
  // 获取同步状态
  public getSyncStatus(): SyncStatus {
    return { ...this.syncStatus };
  }
  
  // 启用/禁用同步
  public setSyncEnabled(enabled: boolean): void {
    this.syncStatus.syncEnabled = enabled;
    
    if (enabled && this.syncStatus.isOnline) {
      this.processSyncQueue();
    }
  }
  
  // 清除所有数据
  public clearAllData(): boolean {
    try {
      Object.values(STORAGE_KEYS).forEach(key => {
        localStorage.removeItem(key);
      });
      
      // 清除备份
      this.getBackupList().forEach(backup => {
        localStorage.removeItem(backup.key);
      });
      
      return true;
    } catch (error) {
      console.error('清除数据失败:', error);
      return false;
    }
  }
  
  // 销毁实例
  public destroy(): void {
    if (this.autoSaveTimer) {
      clearInterval(this.autoSaveTimer);
      this.autoSaveTimer = null;
    }
    
    this.flushPendingData();
  }
}

// 导出单例实例
export const dataPersistence = DataPersistenceManager.getInstance();

// 导出类型
export type { SavedResume, UserPreferences, SyncStatus };