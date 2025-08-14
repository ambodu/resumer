// 数据编辑层表单组件

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { 
  FormConfig, 
  FormData, 
  FormChangeEvent, 
  FieldChangeEvent, 
  FormProps 
} from './types';
import { FormDataManager } from './core';
import { FieldEditor } from './components';

// 动态表单组件
export const DynamicForm: React.FC<FormProps> = ({
  config,
  initialData = {},
  onChange,
  onSubmit,
  onValidation,
  disabled = false,
  className = '',
  submitButtonText = '提交',
  showSubmitButton = true,
  layout = 'vertical'
}) => {
  // 表单数据管理器
  const formManager = useMemo(() => {
    return new FormDataManager(config, initialData);
  }, [config, initialData]);

  // 表单状态
  const [formData, setFormData] = useState<FormData>(formManager.getAllData());
  const [formErrors, setFormErrors] = useState<Record<string, string[]>>({});
  const [isValid, setIsValid] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // 处理表单变更
  const handleFormChange = useCallback((event: FormChangeEvent) => {
    setFormData(event.data);
    setFormErrors(event.errors);
    setIsValid(event.isValid);
    
    // 通知父组件
    onChange?.(event);
    onValidation?.(event.isValid, event.errors);
  }, [onChange, onValidation]);

  // 注册表单变更监听器
  useEffect(() => {
    formManager.addChangeListener(handleFormChange);
    
    return () => {
      formManager.removeChangeListener(handleFormChange);
    };
  }, [formManager, handleFormChange]);

  // 处理字段值变更
  const handleFieldChange = useCallback((fieldId: string, value: any) => {
    formManager.setFieldValue(fieldId, value);
  }, [formManager]);

  // 处理表单提交
  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!onSubmit || isSubmitting) return;
    
    // 验证表单
    const errors = formManager.validate();
    const isFormValid = Object.keys(errors).length === 0;
    
    setFormErrors(errors);
    setIsValid(isFormValid);
    
    if (!isFormValid) {
      onValidation?.(false, errors);
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      await onSubmit(formData, {
        isValid: isFormValid,
        errors,
        reset: () => formManager.reset(),
        setFieldValue: (fieldId: string, value: any) => formManager.setFieldValue(fieldId, value),
        setAllData: (data: FormData) => formManager.setAllData(data)
      });
    } catch (error) {
      console.error('表单提交失败:', error);
    } finally {
      setIsSubmitting(false);
    }
  }, [formManager, formData, isSubmitting, onSubmit, onValidation]);

  // 重置表单
  const resetForm = useCallback(() => {
    formManager.reset();
  }, [formManager]);

  // 渲染字段
  const renderField = useCallback((fieldConfig: any) => {
    const fieldValue = formData[fieldConfig.id];
    const fieldErrors = formErrors[fieldConfig.id] || [];
    
    return (
      <div key={fieldConfig.id} className={`form-field ${fieldConfig.className || ''}`}>
        <FieldEditor
          config={fieldConfig}
          value={fieldValue}
          onChange={(value) => handleFieldChange(fieldConfig.id, value)}
          onValidation={(result) => {
            // 字段级验证回调
            if (result.errors.length > 0) {
              setFormErrors(prev => ({
                ...prev,
                [fieldConfig.id]: result.errors
              }));
            } else {
              setFormErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[fieldConfig.id];
                return newErrors;
              });
            }
          }}
          disabled={disabled}
          formData={formData}
        />
      </div>
    );
  }, [formData, formErrors, disabled, handleFieldChange]);

  // 渲染字段组
  const renderFieldGroup = useCallback((group: any) => {
    return (
      <div key={group.id} className={`field-group ${group.className || ''}`}>
        {group.title && (
          <h3 className="text-lg font-medium text-gray-900 mb-4">{group.title}</h3>
        )}
        {group.description && (
          <p className="text-sm text-gray-600 mb-4">{group.description}</p>
        )}
        <div className={`grid gap-4 ${
          layout === 'horizontal' ? 'grid-cols-2' : 'grid-cols-1'
        }`}>
          {group.fields.map(renderField)}
        </div>
      </div>
    );
  }, [layout, renderField]);

  // 布局样式
  const formLayoutClass = useMemo(() => {
    const baseClass = 'space-y-6';
    const layoutClass = layout === 'horizontal' ? 'max-w-4xl' : 'max-w-2xl';
    return `${baseClass} ${layoutClass} ${className}`;
  }, [layout, className]);

  return (
    <form onSubmit={handleSubmit} className={formLayoutClass}>
      {/* 表单标题和描述 */}
      {config.title && (
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900">{config.title}</h2>
          {config.description && (
            <p className="mt-2 text-sm text-gray-600">{config.description}</p>
          )}
        </div>
      )}

      {/* 表单字段 */}
      <div className="space-y-6">
        {config.groups ? (
          // 分组渲染
          config.groups.map(renderFieldGroup)
        ) : (
          // 直接渲染字段
          <div className={`grid gap-4 ${
            layout === 'horizontal' ? 'grid-cols-2' : 'grid-cols-1'
          }`}>
            {config.fields.map(renderField)}
          </div>
        )}
      </div>

      {/* 表单错误提示 */}
      {Object.keys(formErrors).length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <h4 className="text-sm font-medium text-red-800 mb-2">请修正以下错误：</h4>
          <ul className="text-sm text-red-700 space-y-1">
            {Object.entries(formErrors).map(([fieldId, errors]) => {
              const fieldConfig = config.fields.find(f => f.id === fieldId);
              const fieldLabel = fieldConfig?.label || fieldId;
              return errors.map((error, index) => (
                <li key={`${fieldId}-${index}`}>
                  {fieldLabel}: {error}
                </li>
              ));
            })}
          </ul>
        </div>
      )}

      {/* 提交按钮 */}
      {showSubmitButton && (
        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={resetForm}
            disabled={disabled || isSubmitting}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            重置
          </button>
          <button
            type="submit"
            disabled={disabled || isSubmitting || !isValid}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {isSubmitting ? '提交中...' : submitButtonText}
          </button>
        </div>
      )}
    </form>
  );
};

// 简化的表单组件
export const SimpleForm: React.FC<{
  fields: any[];
  initialData?: FormData;
  onChange?: (data: FormData) => void;
  onSubmit?: (data: FormData) => void | Promise<void>;
  disabled?: boolean;
  className?: string;
}> = ({
  fields,
  initialData = {},
  onChange,
  onSubmit,
  disabled = false,
  className = ''
}) => {
  const config: FormConfig = {
    id: 'simple-form',
    fields,
    title: '',
    description: ''
  };

  return (
    <DynamicForm
      config={config}
      initialData={initialData}
      onChange={(event) => onChange?.(event.data)}
      onSubmit={onSubmit ? async (data) => await onSubmit(data) : undefined}
      disabled={disabled}
      className={className}
      showSubmitButton={!!onSubmit}
    />
  );
};

// 表单构建器
export class FormBuilder {
  private config: Partial<FormConfig> = {
    fields: [],
    groups: []
  };

  // 设置表单基本信息
  setBasicInfo(id: string, title?: string, description?: string): FormBuilder {
    this.config.id = id;
    this.config.title = title;
    this.config.description = description;
    return this;
  }

  // 添加字段
  addField(fieldConfig: any): FormBuilder {
    if (!this.config.fields) {
      this.config.fields = [];
    }
    this.config.fields.push(fieldConfig);
    return this;
  }

  // 添加字段组
  addGroup(groupConfig: any): FormBuilder {
    if (!this.config.groups) {
      this.config.groups = [];
    }
    this.config.groups.push(groupConfig);
    return this;
  }

  // 构建表单配置
  build(): FormConfig {
    if (!this.config.id) {
      throw new Error('表单ID是必需的');
    }
    if (!this.config.fields || this.config.fields.length === 0) {
      throw new Error('表单必须至少包含一个字段');
    }
    
    return this.config as FormConfig;
  }

  // 重置构建器
  reset(): FormBuilder {
    this.config = {
      fields: [],
      groups: []
    };
    return this;
  }
}

// 预设字段配置
export const FieldPresets = {
  // 文本字段
  text: (id: string, label: string, options: any = {}) => ({
    id,
    type: 'text',
    label,
    placeholder: options.placeholder || `请输入${label}`,
    validation: options.required ? [{ type: 'required' }] : [],
    ...options
  }),

  // 邮箱字段
  email: (id: string, label: string = '邮箱', options: any = {}) => ({
    id,
    type: 'email',
    label,
    placeholder: options.placeholder || '请输入邮箱地址',
    validation: [
      ...(options.required ? [{ type: 'required' }] : []),
      { type: 'email' }
    ],
    ...options
  }),

  // 电话字段
  phone: (id: string, label: string = '电话', options: any = {}) => ({
    id,
    type: 'phone',
    label,
    placeholder: options.placeholder || '请输入电话号码',
    validation: options.required ? [{ type: 'required' }] : [],
    ...options
  }),

  // 选择字段
  select: (id: string, label: string, options: any[] = [], config: any = {}) => ({
    id,
    type: 'select',
    label,
    options,
    placeholder: config.placeholder || `请选择${label}`,
    validation: config.required ? [{ type: 'required' }] : [],
    ...config
  }),

  // 数字字段
  number: (id: string, label: string, options: any = {}) => ({
    id,
    type: 'number',
    label,
    placeholder: options.placeholder || `请输入${label}`,
    validation: options.required ? [{ type: 'required' }] : [],
    ...options
  }),

  // 日期字段
  date: (id: string, label: string, options: any = {}) => ({
    id,
    type: 'date',
    label,
    validation: options.required ? [{ type: 'required' }] : [],
    ...options
  }),

  // 布尔字段
  boolean: (id: string, label: string, options: any = {}) => ({
    id,
    type: 'boolean',
    label,
    validation: options.required ? [{ type: 'required' }] : [],
    ...options
  }),

  // 文本域字段
  textarea: (id: string, label: string, options: any = {}) => ({
    id,
    type: 'textarea',
    label,
    placeholder: options.placeholder || `请输入${label}`,
    multiline: true,
    rows: options.rows || 3,
    validation: options.required ? [{ type: 'required' }] : [],
    ...options
  }),

  // 数组字段
  array: (id: string, label: string, itemConfig: any, options: any = {}) => ({
    id,
    type: 'array',
    label,
    itemConfig,
    validation: options.required ? [{ type: 'required' }] : [],
    ...options
  })
};