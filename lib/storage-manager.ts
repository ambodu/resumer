"use client";

import { ResumeData } from './types';

// 存储键名常量
export const STORAGE_KEYS = {
  CURRENT_RESUME: 'current_resume',
  SAVED_RESUMES: 'saved_resumes',
  TEMPLATE_SELECTION: 'template_selection',
  USER_PREFERENCES: 'user_preferences',
  DRAFT_DATA: 'draft_data',
  APP_STATE: 'app_state'
} as const;

// 数据版本管理
const DATA_VERSION = '2.0.0';

interface StorageItem<T> {
  data: T;
  version: string;
  timestamp: number;
  checksum: string;
}

interface SavedResume {
  id: string;
  name: string;
  templateId: string;
  data: ResumeData;
  createdAt: string;
  updatedAt: string;
  tags: string[];
  thumbnail?: string;
}

interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  language: 'zh' | 'en';
  autoSave: boolean;
  saveInterval: number;
  exportFormat: 'pdf' | 'png';
  defaultTemplate: string;
}

// 优化的存储管理器
export class StorageManager {
  private static instance: StorageManager;
  
  private constructor() {}
  
  public static getInstance(): StorageManager {
    if (!StorageManager.instance) {
      StorageManager.instance = new StorageManager();
    }
    return StorageManager.instance;
  }
  
  // 生成简单校验和
  private generateChecksum(data: any): string {
    const str = JSON.stringify(data);
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return Math.abs(hash).toString(16);
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
    return this.generateChecksum(item.data) === item.checksum;
  }
  
  // 保存数据
  public save<T>(key: string, data: T): boolean {
    try {
      const wrappedData = this.wrapData(data);
      localStorage.setItem(key, JSON.stringify(wrappedData));
      return true;
    } catch (error) {
      console.error('保存数据失败:', error);
      return false;
    }
  }
  
  // 读取数据
  public load<T>(key: string): T | null {
    try {
      const stored = localStorage.getItem(key);
      if (!stored) return null;
      
      const item: StorageItem<T> = JSON.parse(stored);
      
      if (!this.validateData(item)) {
        console.warn(`数据校验失败: ${key}`);
        this.remove(key);
        return null;
      }
      
      return item.data;
    } catch (error) {
      console.error('读取数据失败:', error);
      return null;
    }
  }
  
  // 删除数据
  public remove(key: string): boolean {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error('删除数据失败:', error);
      return false;
    }
  }
  
  // 清空所有数据
  public clear(): boolean {
    try {
      Object.values(STORAGE_KEYS).forEach(key => {
        localStorage.removeItem(key);
      });
      return true;
    } catch (error) {
      console.error('清空数据失败:', error);
      return false;
    }
  }
  
  // 获取存储使用情况
  public getStorageInfo(): { used: number; available: number; percentage: number } {
    let used = 0;
    for (let key in localStorage) {
      if (localStorage.hasOwnProperty(key)) {
        used += localStorage[key].length + key.length;
      }
    }
    
    const available = 5 * 1024 * 1024; // 假设5MB限制
    const percentage = (used / available) * 100;
    
    return { used, available, percentage };
  }
  
  // 简历相关方法
  public saveResume(resume: SavedResume): boolean {
    const savedResumes = this.load<SavedResume[]>(STORAGE_KEYS.SAVED_RESUMES) || [];
    const existingIndex = savedResumes.findIndex(r => r.id === resume.id);
    
    if (existingIndex >= 0) {
      savedResumes[existingIndex] = { ...resume, updatedAt: new Date().toISOString() };
    } else {
      savedResumes.push(resume);
    }
    
    return this.save(STORAGE_KEYS.SAVED_RESUMES, savedResumes);
  }
  
  public loadResumes(): SavedResume[] {
    return this.load<SavedResume[]>(STORAGE_KEYS.SAVED_RESUMES) || [];
  }
  
  public deleteResume(id: string): boolean {
    const savedResumes = this.loadResumes();
    const filtered = savedResumes.filter(r => r.id !== id);
    return this.save(STORAGE_KEYS.SAVED_RESUMES, filtered);
  }
  
  public saveCurrentResume(data: ResumeData, templateId: string): boolean {
    return this.save(STORAGE_KEYS.CURRENT_RESUME, { data, templateId, timestamp: Date.now() });
  }
  
  public loadCurrentResume(): { data: ResumeData; templateId: string; timestamp: number } | null {
    return this.load(STORAGE_KEYS.CURRENT_RESUME);
  }
  
  // 用户偏好设置
  public savePreferences(preferences: UserPreferences): boolean {
    return this.save(STORAGE_KEYS.USER_PREFERENCES, preferences);
  }
  
  public loadPreferences(): UserPreferences | null {
    return this.load<UserPreferences>(STORAGE_KEYS.USER_PREFERENCES);
  }
  
  // 模板选择
  public saveTemplateSelection(templateId: string): boolean {
    return this.save(STORAGE_KEYS.TEMPLATE_SELECTION, {
      templateId,
      selectedAt: new Date().toISOString()
    });
  }
  
  public loadTemplateSelection(): { templateId: string; selectedAt: string } | null {
    return this.load(STORAGE_KEYS.TEMPLATE_SELECTION);
  }
}

// 导出单例实例
export const storageManager = StorageManager.getInstance();