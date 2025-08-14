// 数据编辑层类型定义

// 基础编辑器类型
export type EditorType = 
  | 'text' 
  | 'textarea' 
  | 'email' 
  | 'phone' 
  | 'url' 
  | 'date' 
  | 'select' 
  | 'multiselect' 
  | 'rich-text' 
  | 'file-upload' 
  | 'color' 
  | 'number' 
  | 'range' 
  | 'boolean' 
  | 'array' 
  | 'object';

// 基础字段配置
export interface BaseFieldConfig {
  id: string;
  label: string;
  type: EditorType;
  required?: boolean;
  placeholder?: string;
  description?: string;
  defaultValue?: any;
  validation?: ValidationRule[];
  disabled?: boolean;
  visible?: boolean;
  className?: string;
}

// 验证规则
export interface ValidationRule {
  type: 'required' | 'minLength' | 'maxLength' | 'pattern' | 'email' | 'url' | 'custom';
  value?: any;
  message: string;
  validator?: (value: any) => boolean;
}

// 选择器选项
export interface SelectOption {
  value: string | number;
  label: string;
  disabled?: boolean;
  group?: string;
}

// 文本字段配置
export interface TextFieldConfig extends BaseFieldConfig {
  type: 'text' | 'email' | 'phone' | 'url';
  minLength?: number;
  maxLength?: number;
  pattern?: string;
}

// 文本域配置
export interface TextareaFieldConfig extends BaseFieldConfig {
  type: 'textarea' | 'rich-text';
  rows?: number;
  minLength?: number;
  maxLength?: number;
  autoResize?: boolean;
}

// 选择器配置
export interface SelectFieldConfig extends BaseFieldConfig {
  type: 'select' | 'multiselect';
  options: SelectOption[];
  searchable?: boolean;
  clearable?: boolean;
  multiple?: boolean;
}

// 数字字段配置
export interface NumberFieldConfig extends BaseFieldConfig {
  type: 'number' | 'range';
  min?: number;
  max?: number;
  step?: number;
  unit?: string;
}

// 日期字段配置
export interface DateFieldConfig extends BaseFieldConfig {
  type: 'date';
  format?: string;
  minDate?: Date;
  maxDate?: Date;
  showTime?: boolean;
}

// 布尔字段配置
export interface BooleanFieldConfig extends BaseFieldConfig {
  type: 'boolean';
  variant?: 'checkbox' | 'switch' | 'radio';
}

// 数组字段配置
export interface ArrayFieldConfig extends BaseFieldConfig {
  type: 'array';
  itemConfig: FieldConfig;
  minItems?: number;
  maxItems?: number;
  addButtonText?: string;
  removeButtonText?: string;
}

// 对象字段配置
export interface ObjectFieldConfig extends BaseFieldConfig {
  type: 'object';
  fields: FieldConfig[];
  layout?: 'vertical' | 'horizontal' | 'grid';
  columns?: number;
}

// 文件上传配置
export interface FileUploadFieldConfig extends BaseFieldConfig {
  type: 'file-upload';
  accept?: string;
  maxSize?: number;
  multiple?: boolean;
  preview?: boolean;
}

// 颜色选择器配置
export interface ColorFieldConfig extends BaseFieldConfig {
  type: 'color';
  format?: 'hex' | 'rgb' | 'hsl';
  presets?: string[];
}

// 联合类型
export type FieldConfig = 
  | TextFieldConfig 
  | TextareaFieldConfig 
  | SelectFieldConfig 
  | NumberFieldConfig 
  | DateFieldConfig 
  | BooleanFieldConfig 
  | ArrayFieldConfig 
  | ObjectFieldConfig 
  | FileUploadFieldConfig 
  | ColorFieldConfig;

// 表单配置
export interface FormConfig {
  id: string;
  title?: string;
  description?: string;
  fields: FieldConfig[];
  layout?: 'vertical' | 'horizontal' | 'grid';
  columns?: number;
  submitText?: string;
  resetText?: string;
  validation?: 'onChange' | 'onBlur' | 'onSubmit';
}

// 字段值类型
export type FieldValue = string | number | boolean | Date | File | any[] | Record<string, any> | null | undefined;

// 表单数据
export type FormData = Record<string, FieldValue>;

// 字段变更事件
export interface FieldChangeEvent {
  fieldId: string;
  value: FieldValue;
  oldValue: FieldValue;
  isValid: boolean;
  errors: string[];
}

// 表单变更事件
export interface FormChangeEvent {
  formId: string;
  data: FormData;
  changedField: FieldChangeEvent;
  isValid: boolean;
  errors: Record<string, string[]>;
}

// 编辑器组件属性
export interface EditorProps<T = FieldValue> {
  config: FieldConfig;
  value: T;
  onChange: (value: T) => void;
  onBlur?: () => void;
  onFocus?: () => void;
  error?: string;
  disabled?: boolean;
  className?: string;
}

// 表单组件属性
export interface FormProps {
  config: FormConfig;
  data: FormData;
  onChange: (event: FormChangeEvent) => void;
  onSubmit?: (data: FormData) => void;
  onReset?: () => void;
  errors?: Record<string, string[]>;
  disabled?: boolean;
  className?: string;
}

// 编辑器注册表
export interface EditorRegistry {
  [key: string]: React.ComponentType<EditorProps>;
}

// 验证结果
export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

// 字段验证器
export type FieldValidator = (value: FieldValue, config: FieldConfig, formData: FormData) => ValidationResult;

// 表单验证器
export type FormValidator = (data: FormData, config: FormConfig) => Record<string, string[]>;