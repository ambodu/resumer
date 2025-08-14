// 数据导出层核心实现

import {
  PDFMakeDocumentDefinition,
  PDFMakeContent,
  PDFMakeStyle,
  PDFMakeTable,
  PDFMakeText,
  ExportOptions,
  ExportResult,
  ExportError,
  ExportWarning,
  PDFGenerator,
  DataConverter,
  StyleConverter,
  PDFRenderer
} from './types';
import { StyledResumeData } from '../data-transform-layer/types';

// 默认导出选项
const DEFAULT_EXPORT_OPTIONS: ExportOptions = {
  format: 'pdf',
  pageSize: 'A4',
  pageOrientation: 'portrait',
  pageMargins: [40, 40, 40, 40],
  compress: true,
  imageQuality: 0.8,
  optimizeForPrint: true,
  metadata: {
    creator: 'Resume Builder',
    title: '简历'
  }
};

// 样式转换器实现
export class ResumeStyleConverter implements StyleConverter {
  convertStyles(styleConfig: any): { [key: string]: PDFMakeStyle } {
    const styles: { [key: string]: PDFMakeStyle } = {
      // 默认样式
      default: {
        fontSize: styleConfig.fonts?.body?.size || 11,
        fontFamily: styleConfig.fonts?.body?.family || 'Helvetica',
        lineHeight: styleConfig.fonts?.body?.lineHeight || 1.4,
        color: styleConfig.colors?.text?.primary || '#1f2937'
      },
      
      // 标题样式
      header: {
        fontSize: styleConfig.fonts?.heading?.size || 16,
        fontFamily: styleConfig.fonts?.heading?.family || 'Helvetica',
        bold: true,
        color: styleConfig.colors?.primary || '#2563eb',
        marginBottom: styleConfig.spacing?.md || 16,
        alignment: 'center'
      },
      
      // 章节标题样式
      sectionTitle: {
        fontSize: (styleConfig.fonts?.heading?.size || 16) - 2,
        fontFamily: styleConfig.fonts?.heading?.family || 'Helvetica',
        bold: true,
        color: styleConfig.colors?.primary || '#2563eb',
        marginTop: styleConfig.spacing?.lg || 24,
        marginBottom: styleConfig.spacing?.sm || 8
      },
      
      // 子标题样式
      subheader: {
        fontSize: (styleConfig.fonts?.body?.size || 11) + 1,
        fontFamily: styleConfig.fonts?.body?.family || 'Helvetica',
        bold: true,
        color: styleConfig.colors?.text?.primary || '#1f2937',
        marginBottom: styleConfig.spacing?.xs || 4
      },
      
      // 正文样式
      body: {
        fontSize: styleConfig.fonts?.body?.size || 11,
        fontFamily: styleConfig.fonts?.body?.family || 'Helvetica',
        lineHeight: styleConfig.fonts?.body?.lineHeight || 1.4,
        color: styleConfig.colors?.text?.primary || '#1f2937',
        marginBottom: styleConfig.spacing?.xs || 4
      },
      
      // 小字体样式
      caption: {
        fontSize: styleConfig.fonts?.caption?.size || 9,
        fontFamily: styleConfig.fonts?.caption?.family || 'Helvetica',
        color: styleConfig.colors?.text?.secondary || '#6b7280',
        lineHeight: styleConfig.fonts?.caption?.lineHeight || 1.3
      },
      
      // 强调样式
      emphasis: {
        fontSize: styleConfig.fonts?.body?.size || 11,
        fontFamily: styleConfig.fonts?.body?.family || 'Helvetica',
        bold: true,
        color: styleConfig.colors?.text?.primary || '#1f2937'
      },
      
      // 链接样式
      link: {
        fontSize: styleConfig.fonts?.body?.size || 11,
        fontFamily: styleConfig.fonts?.body?.family || 'Helvetica',
        color: styleConfig.colors?.accent || '#0ea5e9',
        decoration: 'underline'
      },
      
      // 列表样式
      listItem: {
        fontSize: styleConfig.fonts?.body?.size || 11,
        fontFamily: styleConfig.fonts?.body?.family || 'Helvetica',
        lineHeight: styleConfig.fonts?.body?.lineHeight || 1.4,
        color: styleConfig.colors?.text?.primary || '#1f2937',
        marginBottom: styleConfig.spacing?.xs || 4
      },
      
      // 表格标题样式
      tableHeader: {
        fontSize: styleConfig.fonts?.body?.size || 11,
        fontFamily: styleConfig.fonts?.body?.family || 'Helvetica',
        bold: true,
        color: styleConfig.colors?.text?.primary || '#1f2937',
        fillColor: styleConfig.colors?.background?.secondary || '#f8fafc'
      },
      
      // 表格单元格样式
      tableCell: {
        fontSize: styleConfig.fonts?.body?.size || 11,
        fontFamily: styleConfig.fonts?.body?.family || 'Helvetica',
        color: styleConfig.colors?.text?.primary || '#1f2937'
      },
      
      // 分割线样式
      divider: {
        marginTop: styleConfig.spacing?.md || 16,
        marginBottom: styleConfig.spacing?.md || 16
      }
    };
    
    return styles;
  }
  
  convertFontConfig(fontConfig: any): PDFMakeStyle {
    return {
      fontSize: fontConfig.size,
      fontFamily: fontConfig.family,
      bold: fontConfig.weight === 'bold',
      italics: fontConfig.style === 'italic',
      lineHeight: fontConfig.lineHeight
    };
  }
  
  convertColorConfig(colorConfig: any): { [key: string]: string } {
    return {
      primary: colorConfig.primary || '#2563eb',
      secondary: colorConfig.secondary || '#64748b',
      accent: colorConfig.accent || '#0ea5e9',
      textPrimary: colorConfig.text?.primary || '#1f2937',
      textSecondary: colorConfig.text?.secondary || '#6b7280',
      textMuted: colorConfig.text?.muted || '#9ca3af',
      backgroundPrimary: colorConfig.background?.primary || '#ffffff',
      backgroundSecondary: colorConfig.background?.secondary || '#f8fafc',
      borderLight: colorConfig.border?.light || '#e5e7eb',
      borderMedium: colorConfig.border?.medium || '#d1d5db'
    };
  }
  
  convertSpacingConfig(spacingConfig: any): { [key: string]: number } {
    return {
      xs: spacingConfig.xs || 4,
      sm: spacingConfig.sm || 8,
      md: spacingConfig.md || 16,
      lg: spacingConfig.lg || 24,
      xl: spacingConfig.xl || 32,
      xxl: spacingConfig.xxl || 48
    };
  }
  
  convertLayoutConfig(layoutConfig: any): Partial<PDFMakeDocumentDefinition> {
    return {
      pageSize: layoutConfig.pageSize || 'A4',
      pageOrientation: layoutConfig.orientation || 'portrait',
      pageMargins: [
        layoutConfig.margins?.left || 40,
        layoutConfig.margins?.top || 40,
        layoutConfig.margins?.right || 40,
        layoutConfig.margins?.bottom || 40
      ]
    };
  }
}

// 数据转换器实现
export class ResumeDataConverter implements DataConverter {
  private styleConverter: StyleConverter;
  
  constructor(styleConverter: StyleConverter) {
    this.styleConverter = styleConverter;
  }
  
  convertToPDFMake(data: StyledResumeData, options?: ExportOptions): PDFMakeDocumentDefinition {
    const styles = this.styleConverter.convertStyles(data.styleConfig);
    const layoutConfig = this.styleConverter.convertLayoutConfig(data.styleConfig?.layout);
    
    const content: PDFMakeContent[] = [];
    
    // 添加个人信息
    if (data.personalInfo) {
      content.push(...this.convertPersonalInfo(data.personalInfo));
    }
    
    // 添加个人简介
    if (data.summary) {
      content.push(
        { text: '个人简介', style: 'sectionTitle' },
        { text: data.summary, style: 'body', marginBottom: 16 }
      );
    }
    
    // 添加工作经历
    if (data.experience && data.experience.length > 0) {
      content.push(...this.convertExperience(data.experience));
    }
    
    // 添加教育背景
    if (data.education && data.education.length > 0) {
      content.push(...this.convertEducation(data.education));
    }
    
    // 添加技能
    if (data.skills && data.skills.length > 0) {
      content.push(...this.convertSkills(data.skills));
    }
    
    // 添加项目经历
    if (data.projects && data.projects.length > 0) {
      content.push(...this.convertProjects(data.projects));
    }
    
    // 添加证书
    if (data.certifications && data.certifications.length > 0) {
      content.push(...this.convertCertifications(data.certifications));
    }
    
    // 添加语言能力
    if (data.languages && data.languages.length > 0) {
      content.push(...this.convertLanguages(data.languages));
    }
    
    return {
      content,
      styles,
      defaultStyle: styles.default,
      ...layoutConfig,
      info: {
        title: `${data.personalInfo?.name || '简历'}`,
        author: data.personalInfo?.name || '',
        subject: '个人简历',
        creator: options?.metadata?.creator || 'Resume Builder',
        creationDate: new Date()
      }
    };
  }
  
  convertPersonalInfo(data: StyledResumeData['personalInfo']): PDFMakeContent[] {
    if (!data) return [];
    
    const content: PDFMakeContent[] = [];
    
    // 姓名
    if (data.name) {
      content.push({
        text: data.name,
        style: 'header',
        alignment: 'center',
        marginBottom: 8
      });
    }
    
    // 职位
    if (data.title) {
      content.push({
        text: data.title,
        style: 'subheader',
        alignment: 'center',
        marginBottom: 16
      });
    }
    
    // 联系信息
    const contactInfo: string[] = [];
    if (data.email) contactInfo.push(`邮箱: ${data.email}`);
    if (data.phone) contactInfo.push(`电话: ${data.phone}`);
    if (data.location) contactInfo.push(`地址: ${data.location}`);
    if (data.website) contactInfo.push(`网站: ${data.website}`);
    if (data.linkedin) contactInfo.push(`LinkedIn: ${data.linkedin}`);
    if (data.github) contactInfo.push(`GitHub: ${data.github}`);
    
    if (contactInfo.length > 0) {
      content.push({
        text: contactInfo.join(' | '),
        style: 'caption',
        alignment: 'center',
        marginBottom: 20
      });
    }
    
    return content;
  }
  
  convertExperience(data: StyledResumeData['experience']): PDFMakeContent[] {
    if (!data || data.length === 0) return [];
    
    const content: PDFMakeContent[] = [
      { text: '工作经历', style: 'sectionTitle' }
    ];
    
    data.forEach((exp, index) => {
      // 公司和职位
      content.push({
        columns: [
          {
            text: `${exp.position} - ${exp.company}`,
            style: 'subheader',
            width: '*'
          },
          {
            text: exp.duration || this.formatDateRange(exp.startDate, exp.endDate),
            style: 'caption',
            alignment: 'right',
            width: 'auto'
          }
        ],
        marginBottom: 4
      });
      
      // 地点
      if (exp.location) {
        content.push({
          text: exp.location,
          style: 'caption',
          marginBottom: 8
        });
      }
      
      // 工作描述
      if (exp.description) {
        if (Array.isArray(exp.description)) {
          content.push({
            ul: exp.description.map(item => ({ text: item, style: 'listItem' })),
            marginBottom: index < data.length - 1 ? 16 : 0
          });
        } else {
          content.push({
            text: exp.description,
            style: 'body',
            marginBottom: index < data.length - 1 ? 16 : 0
          });
        }
      }
      
      // 技能标签
      if (exp.skills && exp.skills.length > 0) {
        content.push({
          text: `技能: ${exp.skills.join(', ')}`,
          style: 'caption',
          marginBottom: index < data.length - 1 ? 16 : 0
        });
      }
    });
    
    return content;
  }
  
  convertEducation(data: StyledResumeData['education']): PDFMakeContent[] {
    if (!data || data.length === 0) return [];
    
    const content: PDFMakeContent[] = [
      { text: '教育背景', style: 'sectionTitle' }
    ];
    
    data.forEach((edu, index) => {
      // 学校和学位
      content.push({
        columns: [
          {
            text: `${edu.degree} - ${edu.school}`,
            style: 'subheader',
            width: '*'
          },
          {
            text: edu.duration || this.formatDateRange(edu.startDate, edu.endDate),
            style: 'caption',
            alignment: 'right',
            width: 'auto'
          }
        ],
        marginBottom: 4
      });
      
      // 专业
      if (edu.major) {
        content.push({
          text: `专业: ${edu.major}`,
          style: 'body',
          marginBottom: 4
        });
      }
      
      // GPA
      if (edu.gpa) {
        content.push({
          text: `GPA: ${edu.gpa}`,
          style: 'body',
          marginBottom: 4
        });
      }
      
      // 描述
      if (edu.description) {
        content.push({
          text: edu.description,
          style: 'body',
          marginBottom: index < data.length - 1 ? 16 : 0
        });
      }
    });
    
    return content;
  }
  
  convertSkills(data: StyledResumeData['skills']): PDFMakeContent[] {
    if (!data || data.length === 0) return [];
    
    const content: PDFMakeContent[] = [
      { text: '技能', style: 'sectionTitle' }
    ];
    
    // 按分类分组技能
    const groupedSkills = new Map<string, typeof data>();
    data.forEach(skill => {
      const category = skill.category || '其他';
      if (!groupedSkills.has(category)) {
        groupedSkills.set(category, []);
      }
      groupedSkills.get(category)!.push(skill);
    });
    
    // 渲染分组的技能
    Array.from(groupedSkills.entries()).forEach(([category, skills], groupIndex) => {
      if (groupedSkills.size > 1) {
        content.push({
          text: category,
          style: 'emphasis',
          marginBottom: 4
        });
      }
      
      const skillTexts = skills.map(skill => {
        let text = skill.name;
        if (skill.level) {
          const levelText = this.getLevelText(skill.level);
          text += ` (${levelText})`;
        }
        return text;
      });
      
      content.push({
        text: skillTexts.join(', '),
        style: 'body',
        marginBottom: groupIndex < groupedSkills.size - 1 ? 12 : 0
      });
    });
    
    return content;
  }
  
  convertProjects(data: StyledResumeData['projects']): PDFMakeContent[] {
    if (!data || data.length === 0) return [];
    
    const content: PDFMakeContent[] = [
      { text: '项目经历', style: 'sectionTitle' }
    ];
    
    data.forEach((project, index) => {
      // 项目名称和时间
      content.push({
        columns: [
          {
            text: project.name,
            style: 'subheader',
            width: '*'
          },
          {
            text: project.duration || this.formatDateRange(project.startDate, project.endDate),
            style: 'caption',
            alignment: 'right',
            width: 'auto'
          }
        ],
        marginBottom: 4
      });
      
      // 项目链接
      if (project.url) {
        content.push({
          text: `项目链接: ${project.url}`,
          style: 'link',
          marginBottom: 4
        });
      }
      
      // 项目描述
      if (project.description) {
        if (Array.isArray(project.description)) {
          content.push({
            ul: project.description.map(item => ({ text: item, style: 'listItem' })),
            marginBottom: 8
          });
        } else {
          content.push({
            text: project.description,
            style: 'body',
            marginBottom: 8
          });
        }
      }
      
      // 使用的技术
      if (project.technologies && project.technologies.length > 0) {
        content.push({
          text: `技术栈: ${project.technologies.join(', ')}`,
          style: 'caption',
          marginBottom: index < data.length - 1 ? 16 : 0
        });
      }
    });
    
    return content;
  }
  
  convertCertifications(data: any[]): PDFMakeContent[] {
    if (!data || data.length === 0) return [];
    
    const content: PDFMakeContent[] = [
      { text: '证书', style: 'sectionTitle' }
    ];
    
    data.forEach((cert, index) => {
      content.push({
        columns: [
          {
            text: `${cert.name} - ${cert.issuer}`,
            style: 'subheader',
            width: '*'
          },
          {
            text: cert.date || cert.year,
            style: 'caption',
            alignment: 'right',
            width: 'auto'
          }
        ],
        marginBottom: index < data.length - 1 ? 8 : 0
      });
    });
    
    return content;
  }
  
  convertLanguages(data: any[]): PDFMakeContent[] {
    if (!data || data.length === 0) return [];
    
    const content: PDFMakeContent[] = [
      { text: '语言能力', style: 'sectionTitle' }
    ];
    
    const languageTexts = data.map(lang => {
      let text = lang.name;
      if (lang.level) {
        text += ` (${lang.level})`;
      }
      return text;
    });
    
    content.push({
      text: languageTexts.join(', '),
      style: 'body'
    });
    
    return content;
  }
  
  convertCustomSection(data: any): PDFMakeContent[] {
    if (!data) return [];
    
    const content: PDFMakeContent[] = [];
    
    if (data.title) {
      content.push({ text: data.title, style: 'sectionTitle' });
    }
    
    if (data.content) {
      if (Array.isArray(data.content)) {
        content.push({
          ul: data.content.map((item: string) => ({ text: item, style: 'listItem' }))
        });
      } else {
        content.push({ text: data.content, style: 'body' });
      }
    }
    
    return content;
  }
  
  private formatDateRange(startDate?: Date | string, endDate?: Date | string): string {
    const formatDate = (date: Date | string) => {
      if (!date) return '';
      const d = typeof date === 'string' ? new Date(date) : date;
      return d.toLocaleDateString('zh-CN', { year: 'numeric', month: '2-digit' });
    };
    
    const start = formatDate(startDate);
    const end = endDate ? formatDate(endDate) : '至今';
    
    return start && end ? `${start} - ${end}` : start || end || '';
  }
  
  private getLevelText(level: number): string {
    const levelMap: { [key: number]: string } = {
      1: '入门',
      2: '初级',
      3: '中级',
      4: '高级',
      5: '专家'
    };
    return levelMap[level] || '未知';
  }
}

// PDF 渲染器实现
export class ResumePDFRenderer implements PDFRenderer {
  private pdfMake: any;
  
  constructor() {
    this.initializePdfMake();
  }
  
  private async initializePdfMake(): Promise<void> {
    if (typeof window !== 'undefined') {
      try {
        const pdfMakeModule = await import('pdfmake/build/pdfmake');
        const vfsFontsModule = await import('pdfmake/build/vfs_fonts');
        
        this.pdfMake = pdfMakeModule.default;
        this.pdfMake.vfs = vfsFontsModule.default.pdfMake.vfs;
      } catch (error) {
        throw new Error('Failed to initialize pdfMake: ' + error);
      }
    }
  }
  
  async render(definition: PDFMakeDocumentDefinition, options?: ExportOptions): Promise<ExportResult> {
    const startTime = Date.now();
    
    try {
      await this.initializePdfMake();
      
      if (!this.pdfMake) {
        throw new Error('PDFMake not initialized');
      }
      
      const result = await this.renderToBlob(definition, options);
      const endTime = Date.now();
      
      return {
        success: true,
        data: result,
        filename: options?.filename || 'resume.pdf',
        size: result.size,
        performance: {
          startTime,
          endTime,
          duration: endTime - startTime
        }
      };
    } catch (error) {
      const endTime = Date.now();
      
      return {
        success: false,
        errors: [{
          code: 'RENDER_ERROR',
          message: error instanceof Error ? error.message : 'Unknown render error',
          type: 'rendering',
          stack: error instanceof Error ? error.stack : undefined
        }],
        performance: {
          startTime,
          endTime,
          duration: endTime - startTime
        }
      };
    }
  }
  
  async renderToBlob(definition: PDFMakeDocumentDefinition, options?: ExportOptions): Promise<Blob> {
    await this.initializePdfMake();
    
    return new Promise((resolve, reject) => {
      try {
        const pdfDoc = this.pdfMake.createPdf(definition);
        pdfDoc.getBlob((blob: Blob) => {
          resolve(blob);
        });
      } catch (error) {
        reject(error);
      }
    });
  }
  
  async renderToBase64(definition: PDFMakeDocumentDefinition, options?: ExportOptions): Promise<string> {
    await this.initializePdfMake();
    
    return new Promise((resolve, reject) => {
      try {
        const pdfDoc = this.pdfMake.createPdf(definition);
        pdfDoc.getBase64((base64: string) => {
          resolve(base64);
        });
      } catch (error) {
        reject(error);
      }
    });
  }
  
  async renderToBuffer(definition: PDFMakeDocumentDefinition, options?: ExportOptions): Promise<Buffer> {
    await this.initializePdfMake();
    
    return new Promise((resolve, reject) => {
      try {
        const pdfDoc = this.pdfMake.createPdf(definition);
        pdfDoc.getBuffer((buffer: Buffer) => {
          resolve(buffer);
        });
      } catch (error) {
        reject(error);
      }
    });
  }
  
  async getPageInfo(definition: PDFMakeDocumentDefinition): Promise<{ pageCount: number; pageSize: any }> {
    // 这是一个简化的实现，实际可能需要更复杂的逻辑
    return {
      pageCount: 1, // 简化假设
      pageSize: definition.pageSize || 'A4'
    };
  }
}

// 主 PDF 生成器实现
export class ResumePDFGenerator implements PDFGenerator {
  private dataConverter: DataConverter;
  private styleConverter: StyleConverter;
  private renderer: PDFRenderer;
  
  constructor() {
    this.styleConverter = new ResumeStyleConverter();
    this.dataConverter = new ResumeDataConverter(this.styleConverter);
    this.renderer = new ResumePDFRenderer();
  }
  
  async generatePDF(data: StyledResumeData, options?: ExportOptions): Promise<ExportResult> {
    const mergedOptions = { ...DEFAULT_EXPORT_OPTIONS, ...options };
    
    try {
      // 验证数据
      const validation = this.validateData(data);
      if (!validation.isValid) {
        return {
          success: false,
          errors: validation.errors,
          warnings: validation.warnings
        };
      }
      
      // 转换为 PDFMake 文档定义
      const definition = this.dataConverter.convertToPDFMake(data, mergedOptions);
      
      // 渲染 PDF
      const result = await this.renderer.render(definition, mergedOptions);
      
      // 添加验证警告
      if (validation.warnings.length > 0) {
        result.warnings = [...(result.warnings || []), ...validation.warnings];
      }
      
      return result;
    } catch (error) {
      return {
        success: false,
        errors: [{
          code: 'GENERATION_ERROR',
          message: error instanceof Error ? error.message : 'Unknown generation error',
          type: 'processing',
          stack: error instanceof Error ? error.stack : undefined
        }]
      };
    }
  }
  
  async generatePDFBlob(data: StyledResumeData, options?: ExportOptions): Promise<Blob> {
    const result = await this.generatePDF(data, { ...options, format: 'blob' });
    
    if (!result.success || !result.data) {
      throw new Error(result.errors?.[0]?.message || 'Failed to generate PDF blob');
    }
    
    return result.data as Blob;
  }
  
  async generatePDFBase64(data: StyledResumeData, options?: ExportOptions): Promise<string> {
    const mergedOptions = { ...DEFAULT_EXPORT_OPTIONS, ...options };
    const definition = this.dataConverter.convertToPDFMake(data, mergedOptions);
    return this.renderer.renderToBase64(definition, mergedOptions);
  }
  
  async generatePDFBuffer(data: StyledResumeData, options?: ExportOptions): Promise<Buffer> {
    const mergedOptions = { ...DEFAULT_EXPORT_OPTIONS, ...options };
    const definition = this.dataConverter.convertToPDFMake(data, mergedOptions);
    return this.renderer.renderToBuffer(definition, mergedOptions);
  }
  
  async previewPDF(data: StyledResumeData, options?: ExportOptions): Promise<string> {
    const base64 = await this.generatePDFBase64(data, options);
    return `data:application/pdf;base64,${base64}`;
  }
  
  validateData(data: StyledResumeData): { isValid: boolean; errors: ExportError[]; warnings: ExportWarning[] } {
    const errors: ExportError[] = [];
    const warnings: ExportWarning[] = [];
    
    // 验证必需字段
    if (!data.personalInfo?.name) {
      errors.push({
        code: 'MISSING_NAME',
        message: '姓名是必填字段',
        type: 'validation'
      });
    }
    
    if (!data.personalInfo?.email) {
      errors.push({
        code: 'MISSING_EMAIL',
        message: '邮箱是必填字段',
        type: 'validation'
      });
    }
    
    // 验证邮箱格式
    if (data.personalInfo?.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.personalInfo.email)) {
      errors.push({
        code: 'INVALID_EMAIL',
        message: '邮箱格式不正确',
        type: 'validation'
      });
    }
    
    // 检查内容完整性
    if (!data.experience || data.experience.length === 0) {
      warnings.push({
        code: 'NO_EXPERIENCE',
        message: '建议添加工作经历',
        type: 'formatting'
      });
    }
    
    if (!data.education || data.education.length === 0) {
      warnings.push({
        code: 'NO_EDUCATION',
        message: '建议添加教育背景',
        type: 'formatting'
      });
    }
    
    if (!data.skills || data.skills.length === 0) {
      warnings.push({
        code: 'NO_SKILLS',
        message: '建议添加技能信息',
        type: 'formatting'
      });
    }
    
    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
  }
  
  getSupportedOptions(): Partial<ExportOptions> {
    return {
      format: 'pdf',
      pageSize: 'A4',
      pageOrientation: 'portrait',
      compress: true,
      optimizeForPrint: true
    };
  }
}