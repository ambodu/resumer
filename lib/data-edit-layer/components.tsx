// 数据编辑层基础组件

import React, { useState, useEffect, useCallback } from 'react';
import { 
  FieldConfig, 
  TextFieldConfig, 
  SelectFieldConfig, 
  NumberFieldConfig, 
  BooleanFieldConfig, 
  DateFieldConfig, 
  ArrayFieldConfig, 
  ObjectFieldConfig, 
  FieldValue, 
  FieldChangeEvent, 
  EditorProps 
} from './types';
import { fieldValidationEngine } from './core';

// 基础字段组件
interface BaseFieldProps extends EditorProps {
  config: FieldConfig;
  value: FieldValue;
  onChange: (value: FieldValue) => void;
  onValidation?: (result: { isValid: boolean; errors: string[] }) => void;
  disabled?: boolean;
  className?: string;
}

// 文本输入组件
export const TextFieldEditor: React.FC<BaseFieldProps & { config: TextFieldConfig }> = ({
  config,
  value,
  onChange,
  onValidation,
  disabled = false,
  className = ''
}) => {
  const [localValue, setLocalValue] = useState<string>(value as string || '');
  const [errors, setErrors] = useState<string[]>([]);

  // 验证字段
  const validateField = useCallback((val: string) => {
    const result = fieldValidationEngine.validateField(val, config);
    setErrors(result.errors);
    onValidation?.(result);
    return result.isValid;
  }, [config, onValidation]);

  // 处理值变更
  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    setLocalValue(newValue);
    
    // 实时验证
    validateField(newValue);
    
    // 通知父组件
    onChange(newValue);
  }, [onChange, validateField]);

  // 同步外部值变更
  useEffect(() => {
    if (value !== localValue) {
      setLocalValue(value as string || '');
      validateField(value as string || '');
    }
  }, [value, localValue, validateField]);

  const inputProps = {
    id: config.id,
    value: localValue,
    onChange: handleChange,
    disabled,
    placeholder: config.placeholder,
    className: `w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
      errors.length > 0 ? 'border-red-500' : 'border-gray-300'
    } ${className}`,
    ...(config.maxLength && { maxLength: config.maxLength }),
    ...(config.pattern && { pattern: config.pattern })
  };

  return (
    <div className="space-y-1">
      {config.label && (
        <label htmlFor={config.id} className="block text-sm font-medium text-gray-700">
          {config.label}
          {config.validation?.some(rule => rule.type === 'required') && (
            <span className="text-red-500 ml-1">*</span>
          )}
        </label>
      )}
      
      {config.multiline ? (
        <textarea
          {...inputProps}
          rows={config.rows || 3}
        />
      ) : (
        <input
          type={config.inputType || 'text'}
          {...inputProps}
        />
      )}
      
      {config.description && (
        <p className="text-sm text-gray-500">{config.description}</p>
      )}
      
      {errors.length > 0 && (
        <div className="text-sm text-red-600">
          {errors.map((error, index) => (
            <p key={index}>{error}</p>
          ))}
        </div>
      )}
    </div>
  );
};

// 选择框组件
export const SelectFieldEditor: React.FC<BaseFieldProps & { config: SelectFieldConfig }> = ({
  config,
  value,
  onChange,
  onValidation,
  disabled = false,
  className = ''
}) => {
  const [errors, setErrors] = useState<string[]>([]);

  // 验证字段
  const validateField = useCallback((val: FieldValue) => {
    const result = fieldValidationEngine.validateField(val, config);
    setErrors(result.errors);
    onValidation?.(result);
    return result.isValid;
  }, [config, onValidation]);

  // 处理值变更
  const handleChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    const newValue = config.multiple 
      ? Array.from(e.target.selectedOptions, option => option.value)
      : e.target.value;
    
    validateField(newValue);
    onChange(newValue);
  }, [config.multiple, onChange, validateField]);

  // 同步验证
  useEffect(() => {
    validateField(value);
  }, [value, validateField]);

  return (
    <div className="space-y-1">
      {config.label && (
        <label htmlFor={config.id} className="block text-sm font-medium text-gray-700">
          {config.label}
          {config.validation?.some(rule => rule.type === 'required') && (
            <span className="text-red-500 ml-1">*</span>
          )}
        </label>
      )}
      
      <select
        id={config.id}
        value={config.multiple ? undefined : (value as string || '')}
        multiple={config.multiple}
        onChange={handleChange}
        disabled={disabled}
        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
          errors.length > 0 ? 'border-red-500' : 'border-gray-300'
        } ${className}`}
      >
        {config.placeholder && !config.multiple && (
          <option value="">{config.placeholder}</option>
        )}
        {config.options.map((option) => (
          <option 
            key={option.value} 
            value={option.value}
            selected={config.multiple ? (value as string[])?.includes(option.value) : false}
          >
            {option.label}
          </option>
        ))}
      </select>
      
      {config.description && (
        <p className="text-sm text-gray-500">{config.description}</p>
      )}
      
      {errors.length > 0 && (
        <div className="text-sm text-red-600">
          {errors.map((error, index) => (
            <p key={index}>{error}</p>
          ))}
        </div>
      )}
    </div>
  );
};

// 数字输入组件
export const NumberFieldEditor: React.FC<BaseFieldProps & { config: NumberFieldConfig }> = ({
  config,
  value,
  onChange,
  onValidation,
  disabled = false,
  className = ''
}) => {
  const [localValue, setLocalValue] = useState<string>(String(value || ''));
  const [errors, setErrors] = useState<string[]>([]);

  // 验证字段
  const validateField = useCallback((val: number | null) => {
    const result = fieldValidationEngine.validateField(val, config);
    setErrors(result.errors);
    onValidation?.(result);
    return result.isValid;
  }, [config, onValidation]);

  // 处理值变更
  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const stringValue = e.target.value;
    setLocalValue(stringValue);
    
    const numericValue = stringValue === '' ? null : Number(stringValue);
    
    validateField(numericValue);
    onChange(numericValue);
  }, [onChange, validateField]);

  // 同步外部值变更
  useEffect(() => {
    const stringValue = String(value || '');
    if (stringValue !== localValue) {
      setLocalValue(stringValue);
      validateField(value as number);
    }
  }, [value, localValue, validateField]);

  return (
    <div className="space-y-1">
      {config.label && (
        <label htmlFor={config.id} className="block text-sm font-medium text-gray-700">
          {config.label}
          {config.validation?.some(rule => rule.type === 'required') && (
            <span className="text-red-500 ml-1">*</span>
          )}
        </label>
      )}
      
      <input
        type="number"
        id={config.id}
        value={localValue}
        onChange={handleChange}
        disabled={disabled}
        placeholder={config.placeholder}
        min={config.min}
        max={config.max}
        step={config.step}
        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
          errors.length > 0 ? 'border-red-500' : 'border-gray-300'
        } ${className}`}
      />
      
      {config.description && (
        <p className="text-sm text-gray-500">{config.description}</p>
      )}
      
      {errors.length > 0 && (
        <div className="text-sm text-red-600">
          {errors.map((error, index) => (
            <p key={index}>{error}</p>
          ))}
        </div>
      )}
    </div>
  );
};

// 布尔值组件
export const BooleanFieldEditor: React.FC<BaseFieldProps & { config: BooleanFieldConfig }> = ({
  config,
  value,
  onChange,
  onValidation,
  disabled = false,
  className = ''
}) => {
  const [errors, setErrors] = useState<string[]>([]);

  // 验证字段
  const validateField = useCallback((val: boolean) => {
    const result = fieldValidationEngine.validateField(val, config);
    setErrors(result.errors);
    onValidation?.(result);
    return result.isValid;
  }, [config, onValidation]);

  // 处理值变更
  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.checked;
    validateField(newValue);
    onChange(newValue);
  }, [onChange, validateField]);

  // 同步验证
  useEffect(() => {
    validateField(value as boolean);
  }, [value, validateField]);

  return (
    <div className="space-y-1">
      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          id={config.id}
          checked={Boolean(value)}
          onChange={handleChange}
          disabled={disabled}
          className={`h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded ${
            errors.length > 0 ? 'border-red-500' : ''
          } ${className}`}
        />
        {config.label && (
          <label htmlFor={config.id} className="text-sm font-medium text-gray-700">
            {config.label}
            {config.validation?.some(rule => rule.type === 'required') && (
              <span className="text-red-500 ml-1">*</span>
            )}
          </label>
        )}
      </div>
      
      {config.description && (
        <p className="text-sm text-gray-500">{config.description}</p>
      )}
      
      {errors.length > 0 && (
        <div className="text-sm text-red-600">
          {errors.map((error, index) => (
            <p key={index}>{error}</p>
          ))}
        </div>
      )}
    </div>
  );
};

// 日期输入组件
export const DateFieldEditor: React.FC<BaseFieldProps & { config: DateFieldConfig }> = ({
  config,
  value,
  onChange,
  onValidation,
  disabled = false,
  className = ''
}) => {
  const [localValue, setLocalValue] = useState<string>(() => {
    if (value instanceof Date) {
      return value.toISOString().split('T')[0];
    }
    return value as string || '';
  });
  const [errors, setErrors] = useState<string[]>([]);

  // 验证字段
  const validateField = useCallback((val: Date | null) => {
    const result = fieldValidationEngine.validateField(val, config);
    setErrors(result.errors);
    onValidation?.(result);
    return result.isValid;
  }, [config, onValidation]);

  // 处理值变更
  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const stringValue = e.target.value;
    setLocalValue(stringValue);
    
    const dateValue = stringValue ? new Date(stringValue) : null;
    
    validateField(dateValue);
    onChange(dateValue);
  }, [onChange, validateField]);

  // 同步外部值变更
  useEffect(() => {
    let stringValue = '';
    if (value instanceof Date) {
      stringValue = value.toISOString().split('T')[0];
    } else if (value) {
      stringValue = value as string;
    }
    
    if (stringValue !== localValue) {
      setLocalValue(stringValue);
      validateField(value as Date);
    }
  }, [value, localValue, validateField]);

  return (
    <div className="space-y-1">
      {config.label && (
        <label htmlFor={config.id} className="block text-sm font-medium text-gray-700">
          {config.label}
          {config.validation?.some(rule => rule.type === 'required') && (
            <span className="text-red-500 ml-1">*</span>
          )}
        </label>
      )}
      
      <input
        type="date"
        id={config.id}
        value={localValue}
        onChange={handleChange}
        disabled={disabled}
        min={config.min}
        max={config.max}
        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
          errors.length > 0 ? 'border-red-500' : 'border-gray-300'
        } ${className}`}
      />
      
      {config.description && (
        <p className="text-sm text-gray-500">{config.description}</p>
      )}
      
      {errors.length > 0 && (
        <div className="text-sm text-red-600">
          {errors.map((error, index) => (
            <p key={index}>{error}</p>
          ))}
        </div>
      )}
    </div>
  );
};

// 数组字段组件
export const ArrayFieldEditor: React.FC<BaseFieldProps & { config: ArrayFieldConfig }> = ({
  config,
  value,
  onChange,
  onValidation,
  disabled = false,
  className = ''
}) => {
  const [items, setItems] = useState<any[]>(Array.isArray(value) ? value : []);
  const [errors, setErrors] = useState<string[]>([]);

  // 验证字段
  const validateField = useCallback((val: any[]) => {
    const result = fieldValidationEngine.validateField(val, config);
    setErrors(result.errors);
    onValidation?.(result);
    return result.isValid;
  }, [config, onValidation]);

  // 添加项目
  const addItem = useCallback(() => {
    const newItems = [...items, config.itemConfig.defaultValue || ''];
    setItems(newItems);
    validateField(newItems);
    onChange(newItems);
  }, [items, config.itemConfig.defaultValue, onChange, validateField]);

  // 删除项目
  const removeItem = useCallback((index: number) => {
    const newItems = items.filter((_, i) => i !== index);
    setItems(newItems);
    validateField(newItems);
    onChange(newItems);
  }, [items, onChange, validateField]);

  // 更新项目
  const updateItem = useCallback((index: number, newValue: any) => {
    const newItems = [...items];
    newItems[index] = newValue;
    setItems(newItems);
    validateField(newItems);
    onChange(newItems);
  }, [items, onChange, validateField]);

  // 同步外部值变更
  useEffect(() => {
    const newItems = Array.isArray(value) ? value : [];
    if (JSON.stringify(newItems) !== JSON.stringify(items)) {
      setItems(newItems);
      validateField(newItems);
    }
  }, [value, items, validateField]);

  return (
    <div className="space-y-2">
      {config.label && (
        <label className="block text-sm font-medium text-gray-700">
          {config.label}
          {config.validation?.some(rule => rule.type === 'required') && (
            <span className="text-red-500 ml-1">*</span>
          )}
        </label>
      )}
      
      <div className="space-y-2">
        {items.map((item, index) => (
          <div key={index} className="flex items-center space-x-2">
            <div className="flex-1">
              {/* 这里应该根据 itemConfig.type 渲染对应的编辑器 */}
              <input
                type="text"
                value={item}
                onChange={(e) => updateItem(index, e.target.value)}
                disabled={disabled}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button
              type="button"
              onClick={() => removeItem(index)}
              disabled={disabled}
              className="px-2 py-1 text-red-600 hover:text-red-800 disabled:opacity-50"
            >
              删除
            </button>
          </div>
        ))}
      </div>
      
      {(!config.maxItems || items.length < config.maxItems) && (
        <button
          type="button"
          onClick={addItem}
          disabled={disabled}
          className="px-3 py-1 text-sm text-blue-600 hover:text-blue-800 disabled:opacity-50"
        >
          + 添加项目
        </button>
      )}
      
      {config.description && (
        <p className="text-sm text-gray-500">{config.description}</p>
      )}
      
      {errors.length > 0 && (
        <div className="text-sm text-red-600">
          {errors.map((error, index) => (
            <p key={index}>{error}</p>
          ))}
        </div>
      )}
    </div>
  );
};

// 通用字段编辑器
export const FieldEditor: React.FC<BaseFieldProps> = (props) => {
  const { config } = props;
  
  switch (config.type) {
    case 'text':
    case 'email':
    case 'phone':
    case 'url':
    case 'textarea':
      return <TextFieldEditor {...props} config={config as TextFieldConfig} />;
      
    case 'select':
    case 'multiselect':
      return <SelectFieldEditor {...props} config={config as SelectFieldConfig} />;
      
    case 'number':
    case 'range':
      return <NumberFieldEditor {...props} config={config as NumberFieldConfig} />;
      
    case 'boolean':
      return <BooleanFieldEditor {...props} config={config as BooleanFieldConfig} />;
      
    case 'date':
      return <DateFieldEditor {...props} config={config as DateFieldConfig} />;
      
    case 'array':
      return <ArrayFieldEditor {...props} config={config as ArrayFieldConfig} />;
      
    default:
      return (
        <div className="text-red-500">
          不支持的字段类型: {config.type}
        </div>
      );
  }
};