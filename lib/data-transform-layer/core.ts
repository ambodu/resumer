// 数据中间层核心功能

import {
  ResumeData,
  ResumeTemplate,
  StyledResumeData,
  StyledSection,
  StyledContent,
  TransformOptions,
  TransformResult,
  TransformError,
  TransformWarning,
  SectionType,
  StyleConfig,
  TemplateValidationResult,
  DataValidationResult,
  ResumeMetadata,
  StyledPersonalInfoContent,
  StyledListContent,
  StyledTextContent,
  StyledListItem,
  PersonalInfo,
  WorkExperience,
  Education,
  Skill,
  Project
} from './types';

// 数据转换器
export class ResumeDataTransformer {
  private templates: Map<string, ResumeTemplate> = new Map();
  private validators: Map<string, (data: any) => boolean> = new Map();

  // 注册模板
  registerTemplate(template: ResumeTemplate): void {
    const validationResult = this.validateTemplate(template);
    if (!validationResult.isValid) {
      throw new Error(`模板验证失败: ${validationResult.errors.join(', ')}`);
    }
    this.templates.set(template.id, template);
  }

  // 获取模板
  getTemplate(templateId: string): ResumeTemplate | undefined {
    return this.templates.get(templateId);
  }

  // 获取所有模板
  getAllTemplates(): ResumeTemplate[] {
    return Array.from(this.templates.values());
  }

  // 验证模板
  validateTemplate(template: ResumeTemplate): TemplateValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    // 基本字段验证
    if (!template.id) errors.push('模板ID不能为空');
    if (!template.name) errors.push('模板名称不能为空');
    if (!template.styleConfig) errors.push('样式配置不能为空');
    if (!template.layoutConfig) errors.push('布局配置不能为空');
    if (!template.sectionOrder || template.sectionOrder.length === 0) {
      errors.push('章节顺序不能为空');
    }

    // 样式配置验证
    if (template.styleConfig) {
      if (!template.styleConfig.fonts) errors.push('字体配置不能为空');
      if (!template.styleConfig.colors) errors.push('颜色配置不能为空');
      if (!template.styleConfig.spacing) errors.push('间距配置不能为空');
    }

    // 布局配置验证
    if (template.layoutConfig) {
      const validTypes = ['single-column', 'two-column', 'three-column', 'sidebar'];
      if (!validTypes.includes(template.layoutConfig.type)) {
        errors.push('无效的布局类型');
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
  }

  // 验证简历数据
  validateResumeData(data: ResumeData): DataValidationResult {
    const missingRequired: string[] = [];
    const invalidFields: { field: string; reason: string }[] = [];
    const suggestions: string[] = [];

    // 验证个人信息
    if (!data.personalInfo) {
      missingRequired.push('personalInfo');
    } else {
      if (!data.personalInfo.fullName) missingRequired.push('personalInfo.fullName');
      if (!data.personalInfo.email) missingRequired.push('personalInfo.email');
      if (!data.personalInfo.phone) missingRequired.push('personalInfo.phone');
      
      // 邮箱格式验证
      if (data.personalInfo.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.personalInfo.email)) {
        invalidFields.push({ field: 'personalInfo.email', reason: '邮箱格式不正确' });
      }
    }

    // 验证工作经历
    if (data.experience && data.experience.length > 0) {
      data.experience.forEach((exp, index) => {
        if (!exp.company) missingRequired.push(`experience[${index}].company`);
        if (!exp.position) missingRequired.push(`experience[${index}].position`);
        if (!exp.startDate) missingRequired.push(`experience[${index}].startDate`);
      });
    } else {
      suggestions.push('建议添加至少一项工作经历');
    }

    // 验证教育经历
    if (data.education && data.education.length > 0) {
      data.education.forEach((edu, index) => {
        if (!edu.school) missingRequired.push(`education[${index}].school`);
        if (!edu.degree) missingRequired.push(`education[${index}].degree`);
        if (!edu.major) missingRequired.push(`education[${index}].major`);
      });
    } else {
      suggestions.push('建议添加至少一项教育经历');
    }

    // 验证技能
    if (!data.skills || data.skills.length === 0) {
      suggestions.push('建议添加技能信息');
    }

    return {
      isValid: missingRequired.length === 0 && invalidFields.length === 0,
      missingRequired,
      invalidFields,
      suggestions
    };
  }

  // 转换简历数据
  transform(data: ResumeData, options: TransformOptions): TransformResult {
    const errors: TransformError[] = [];
    const warnings: TransformWarning[] = [];

    try {
      // 验证模板
      const templateValidation = this.validateTemplate(options.template);
      if (!templateValidation.isValid) {
        templateValidation.errors.forEach(error => {
          errors.push({
            code: 'TEMPLATE_VALIDATION_ERROR',
            message: error,
            severity: 'error'
          });
        });
        return { success: false, errors, warnings };
      }

      // 验证数据
      const dataValidation = this.validateResumeData(data);
      if (!dataValidation.isValid) {
        dataValidation.missingRequired.forEach(field => {
          errors.push({
            code: 'MISSING_REQUIRED_FIELD',
            message: `缺少必填字段: ${field}`,
            field,
            severity: 'error'
          });
        });
        
        dataValidation.invalidFields.forEach(({ field, reason }) => {
          errors.push({
            code: 'INVALID_FIELD',
            message: `字段验证失败: ${field} - ${reason}`,
            field,
            severity: 'error'
          });
        });
      }

      // 添加建议作为警告
      dataValidation.suggestions.forEach(suggestion => {
        warnings.push({
          code: 'DATA_SUGGESTION',
          message: suggestion,
          severity: 'warning'
        });
      });

      // 如果有严重错误，停止转换
      if (errors.length > 0) {
        return { success: false, errors, warnings };
      }

      // 执行转换
      const styledData = this.performTransform(data, options);
      
      return {
        success: true,
        data: styledData,
        errors,
        warnings
      };
    } catch (error) {
      errors.push({
        code: 'TRANSFORM_ERROR',
        message: `转换过程中发生错误: ${error instanceof Error ? error.message : String(error)}`,
        severity: 'error'
      });
      
      return { success: false, errors, warnings };
    }
  }

  // 执行实际转换
  private performTransform(data: ResumeData, options: TransformOptions): StyledResumeData {
    const { template } = options;
    const styledSections: StyledSection[] = [];

    // 确定章节顺序
    const sectionOrder = options.customSectionOrder || template.sectionOrder;

    // 转换每个章节
    sectionOrder.forEach((sectionId, index) => {
      const section = this.transformSection(sectionId, data, template, options);
      if (section && (options.includeEmptySections || this.hasContent(section.content))) {
        section.order = index;
        styledSections.push(section);
      }
    });

    // 创建元数据
    const metadata: ResumeMetadata = {
      createdAt: new Date(),
      updatedAt: new Date(),
      version: '1.0.0',
      author: data.personalInfo.fullName,
      title: `${data.personalInfo.fullName} - 简历`,
      tags: this.generateTags(data),
      language: options.locale || 'zh-CN',
      pageCount: 1, // 将在PDF生成时计算
      wordCount: this.calculateWordCount(styledSections)
    };

    return {
      template,
      data,
      styledSections,
      metadata
    };
  }

  // 转换单个章节
  private transformSection(
    sectionId: string, 
    data: ResumeData, 
    template: ResumeTemplate,
    options: TransformOptions
  ): StyledSection | null {
    const sectionType = sectionId as SectionType;
    const sectionStyle = template.styleConfig.components.section;

    switch (sectionType) {
      case 'personal-info':
        return this.transformPersonalInfoSection(data.personalInfo, template, sectionStyle);
      
      case 'summary':
        return this.transformSummarySection(data.personalInfo.summary, template, sectionStyle);
      
      case 'experience':
        return this.transformExperienceSection(data.experience, template, sectionStyle);
      
      case 'education':
        return this.transformEducationSection(data.education, template, sectionStyle);
      
      case 'skills':
        return this.transformSkillsSection(data.skills, template, sectionStyle);
      
      case 'projects':
        return this.transformProjectsSection(data.projects, template, sectionStyle);
      
      case 'languages':
        return this.transformLanguagesSection(data.languages, template, sectionStyle);
      
      case 'certifications':
        return this.transformCertificationsSection(data.certifications, template, sectionStyle);
      
      case 'awards':
        return this.transformAwardsSection(data.awards, template, sectionStyle);
      
      case 'references':
        return this.transformReferencesSection(data.references, template, sectionStyle);
      
      default:
        return null;
    }
  }

  // 转换个人信息章节
  private transformPersonalInfoSection(
    personalInfo: PersonalInfo,
    template: ResumeTemplate,
    sectionStyle: any
  ): StyledSection {
    const content: StyledPersonalInfoContent = {
      type: 'personal-info',
      layout: 'horizontal',
      fields: [
        {
          key: 'fullName',
          label: '姓名',
          value: personalInfo.fullName,
          style: template.styleConfig.fonts.heading,
          visible: true
        },
        {
          key: 'email',
          label: '邮箱',
          value: personalInfo.email,
          icon: 'email',
          style: template.styleConfig.fonts.body,
          visible: true
        },
        {
          key: 'phone',
          label: '电话',
          value: personalInfo.phone,
          icon: 'phone',
          style: template.styleConfig.fonts.body,
          visible: true
        },
        {
          key: 'address',
          label: '地址',
          value: personalInfo.address || '',
          icon: 'location',
          style: template.styleConfig.fonts.body,
          visible: !!personalInfo.address
        },
        {
          key: 'website',
          label: '网站',
          value: personalInfo.website || '',
          icon: 'website',
          style: template.styleConfig.fonts.body,
          visible: !!personalInfo.website
        }
      ],
      style: template.styleConfig.components
    };

    return {
      id: 'personal-info',
      type: 'personal-info',
      title: '个人信息',
      content,
      style: sectionStyle,
      visible: true,
      order: 0
    };
  }

  // 转换摘要章节
  private transformSummarySection(
    summary: string | undefined,
    template: ResumeTemplate,
    sectionStyle: any
  ): StyledSection | null {
    if (!summary) return null;

    const content: StyledTextContent = {
      type: 'text',
      text: summary,
      style: {
        font: template.styleConfig.fonts.body,
        color: template.styleConfig.colors.text.primary,
        alignment: 'left'
      }
    };

    return {
      id: 'summary',
      type: 'summary',
      title: '个人简介',
      content,
      style: sectionStyle,
      visible: true,
      order: 1
    };
  }

  // 转换工作经历章节
  private transformExperienceSection(
    experience: WorkExperience[],
    template: ResumeTemplate,
    sectionStyle: any
  ): StyledSection | null {
    if (!experience || experience.length === 0) return null;

    const items: StyledListItem[] = experience.map((exp, index) => {
      const dateRange = this.formatDateRange(exp.startDate, exp.endDate, exp.current);
      const content = `${exp.position} | ${exp.company} | ${dateRange}`;
      
      return {
        id: exp.id || `exp-${index}`,
        content: {
          type: 'text',
          text: content,
          style: {
            font: template.styleConfig.fonts.body,
            color: template.styleConfig.colors.text.primary,
            alignment: 'left'
          }
        },
        level: 0
      };
    });

    const content: StyledListContent = {
      type: 'list',
      items,
      style: template.styleConfig.components.list
    };

    return {
      id: 'experience',
      type: 'experience',
      title: '工作经历',
      content,
      style: sectionStyle,
      visible: true,
      order: 2
    };
  }

  // 转换教育经历章节
  private transformEducationSection(
    education: Education[],
    template: ResumeTemplate,
    sectionStyle: any
  ): StyledSection | null {
    if (!education || education.length === 0) return null;

    const items: StyledListItem[] = education.map((edu, index) => {
      const dateRange = this.formatDateRange(edu.startDate, edu.endDate, edu.current);
      const content = `${edu.degree} ${edu.major} | ${edu.school} | ${dateRange}`;
      
      return {
        id: edu.id || `edu-${index}`,
        content: {
          type: 'text',
          text: content,
          style: {
            font: template.styleConfig.fonts.body,
            color: template.styleConfig.colors.text.primary,
            alignment: 'left'
          }
        },
        level: 0
      };
    });

    const content: StyledListContent = {
      type: 'list',
      items,
      style: template.styleConfig.components.list
    };

    return {
      id: 'education',
      type: 'education',
      title: '教育经历',
      content,
      style: sectionStyle,
      visible: true,
      order: 3
    };
  }

  // 转换技能章节
  private transformSkillsSection(
    skills: Skill[],
    template: ResumeTemplate,
    sectionStyle: any
  ): StyledSection | null {
    if (!skills || skills.length === 0) return null;

    const items: StyledListItem[] = skills.map((skill, index) => {
      const levelText = this.formatSkillLevel(skill.level);
      const content = `${skill.name} (${levelText})`;
      
      return {
        id: skill.id || `skill-${index}`,
        content: {
          type: 'text',
          text: content,
          style: {
            font: template.styleConfig.fonts.body,
            color: template.styleConfig.colors.text.primary,
            alignment: 'left'
          }
        },
        level: 0
      };
    });

    const content: StyledListContent = {
      type: 'list',
      items,
      style: template.styleConfig.components.list
    };

    return {
      id: 'skills',
      type: 'skills',
      title: '技能',
      content,
      style: sectionStyle,
      visible: true,
      order: 4
    };
  }

  // 转换项目经历章节
  private transformProjectsSection(
    projects: Project[],
    template: ResumeTemplate,
    sectionStyle: any
  ): StyledSection | null {
    if (!projects || projects.length === 0) return null;

    const items: StyledListItem[] = projects.map((project, index) => {
      const dateRange = this.formatDateRange(project.startDate, project.endDate, project.current);
      const content = `${project.name} | ${project.role} | ${dateRange}`;
      
      return {
        id: project.id || `project-${index}`,
        content: {
          type: 'text',
          text: content,
          style: {
            font: template.styleConfig.fonts.body,
            color: template.styleConfig.colors.text.primary,
            alignment: 'left'
          }
        },
        level: 0
      };
    });

    const content: StyledListContent = {
      type: 'list',
      items,
      style: template.styleConfig.components.list
    };

    return {
      id: 'projects',
      type: 'projects',
      title: '项目经历',
      content,
      style: sectionStyle,
      visible: true,
      order: 5
    };
  }

  // 转换语言章节
  private transformLanguagesSection(
    languages: any[] | undefined,
    template: ResumeTemplate,
    sectionStyle: any
  ): StyledSection | null {
    if (!languages || languages.length === 0) return null;

    const items: StyledListItem[] = languages.map((lang, index) => {
      const content = `${lang.name} (${lang.level})`;
      
      return {
        id: lang.id || `lang-${index}`,
        content: {
          type: 'text',
          text: content,
          style: {
            font: template.styleConfig.fonts.body,
            color: template.styleConfig.colors.text.primary,
            alignment: 'left'
          }
        },
        level: 0
      };
    });

    const content: StyledListContent = {
      type: 'list',
      items,
      style: template.styleConfig.components.list
    };

    return {
      id: 'languages',
      type: 'languages',
      title: '语言能力',
      content,
      style: sectionStyle,
      visible: true,
      order: 6
    };
  }

  // 转换认证章节
  private transformCertificationsSection(
    certifications: any[] | undefined,
    template: ResumeTemplate,
    sectionStyle: any
  ): StyledSection | null {
    if (!certifications || certifications.length === 0) return null;

    const items: StyledListItem[] = certifications.map((cert, index) => {
      const content = `${cert.name} | ${cert.issuer} | ${this.formatDate(cert.issueDate)}`;
      
      return {
        id: cert.id || `cert-${index}`,
        content: {
          type: 'text',
          text: content,
          style: {
            font: template.styleConfig.fonts.body,
            color: template.styleConfig.colors.text.primary,
            alignment: 'left'
          }
        },
        level: 0
      };
    });

    const content: StyledListContent = {
      type: 'list',
      items,
      style: template.styleConfig.components.list
    };

    return {
      id: 'certifications',
      type: 'certifications',
      title: '认证证书',
      content,
      style: sectionStyle,
      visible: true,
      order: 7
    };
  }

  // 转换奖项章节
  private transformAwardsSection(
    awards: any[] | undefined,
    template: ResumeTemplate,
    sectionStyle: any
  ): StyledSection | null {
    if (!awards || awards.length === 0) return null;

    const items: StyledListItem[] = awards.map((award, index) => {
      const content = `${award.title} | ${award.issuer} | ${this.formatDate(award.date)}`;
      
      return {
        id: award.id || `award-${index}`,
        content: {
          type: 'text',
          text: content,
          style: {
            font: template.styleConfig.fonts.body,
            color: template.styleConfig.colors.text.primary,
            alignment: 'left'
          }
        },
        level: 0
      };
    });

    const content: StyledListContent = {
      type: 'list',
      items,
      style: template.styleConfig.components.list
    };

    return {
      id: 'awards',
      type: 'awards',
      title: '奖项荣誉',
      content,
      style: sectionStyle,
      visible: true,
      order: 8
    };
  }

  // 转换推荐人章节
  private transformReferencesSection(
    references: any[] | undefined,
    template: ResumeTemplate,
    sectionStyle: any
  ): StyledSection | null {
    if (!references || references.length === 0) return null;

    const items: StyledListItem[] = references.map((ref, index) => {
      const content = `${ref.name} | ${ref.position} | ${ref.company} | ${ref.email}`;
      
      return {
        id: ref.id || `ref-${index}`,
        content: {
          type: 'text',
          text: content,
          style: {
            font: template.styleConfig.fonts.body,
            color: template.styleConfig.colors.text.primary,
            alignment: 'left'
          }
        },
        level: 0
      };
    });

    const content: StyledListContent = {
      type: 'list',
      items,
      style: template.styleConfig.components.list
    };

    return {
      id: 'references',
      type: 'references',
      title: '推荐人',
      content,
      style: sectionStyle,
      visible: true,
      order: 9
    };
  }

  // 辅助方法
  private hasContent(content: StyledContent): boolean {
    switch (content.type) {
      case 'text':
        return !!content.text.trim();
      case 'list':
        return content.items.length > 0;
      case 'personal-info':
        return content.fields.some(field => field.visible && field.value);
      default:
        return true;
    }
  }

  private formatDateRange(startDate: Date | string, endDate?: Date | string, current?: boolean): string {
    const start = this.formatDate(startDate);
    if (current) {
      return `${start} - 至今`;
    }
    if (endDate) {
      const end = this.formatDate(endDate);
      return `${start} - ${end}`;
    }
    return start;
  }

  private formatDate(date: Date | string): string {
    if (!date) return '';
    const d = typeof date === 'string' ? new Date(date) : date;
    return `${d.getFullYear()}年${d.getMonth() + 1}月`;
  }

  private formatSkillLevel(level: string): string {
    const levelMap: Record<string, string> = {
      'beginner': '初级',
      'intermediate': '中级',
      'advanced': '高级',
      'expert': '专家'
    };
    return levelMap[level] || level;
  }

  private generateTags(data: ResumeData): string[] {
    const tags: string[] = [];
    
    // 从技能中提取标签
    if (data.skills) {
      data.skills.forEach(skill => {
        tags.push(skill.name);
        if (skill.category) tags.push(skill.category);
      });
    }
    
    // 从工作经历中提取标签
    if (data.experience) {
      data.experience.forEach(exp => {
        if (exp.technologies) {
          tags.push(...exp.technologies);
        }
      });
    }
    
    // 去重并返回
    return Array.from(new Set(tags));
  }

  private calculateWordCount(sections: StyledSection[]): number {
    let wordCount = 0;
    
    sections.forEach(section => {
      switch (section.content.type) {
        case 'text':
          wordCount += section.content.text.length;
          break;
        case 'list':
          section.content.items.forEach(item => {
            if (item.content.type === 'text') {
              wordCount += item.content.text.length;
            }
          });
          break;
        case 'personal-info':
          section.content.fields.forEach(field => {
            if (field.visible) {
              wordCount += field.value.length;
            }
          });
          break;
      }
    });
    
    return wordCount;
  }
}

// 导出单例实例
export const resumeDataTransformer = new ResumeDataTransformer();