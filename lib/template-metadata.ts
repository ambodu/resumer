import { FileText, Code, BarChart3, Users, Palette, Briefcase } from "lucide-react";

export interface TemplateMetadata {
  id: string;
  title: string;
  description: string;
  category: string;
  icon: any;
  color: string;
  features: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedTime: string;
}

export const templateMetadata: Record<string, TemplateMetadata> = {
  empty: {
    id: 'empty',
    title: '空白模板',
    description: '从零开始创建您的专属简历',
    category: '基础',
    icon: FileText,
    color: 'bg-blue-500',
    features: ['完全自定义', '灵活布局', '适合所有行业'],
    difficulty: 'beginner',
    estimatedTime: '30-60分钟'
  },
  modern: {
    id: 'modern',
    title: '现代设计师',
    description: '适合设计师和创意工作者的现代化模板',
    category: '设计',
    icon: Palette,
    color: 'bg-blue-500',
    features: ['视觉突出', '创意布局', '作品展示'],
    difficulty: 'intermediate',
    estimatedTime: '20-40分钟'
  },
  software: {
    id: 'software',
    title: '软件工程师',
    description: '专为技术人员设计的专业模板',
    category: '技术',
    icon: Code,
    color: 'bg-blue-500',
    features: ['技术技能突出', '项目经验', '代码展示'],
    difficulty: 'intermediate',
    estimatedTime: '25-45分钟'
  },
  analyst: {
    id: 'analyst',
    title: '数据分析师',
    description: '突出数据分析和商业洞察能力',
    category: '数据',
    icon: BarChart3,
    color: 'bg-blue-500',
    features: ['数据技能', '分析成果', '可视化经验'],
    difficulty: 'intermediate',
    estimatedTime: '30-50分钟'
  },
  manager: {
    id: 'manager',
    title: '项目经理',
    description: '展现领导力和项目管理经验',
    category: '管理',
    icon: Users,
    color: 'bg-blue-500',
    features: ['领导经验', '项目成果', '团队管理'],
    difficulty: 'advanced',
    estimatedTime: '35-55分钟'
  },
  marketing: {
    id: 'marketing',
    title: '市场营销',
    description: '突出营销策略和品牌建设能力',
    category: '营销',
    icon: Briefcase,
    color: 'bg-blue-500',
    features: ['营销策略', '品牌经验', '数据驱动'],
    difficulty: 'intermediate',
    estimatedTime: '25-45分钟'
  }
};

export const templateCategories = [
  { key: 'all', label: '全部模板' },
  { key: '基础', label: '基础模板' },
  { key: '技术', label: '技术类' },
  { key: '设计', label: '设计类' },
  { key: '数据', label: '数据类' },
  { key: '管理', label: '管理类' },
  { key: '营销', label: '营销类' }
];