import { ResumeData } from './types';

// 简历组件类型定义
export type ResumeComponentType = 
  | 'personalInfo'
  | 'experience' 
  | 'education'
  | 'skills'
  | 'projects'
  | 'certifications'
  | 'languages'
  | 'interests';

// 组件配置接口
export interface ResumeComponentConfig {
  id: string;
  type: ResumeComponentType;
  title: string;
  icon: string;
  required: boolean;
  enabled: boolean;
  order: number;
  editorProps?: Record<string, any>;
  previewProps?: Record<string, any>;
}

// 默认组件配置
export const DEFAULT_RESUME_CONFIG: ResumeComponentConfig[] = [
  {
    id: 'personal-info',
    type: 'personalInfo',
    title: '个人信息',
    icon: 'User',
    required: true,
    enabled: true,
    order: 1,
    editorProps: {
      showAvatar: true,
      showSummary: true,
    },
    previewProps: {
      layout: 'horizontal',
      showIcons: true,
    }
  },
  {
    id: 'experience',
    type: 'experience',
    title: '工作经验',
    icon: 'Briefcase',
    required: false,
    enabled: true,
    order: 2,
    editorProps: {
      allowReorder: true,
      showDates: true,
    },
    previewProps: {
      showCompanyLogo: false,
      dateFormat: 'YYYY-MM',
    }
  },
  {
    id: 'education',
    type: 'education',
    title: '教育背景',
    icon: 'GraduationCap',
    required: false,
    enabled: true,
    order: 3,
    editorProps: {
      allowReorder: true,
      showGPA: false,
    },
    previewProps: {
      showSchoolLogo: false,
      dateFormat: 'YYYY',
    }
  },
  {
    id: 'skills',
    type: 'skills',
    title: '专业技能',
    icon: 'Code',
    required: false,
    enabled: true,
    order: 4,
    editorProps: {
      allowCategories: true,
      showProficiency: true,
    },
    previewProps: {
      layout: 'grid',
      showProgress: true,
    }
  },
];

// 简历配置管理类
export class ResumeConfigManager {
  private config: ResumeComponentConfig[];

  constructor(initialConfig: ResumeComponentConfig[] = DEFAULT_RESUME_CONFIG) {
    this.config = [...initialConfig];
  }

  // 获取所有组件配置
  getConfig(): ResumeComponentConfig[] {
    return this.config.sort((a, b) => a.order - b.order);
  }

  // 获取启用的组件配置
  getEnabledConfig(): ResumeComponentConfig[] {
    return this.config
      .filter(component => component.enabled)
      .sort((a, b) => a.order - b.order);
  }

  // 获取特定组件配置
  getComponentConfig(id: string): ResumeComponentConfig | undefined {
    return this.config.find(component => component.id === id);
  }

  // 更新组件配置
  updateComponentConfig(id: string, updates: Partial<ResumeComponentConfig>): void {
    const index = this.config.findIndex(component => component.id === id);
    if (index !== -1) {
      this.config[index] = { ...this.config[index], ...updates };
    }
  }

  // 切换组件启用状态
  toggleComponent(id: string): void {
    const component = this.getComponentConfig(id);
    if (component && !component.required) {
      this.updateComponentConfig(id, { enabled: !component.enabled });
    }
  }

  // 重新排序组件
  reorderComponents(newOrder: string[]): void {
    newOrder.forEach((id, index) => {
      this.updateComponentConfig(id, { order: index + 1 });
    });
  }

  // 添加自定义组件
  addComponent(component: ResumeComponentConfig): void {
    this.config.push(component);
  }

  // 移除组件
  removeComponent(id: string): void {
    const component = this.getComponentConfig(id);
    if (component && !component.required) {
      this.config = this.config.filter(c => c.id !== id);
    }
  }

  // 验证简历数据完整性
  validateResumeData(data: ResumeData): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];
    const requiredComponents = this.config.filter(c => c.required && c.enabled);

    for (const component of requiredComponents) {
      switch (component.type) {
        case 'personalInfo':
          if (!data.personalInfo?.fullName?.trim()) {
            errors.push('姓名不能为空');
          }
          if (!data.personalInfo?.email?.trim()) {
            errors.push('邮箱不能为空');
          }
          break;
        // 可以添加更多验证规则
      }
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  // 导出配置
  exportConfig(): string {
    return JSON.stringify(this.config, null, 2);
  }

  // 导入配置
  importConfig(configJson: string): void {
    try {
      const importedConfig = JSON.parse(configJson);
      if (Array.isArray(importedConfig)) {
        this.config = importedConfig;
      }
    } catch (error) {
      throw new Error('无效的配置格式');
    }
  }
}

// 创建默认配置管理器实例
export const defaultConfigManager = new ResumeConfigManager();