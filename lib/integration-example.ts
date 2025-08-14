// 三层架构集成示例
// 展示如何使用数据编辑层、数据中间层和数据导出层

import React from 'react';

// 数据编辑层导入
import {
  DynamicForm,
  FormBuilder,
  FieldPresets,
  FormPresets,
  createFormConfig,
  DataEditUtils,
  type FormConfig,
  type FormData,
  type FormEvent
} from './data-edit-layer';

// 数据中间层导入
import {
  ResumeDataTransformer,
  getAllTemplates,
  getTemplateById,
  modernTemplate,
  type ResumeData,
  type StyledResumeData,
  type ResumeTemplate,
  type TransformOptions
} from './data-transform-layer';

// 数据导出层导入
import {
  exportToPDF,
  exportToPDFAsync,
  getTaskStatus,
  ExportPresets,
  validateResumeData,
  type ExportOptions,
  type ExportResult
} from './data-export-layer';

// 集成类：简历编辑器
export class ResumeEditor {
  private transformer: ResumeDataTransformer;
  private currentTemplate: ResumeTemplate;
  private formConfig: FormConfig;
  
  constructor(templateId: string = 'modern') {
    this.transformer = new ResumeDataTransformer();
    this.currentTemplate = getTemplateById(templateId) || modernTemplate;
    this.formConfig = this.createResumeFormConfig();
  }
  
  // 创建简历表单配置
  private createResumeFormConfig(): FormConfig {
    const builder = new FormBuilder('resume-form', '简历编辑');
    
    // 个人信息部分
    builder.addSection('personal', '个人信息', [
      FieldPresets.text('fullName', '姓名', { required: true }),
      FieldPresets.email('email', '邮箱', { required: true }),
      FieldPresets.text('phone', '电话'),
      FieldPresets.text('location', '地址'),
      FieldPresets.text('website', '个人网站'),
      FieldPresets.textarea('summary', '个人简介', { rows: 4 })
    ]);
    
    // 工作经验部分
    builder.addSection('experience', '工作经验', [
      FieldPresets.array('workExperience', '工作经历', {
        itemFields: [
          FieldPresets.text('company', '公司名称', { required: true }),
          FieldPresets.text('position', '职位', { required: true }),
          FieldPresets.date('startDate', '开始日期', { required: true }),
          FieldPresets.date('endDate', '结束日期'),
          FieldPresets.boolean('current', '至今'),
          FieldPresets.textarea('description', '工作描述', { rows: 3 })
        ]
      })
    ]);
    
    // 教育背景部分
    builder.addSection('education', '教育背景', [
      FieldPresets.array('education', '教育经历', {
        itemFields: [
          FieldPresets.text('school', '学校名称', { required: true }),
          FieldPresets.text('degree', '学位', { required: true }),
          FieldPresets.text('major', '专业'),
          FieldPresets.date('graduationDate', '毕业日期'),
          FieldPresets.number('gpa', 'GPA', { min: 0, max: 4, step: 0.01 })
        ]
      })
    ]);
    
    // 技能部分
    builder.addSection('skills', '技能', [
      FieldPresets.array('skills', '技能列表', {
        itemFields: [
          FieldPresets.text('name', '技能名称', { required: true }),
          FieldPresets.select('level', '熟练程度', {
            options: [
              { value: 'beginner', label: '初级' },
              { value: 'intermediate', label: '中级' },
              { value: 'advanced', label: '高级' },
              { value: 'expert', label: '专家' }
            ],
            required: true
          }),
          FieldPresets.text('category', '技能分类')
        ]
      })
    ]);
    
    // 项目经验部分
    builder.addSection('projects', '项目经验', [
      FieldPresets.array('projects', '项目列表', {
        itemFields: [
          FieldPresets.text('name', '项目名称', { required: true }),
          FieldPresets.textarea('description', '项目描述', { rows: 3 }),
          FieldPresets.text('technologies', '使用技术'),
          FieldPresets.text('url', '项目链接'),
          FieldPresets.date('startDate', '开始日期'),
          FieldPresets.date('endDate', '结束日期')
        ]
      })
    ]);
    
    return builder.build();
  }
  
  // 获取表单配置
  getFormConfig(): FormConfig {
    return this.formConfig;
  }
  
  // 切换模板
  switchTemplate(templateId: string): boolean {
    const template = getTemplateById(templateId);
    if (template) {
      this.currentTemplate = template;
      return true;
    }
    return false;
  }
  
  // 获取可用模板列表
  getAvailableTemplates() {
    return getAllTemplates();
  }
  
  // 验证表单数据
  validateFormData(formData: FormData): { isValid: boolean; errors: any[] } {
    return DataEditUtils.validateFormData(formData, this.formConfig);
  }
  
  // 转换表单数据为简历数据
  transformFormDataToResumeData(formData: FormData): ResumeData {
    return {
      personalInfo: {
        fullName: formData.fullName as string || '',
        email: formData.email as string || '',
        phone: formData.phone as string || '',
        location: formData.location as string || '',
        website: formData.website as string || '',
        summary: formData.summary as string || ''
      },
      experience: (formData.workExperience as any[] || []).map(exp => ({
        company: exp.company || '',
        position: exp.position || '',
        startDate: exp.startDate || '',
        endDate: exp.current ? undefined : exp.endDate,
        current: exp.current || false,
        description: exp.description || '',
        location: '',
        achievements: []
      })),
      education: (formData.education as any[] || []).map(edu => ({
        school: edu.school || '',
        degree: edu.degree || '',
        major: edu.major || '',
        graduationDate: edu.graduationDate || '',
        gpa: edu.gpa,
        location: '',
        achievements: []
      })),
      skills: (formData.skills as any[] || []).map(skill => ({
        name: skill.name || '',
        level: skill.level || 'intermediate',
        category: skill.category || 'Other'
      })),
      projects: (formData.projects as any[] || []).map(project => ({
        name: project.name || '',
        description: project.description || '',
        technologies: project.technologies ? project.technologies.split(',').map((t: string) => t.trim()) : [],
        url: project.url || '',
        startDate: project.startDate || '',
        endDate: project.endDate || '',
        achievements: []
      })),
      certifications: [],
      languages: [],
      awards: [],
      publications: [],
      references: []
    };
  }
  
  // 生成样式化简历数据
  async generateStyledResumeData(
    formData: FormData,
    options?: TransformOptions
  ): Promise<{ success: boolean; data?: StyledResumeData; errors?: any[] }> {
    try {
      // 验证表单数据
      const validation = this.validateFormData(formData);
      if (!validation.isValid) {
        return {
          success: false,
          errors: validation.errors
        };
      }
      
      // 转换为简历数据
      const resumeData = this.transformFormDataToResumeData(formData);
      
      // 验证简历数据
      const dataValidation = this.transformer.validateData(resumeData);
      if (!dataValidation.isValid) {
        return {
          success: false,
          errors: dataValidation.errors
        };
      }
      
      // 转换为样式化数据
      const result = await this.transformer.transform(
        resumeData,
        this.currentTemplate.id,
        options
      );
      
      if (result.success && result.data) {
        return {
          success: true,
          data: result.data
        };
      } else {
        return {
          success: false,
          errors: result.errors
        };
      }
    } catch (error) {
      return {
        success: false,
        errors: [{
          code: 'TRANSFORM_ERROR',
          message: error instanceof Error ? error.message : 'Unknown error',
          type: 'processing'
        }]
      };
    }
  }
  
  // 导出PDF
  async exportToPDF(
    formData: FormData,
    exportOptions?: Partial<ExportOptions>,
    transformOptions?: TransformOptions
  ): Promise<ExportResult> {
    try {
      // 生成样式化数据
      const styledDataResult = await this.generateStyledResumeData(formData, transformOptions);
      
      if (!styledDataResult.success || !styledDataResult.data) {
        return {
          success: false,
          errors: styledDataResult.errors || [{
            code: 'DATA_GENERATION_FAILED',
            message: 'Failed to generate styled resume data',
            type: 'processing'
          }]
        };
      }
      
      // 验证导出数据
      const exportValidation = validateResumeData(styledDataResult.data);
      if (!exportValidation.isValid) {
        return {
          success: false,
          errors: exportValidation.errors
        };
      }
      
      // 导出PDF
      const exportResult = await exportToPDF(
        styledDataResult.data,
        { ...ExportPresets.default, ...exportOptions }
      );
      
      return exportResult;
    } catch (error) {
      return {
        success: false,
        errors: [{
          code: 'EXPORT_ERROR',
          message: error instanceof Error ? error.message : 'Unknown export error',
          type: 'processing'
        }]
      };
    }
  }
  
  // 异步导出PDF
  async exportToPDFAsync(
    formData: FormData,
    exportOptions?: Partial<ExportOptions>,
    transformOptions?: TransformOptions
  ): Promise<{ success: boolean; taskId?: string; errors?: any[] }> {
    try {
      // 生成样式化数据
      const styledDataResult = await this.generateStyledResumeData(formData, transformOptions);
      
      if (!styledDataResult.success || !styledDataResult.data) {
        return {
          success: false,
          errors: styledDataResult.errors
        };
      }
      
      // 异步导出PDF
      const taskId = await exportToPDFAsync(
        styledDataResult.data,
        { ...ExportPresets.default, ...exportOptions }
      );
      
      return {
        success: true,
        taskId
      };
    } catch (error) {
      return {
        success: false,
        errors: [{
          code: 'ASYNC_EXPORT_ERROR',
          message: error instanceof Error ? error.message : 'Unknown async export error',
          type: 'processing'
        }]
      };
    }
  }
  
  // 获取导出任务状态
  getExportTaskStatus(taskId: string) {
    return getTaskStatus(taskId);
  }
}

// React 组件示例
export const ResumeEditorComponent: React.FC<{
  onExport?: (result: ExportResult) => void;
  onAsyncExport?: (taskId: string) => void;
  templateId?: string;
}> = ({ onExport, onAsyncExport, templateId = 'modern' }) => {
  const [editor] = React.useState(() => new ResumeEditor(templateId));
  const [formData, setFormData] = React.useState<FormData>({});
  const [isExporting, setIsExporting] = React.useState(false);
  const [exportError, setExportError] = React.useState<string | null>(null);
  
  // 处理表单数据变化
  const handleFormChange = React.useCallback((event: FormEvent) => {
    setFormData(event.data);
    setExportError(null);
  }, []);
  
  // 处理同步导出
  const handleExport = React.useCallback(async () => {
    setIsExporting(true);
    setExportError(null);
    
    try {
      const result = await editor.exportToPDF(formData);
      
      if (result.success) {
        onExport?.(result);
      } else {
        const errorMessage = result.errors?.[0]?.message || 'Export failed';
        setExportError(errorMessage);
      }
    } catch (error) {
      setExportError(error instanceof Error ? error.message : 'Unknown error');
    } finally {
      setIsExporting(false);
    }
  }, [editor, formData, onExport]);
  
  // 处理异步导出
  const handleAsyncExport = React.useCallback(async () => {
    setExportError(null);
    
    try {
      const result = await editor.exportToPDFAsync(formData);
      
      if (result.success && result.taskId) {
        onAsyncExport?.(result.taskId);
      } else {
        const errorMessage = result.errors?.[0]?.message || 'Async export failed';
        setExportError(errorMessage);
      }
    } catch (error) {
      setExportError(error instanceof Error ? error.message : 'Unknown error');
    }
  }, [editor, formData, onAsyncExport]);
  
  return (
    <div className="resume-editor">
      <div className="form-container">
        <DynamicForm
          config={editor.getFormConfig()}
          data={formData}
          onChange={handleFormChange}
        />
      </div>
      
      <div className="export-controls">
        <button
          onClick={handleExport}
          disabled={isExporting}
          className="export-btn"
        >
          {isExporting ? '导出中...' : '导出PDF'}
        </button>
        
        <button
          onClick={handleAsyncExport}
          className="async-export-btn"
        >
          异步导出PDF
        </button>
        
        {exportError && (
          <div className="export-error">
            错误: {exportError}
          </div>
        )}
      </div>
    </div>
  );
};

// 使用示例
export const ExampleUsage = {
  // 基本使用
  basic: async () => {
    const editor = new ResumeEditor('modern');
    
    const sampleFormData: FormData = {
      fullName: '张三',
      email: 'zhangsan@example.com',
      phone: '13800138000',
      summary: '资深前端开发工程师，具有5年React开发经验。',
      workExperience: [
        {
          company: 'ABC科技有限公司',
          position: '高级前端工程师',
          startDate: '2020-01-01',
          endDate: '2023-12-31',
          description: '负责公司主要产品的前端开发工作。'
        }
      ],
      skills: [
        { name: 'React', level: 'advanced', category: 'Frontend' },
        { name: 'TypeScript', level: 'intermediate', category: 'Language' }
      ]
    };
    
    // 导出PDF
    const result = await editor.exportToPDF(sampleFormData);
    
    if (result.success) {
      console.log('PDF导出成功:', result.data);
    } else {
      console.error('PDF导出失败:', result.errors);
    }
  },
  
  // 异步导出
  async: async () => {
    const editor = new ResumeEditor('classic');
    
    const formData: FormData = {
      fullName: '李四',
      email: 'lisi@example.com'
    };
    
    // 异步导出
    const asyncResult = await editor.exportToPDFAsync(formData);
    
    if (asyncResult.success && asyncResult.taskId) {
      console.log('异步导出任务已创建:', asyncResult.taskId);
      
      // 检查任务状态
      const checkStatus = () => {
        const status = editor.getExportTaskStatus(asyncResult.taskId!);
        console.log('任务状态:', status);
        
        if (status?.status === 'completed') {
          console.log('导出完成:', status.result);
        } else if (status?.status === 'failed') {
          console.error('导出失败:', status.error);
        } else {
          // 继续检查
          setTimeout(checkStatus, 1000);
        }
      };
      
      checkStatus();
    }
  },
  
  // 模板切换
  templateSwitching: async () => {
    const editor = new ResumeEditor();
    
    // 获取可用模板
    const templates = editor.getAvailableTemplates();
    console.log('可用模板:', templates.map(t => ({ id: t.id, name: t.name })));
    
    // 切换模板
    const switched = editor.switchTemplate('creative');
    console.log('模板切换结果:', switched);
    
    // 使用新模板导出
    const formData: FormData = { fullName: '王五', email: 'wangwu@example.com' };
    const result = await editor.exportToPDF(formData);
    console.log('使用新模板导出结果:', result.success);
  }
};

// 导出集成类和组件
export default {
  ResumeEditor,
  ResumeEditorComponent,
  ExampleUsage
};