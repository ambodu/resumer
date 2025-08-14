// 数据编辑层导出文件

// 类型定义
export * from './types';

// 核心功能
export {
  defaultValidators,
  FieldValidationEngine,
  DataTransformer,
  FormDataManager,
  EditorRegistryManager,
  fieldValidationEngine,
  editorRegistry
} from './core';

// 基础组件
export {
  TextFieldEditor,
  SelectFieldEditor,
  NumberFieldEditor,
  BooleanFieldEditor,
  DateFieldEditor,
  ArrayFieldEditor,
  FieldEditor
} from './components';

// 表单组件
export {
  DynamicForm,
  SimpleForm,
  FormBuilder,
  FieldPresets
} from './form';

// 便捷函数
export const createFormConfig = (id: string, fields: any[], options: any = {}) => {
  return {
    id,
    fields,
    title: options.title || '',
    description: options.description || '',
    groups: options.groups || undefined
  };
};

export const createFieldConfig = (type: string, id: string, label: string, options: any = {}) => {
  return {
    id,
    type,
    label,
    ...options
  };
};

// 预设表单配置
export const FormPresets = {
  // 个人信息表单
  personalInfo: () => new FormBuilder()
    .setBasicInfo('personal-info', '个人信息', '请填写您的基本信息')
    .addField(FieldPresets.text('fullName', '姓名', { required: true }))
    .addField(FieldPresets.email('email', '邮箱', { required: true }))
    .addField(FieldPresets.phone('phone', '电话', { required: true }))
    .addField(FieldPresets.text('address', '地址'))
    .addField(FieldPresets.text('website', '个人网站'))
    .build(),

  // 工作经历表单
  workExperience: () => new FormBuilder()
    .setBasicInfo('work-experience', '工作经历', '请填写您的工作经历')
    .addField(FieldPresets.text('company', '公司名称', { required: true }))
    .addField(FieldPresets.text('position', '职位', { required: true }))
    .addField(FieldPresets.date('startDate', '开始日期', { required: true }))
    .addField(FieldPresets.date('endDate', '结束日期'))
    .addField(FieldPresets.textarea('description', '工作描述', { rows: 4 }))
    .build(),

  // 教育经历表单
  education: () => new FormBuilder()
    .setBasicInfo('education', '教育经历', '请填写您的教育背景')
    .addField(FieldPresets.text('school', '学校名称', { required: true }))
    .addField(FieldPresets.text('degree', '学位', { required: true }))
    .addField(FieldPresets.text('major', '专业', { required: true }))
    .addField(FieldPresets.date('startDate', '开始日期', { required: true }))
    .addField(FieldPresets.date('endDate', '结束日期'))
    .addField(FieldPresets.number('gpa', 'GPA', { min: 0, max: 4, step: 0.01 }))
    .build(),

  // 技能表单
  skills: () => new FormBuilder()
    .setBasicInfo('skills', '技能', '请填写您的技能')
    .addField(FieldPresets.text('name', '技能名称', { required: true }))
    .addField(FieldPresets.select('level', '熟练程度', [
      { value: 'beginner', label: '初级' },
      { value: 'intermediate', label: '中级' },
      { value: 'advanced', label: '高级' },
      { value: 'expert', label: '专家' }
    ], { required: true }))
    .addField(FieldPresets.textarea('description', '技能描述'))
    .build(),

  // 项目经历表单
  projects: () => new FormBuilder()
    .setBasicInfo('projects', '项目经历', '请填写您的项目经历')
    .addField(FieldPresets.text('name', '项目名称', { required: true }))
    .addField(FieldPresets.text('role', '担任角色', { required: true }))
    .addField(FieldPresets.date('startDate', '开始日期', { required: true }))
    .addField(FieldPresets.date('endDate', '结束日期'))
    .addField(FieldPresets.textarea('description', '项目描述', { rows: 4 }))
    .addField(FieldPresets.array('technologies', '使用技术', 
      { type: 'text', defaultValue: '' },
      { minItems: 1 }
    ))
    .addField(FieldPresets.text('url', '项目链接'))
    .build()
};

// 数据编辑层工具函数
export const DataEditUtils = {
  // 验证表单数据
  validateFormData: (data: any, config: any) => {
    const manager = new FormDataManager(config, data);
    return manager.validate();
  },

  // 转换表单数据
  transformFormData: (data: any, config: any) => {
    const transformedData: any = {};
    
    for (const fieldConfig of config.fields) {
      const value = data[fieldConfig.id];
      transformedData[fieldConfig.id] = DataTransformer.transformFromFieldValue(
        value,
        fieldConfig
      );
    }
    
    return transformedData;
  },

  // 创建默认数据
  createDefaultData: (config: any) => {
    const defaultData: any = {};
    
    for (const fieldConfig of config.fields) {
      defaultData[fieldConfig.id] = fieldConfig.defaultValue || null;
    }
    
    return defaultData;
  },

  // 合并表单数据
  mergeFormData: (baseData: any, newData: any, config: any) => {
    const mergedData = { ...baseData };
    
    for (const fieldConfig of config.fields) {
      const fieldId = fieldConfig.id;
      if (newData.hasOwnProperty(fieldId)) {
        mergedData[fieldId] = DataTransformer.transformToFieldValue(
          newData[fieldId],
          fieldConfig
        );
      }
    }
    
    return mergedData;
  },

  // 清理表单数据
  cleanFormData: (data: any, config: any) => {
    const cleanedData: any = {};
    
    for (const fieldConfig of config.fields) {
      const fieldId = fieldConfig.id;
      if (data.hasOwnProperty(fieldId)) {
        const value = data[fieldId];
        if (value !== null && value !== undefined && value !== '') {
          cleanedData[fieldId] = value;
        }
      }
    }
    
    return cleanedData;
  }
};

// 数据编辑层常量
export const DATA_EDIT_CONSTANTS = {
  // 字段类型
  FIELD_TYPES: {
    TEXT: 'text',
    EMAIL: 'email',
    PHONE: 'phone',
    URL: 'url',
    TEXTAREA: 'textarea',
    RICH_TEXT: 'rich-text',
    NUMBER: 'number',
    RANGE: 'range',
    BOOLEAN: 'boolean',
    DATE: 'date',
    SELECT: 'select',
    MULTISELECT: 'multiselect',
    ARRAY: 'array',
    OBJECT: 'object'
  },

  // 验证规则类型
  VALIDATION_TYPES: {
    REQUIRED: 'required',
    EMAIL: 'email',
    URL: 'url',
    MIN_LENGTH: 'minLength',
    MAX_LENGTH: 'maxLength',
    PATTERN: 'pattern',
    CUSTOM: 'custom'
  },

  // 表单布局
  FORM_LAYOUTS: {
    VERTICAL: 'vertical',
    HORIZONTAL: 'horizontal'
  }
};