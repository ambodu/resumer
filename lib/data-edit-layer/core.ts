// 数据编辑层核心功能

import React from 'react';
import { 
  FieldConfig, 
  FormConfig, 
  FormData, 
  FieldValue, 
  ValidationResult, 
  FieldValidator, 
  FormValidator,
  EditorRegistry,
  FieldChangeEvent,
  FormChangeEvent
} from './types';

// 默认验证器
export const defaultValidators: Record<string, FieldValidator> = {
  required: (value: FieldValue) => ({
    isValid: value !== null && value !== undefined && value !== '',
    errors: value === null || value === undefined || value === '' ? ['此字段为必填项'] : []
  }),
  
  email: (value: FieldValue) => {
    if (!value || typeof value !== 'string') return { isValid: true, errors: [] };
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return {
      isValid: emailRegex.test(value),
      errors: emailRegex.test(value) ? [] : ['请输入有效的邮箱地址']
    };
  },
  
  url: (value: FieldValue) => {
    if (!value || typeof value !== 'string') return { isValid: true, errors: [] };
    try {
      new URL(value);
      return { isValid: true, errors: [] };
    } catch {
      return { isValid: false, errors: ['请输入有效的URL地址'] };
    }
  },
  
  minLength: (value: FieldValue, config: FieldConfig) => {
    if (!value || typeof value !== 'string') return { isValid: true, errors: [] };
    const minLength = (config as any).minLength || 0;
    return {
      isValid: value.length >= minLength,
      errors: value.length >= minLength ? [] : [`最少需要${minLength}个字符`]
    };
  },
  
  maxLength: (value: FieldValue, config: FieldConfig) => {
    if (!value || typeof value !== 'string') return { isValid: true, errors: [] };
    const maxLength = (config as any).maxLength || Infinity;
    return {
      isValid: value.length <= maxLength,
      errors: value.length <= maxLength ? [] : [`最多允许${maxLength}个字符`]
    };
  },
  
  pattern: (value: FieldValue, config: FieldConfig) => {
    if (!value || typeof value !== 'string') return { isValid: true, errors: [] };
    const pattern = (config as any).pattern;
    if (!pattern) return { isValid: true, errors: [] };
    
    const regex = new RegExp(pattern);
    return {
      isValid: regex.test(value),
      errors: regex.test(value) ? [] : ['输入格式不正确']
    };
  }
};

// 字段验证器
export class FieldValidationEngine {
  private validators: Record<string, FieldValidator> = { ...defaultValidators };
  
  // 注册自定义验证器
  registerValidator(name: string, validator: FieldValidator): void {
    this.validators[name] = validator;
  }
  
  // 验证单个字段
  validateField(value: FieldValue, config: FieldConfig, formData: FormData = {}): ValidationResult {
    const errors: string[] = [];
    
    // 执行配置的验证规则
    if (config.validation) {
      for (const rule of config.validation) {
        const validator = this.validators[rule.type];
        if (validator) {
          const result = validator(value, config, formData);
          if (!result.isValid) {
            errors.push(rule.message || result.errors[0] || '验证失败');
          }
        } else if (rule.type === 'custom' && rule.validator) {
          const isValid = rule.validator(value);
          if (!isValid) {
            errors.push(rule.message);
          }
        }
      }
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }
  
  // 验证整个表单
  validateForm(data: FormData, config: FormConfig): Record<string, string[]> {
    const errors: Record<string, string[]> = {};
    
    for (const fieldConfig of config.fields) {
      const value = data[fieldConfig.id];
      const result = this.validateField(value, fieldConfig, data);
      
      if (!result.isValid) {
        errors[fieldConfig.id] = result.errors;
      }
    }
    
    return errors;
  }
}

// 数据转换器
export class DataTransformer {
  // 将原始值转换为字段值
  static transformToFieldValue(value: any, config: FieldConfig): FieldValue {
    if (value === null || value === undefined) {
      return config.defaultValue || null;
    }
    
    switch (config.type) {
      case 'text':
      case 'email':
      case 'phone':
      case 'url':
      case 'textarea':
      case 'rich-text':
        return String(value);
        
      case 'number':
      case 'range':
        return Number(value);
        
      case 'boolean':
        return Boolean(value);
        
      case 'date':
        return value instanceof Date ? value : new Date(value);
        
      case 'array':
        return Array.isArray(value) ? value : [];
        
      case 'object':
        return typeof value === 'object' ? value : {};
        
      case 'select':
        return value;
        
      case 'multiselect':
        return Array.isArray(value) ? value : [];
        
      default:
        return value;
    }
  }
  
  // 将字段值转换为存储值
  static transformFromFieldValue(value: FieldValue, config: FieldConfig): any {
    if (value === null || value === undefined) {
      return null;
    }
    
    switch (config.type) {
      case 'date':
        return value instanceof Date ? value.toISOString() : value;
        
      default:
        return value;
    }
  }
}

// 表单数据管理器
export class FormDataManager {
  private data: FormData = {};
  private config: FormConfig;
  private validator: FieldValidationEngine;
  private changeListeners: ((event: FormChangeEvent) => void)[] = [];
  
  constructor(config: FormConfig, initialData: FormData = {}) {
    this.config = config;
    this.validator = new FieldValidationEngine();
    this.initializeData(initialData);
  }
  
  // 初始化数据
  private initializeData(initialData: FormData): void {
    this.data = {};
    
    for (const fieldConfig of this.config.fields) {
      const initialValue = initialData[fieldConfig.id];
      this.data[fieldConfig.id] = DataTransformer.transformToFieldValue(
        initialValue,
        fieldConfig
      );
    }
  }
  
  // 获取字段值
  getFieldValue(fieldId: string): FieldValue {
    return this.data[fieldId];
  }
  
  // 设置字段值
  setFieldValue(fieldId: string, value: FieldValue): void {
    const fieldConfig = this.config.fields.find(f => f.id === fieldId);
    if (!fieldConfig) return;
    
    const oldValue = this.data[fieldId];
    const newValue = DataTransformer.transformToFieldValue(value, fieldConfig);
    
    this.data[fieldId] = newValue;
    
    // 验证字段
    const validation = this.validator.validateField(newValue, fieldConfig, this.data);
    
    // 触发变更事件
    const fieldChangeEvent: FieldChangeEvent = {
      fieldId,
      value: newValue,
      oldValue,
      isValid: validation.isValid,
      errors: validation.errors
    };
    
    const formErrors = this.validator.validateForm(this.data, this.config);
    const isFormValid = Object.keys(formErrors).length === 0;
    
    const formChangeEvent: FormChangeEvent = {
      formId: this.config.id,
      data: { ...this.data },
      changedField: fieldChangeEvent,
      isValid: isFormValid,
      errors: formErrors
    };
    
    this.notifyChangeListeners(formChangeEvent);
  }
  
  // 获取所有数据
  getAllData(): FormData {
    return { ...this.data };
  }
  
  // 设置所有数据
  setAllData(data: FormData): void {
    this.initializeData(data);
    
    const formErrors = this.validator.validateForm(this.data, this.config);
    const isFormValid = Object.keys(formErrors).length === 0;
    
    const formChangeEvent: FormChangeEvent = {
      formId: this.config.id,
      data: { ...this.data },
      changedField: {
        fieldId: '',
        value: null,
        oldValue: null,
        isValid: true,
        errors: []
      },
      isValid: isFormValid,
      errors: formErrors
    };
    
    this.notifyChangeListeners(formChangeEvent);
  }
  
  // 验证表单
  validate(): Record<string, string[]> {
    return this.validator.validateForm(this.data, this.config);
  }
  
  // 重置表单
  reset(): void {
    this.initializeData({});
  }
  
  // 添加变更监听器
  addChangeListener(listener: (event: FormChangeEvent) => void): void {
    this.changeListeners.push(listener);
  }
  
  // 移除变更监听器
  removeChangeListener(listener: (event: FormChangeEvent) => void): void {
    const index = this.changeListeners.indexOf(listener);
    if (index > -1) {
      this.changeListeners.splice(index, 1);
    }
  }
  
  // 通知变更监听器
  private notifyChangeListeners(event: FormChangeEvent): void {
    for (const listener of this.changeListeners) {
      listener(event);
    }
  }
}

// 编辑器注册表
export class EditorRegistryManager {
  private static instance: EditorRegistryManager;
  private registry: EditorRegistry = {};
  
  static getInstance(): EditorRegistryManager {
    if (!EditorRegistryManager.instance) {
      EditorRegistryManager.instance = new EditorRegistryManager();
    }
    return EditorRegistryManager.instance;
  }
  
  // 注册编辑器组件
  registerEditor(type: string, component: React.ComponentType<any>): void {
    this.registry[type] = component;
  }
  
  // 获取编辑器组件
  getEditor(type: string): React.ComponentType<any> | undefined {
    return this.registry[type];
  }
  
  // 获取所有注册的编辑器
  getAllEditors(): EditorRegistry {
    return { ...this.registry };
  }
}

// 导出单例实例
export const fieldValidationEngine = new FieldValidationEngine();
export const editorRegistry = EditorRegistryManager.getInstance();