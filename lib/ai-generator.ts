"use client";

import { ResumeData } from './types';

// AI生成配置
export interface GenerationConfig {
  industry: string;
  position: string;
  experience: 'entry' | 'mid' | 'senior' | 'executive';
  skills: string[];
  tone: 'professional' | 'creative' | 'technical' | 'friendly';
  length: 'concise' | 'detailed' | 'comprehensive';
}

// 生成结果
export interface GenerationResult {
  resume: ResumeData;
  suggestions: string[];
  keywords: string[];
  score: number;
}

// 行业模板库
const INDUSTRY_TEMPLATES = {
  software: {
    positions: {
      'frontend': {
        skills: ['JavaScript', 'TypeScript', 'React', 'Vue', 'HTML/CSS', 'Webpack', 'Git'],
        responsibilities: [
          '负责前端页面开发和用户界面设计',
          '优化网站性能，提升用户体验',
          '与后端团队协作，完成API对接',
          '参与产品需求分析和技术方案设计',
          '维护和重构现有代码，确保代码质量'
        ],
        achievements: [
          '优化页面加载速度，提升{percentage}%用户体验',
          '开发{number}个核心功能模块，支撑业务快速发展',
          '建立前端开发规范，提高团队开发效率{percentage}%',
          '重构核心组件库，代码复用率提升{percentage}%'
        ]
      },
      'backend': {
        skills: ['Java', 'Python', 'Node.js', 'MySQL', 'Redis', 'Docker', 'Kubernetes'],
        responsibilities: [
          '负责后端服务架构设计和开发',
          '设计和优化数据库结构',
          '开发和维护API接口',
          '处理系统性能优化和故障排查',
          '参与技术选型和架构评审'
        ],
        achievements: [
          '设计微服务架构，系统并发能力提升{percentage}%',
          '优化数据库查询，响应时间减少{percentage}%',
          '开发{number}个核心API，支撑{number}万+用户访问',
          '建立监控体系，系统稳定性达到{percentage}%'
        ]
      },
      'fullstack': {
        skills: ['JavaScript', 'TypeScript', 'React', 'Node.js', 'Python', 'MySQL', 'AWS'],
        responsibilities: [
          '负责全栈产品开发，从前端到后端',
          '参与产品架构设计和技术选型',
          '开发和维护核心业务功能',
          '优化系统性能和用户体验',
          '指导初级开发人员技术成长'
        ],
        achievements: [
          '独立完成{number}个完整产品开发',
          '建立前后端一体化开发流程，效率提升{percentage}%',
          '优化系统架构，支撑用户量增长{percentage}%',
          '技术分享和培训，提升团队整体技术水平'
        ]
      }
    }
  },
  marketing: {
    positions: {
      'digital-marketing': {
        skills: ['Google Analytics', 'SEO/SEM', '社交媒体营销', '内容营销', 'A/B测试', 'CRM'],
        responsibilities: [
          '制定和执行数字营销策略',
          '管理多渠道营销活动',
          '分析营销数据，优化投放效果',
          '维护客户关系，提升客户满意度',
          '协调内外部资源，确保项目按时交付'
        ],
        achievements: [
          '营销活动ROI提升{percentage}%，获客成本降低{percentage}%',
          '管理年度营销预算{number}万元，超额完成业绩目标',
          '建立营销数据分析体系，决策效率提升{percentage}%',
          '开发{number}个营销渠道，用户增长{percentage}%'
        ]
      },
      'content-marketing': {
        skills: ['内容策划', '文案撰写', 'SEO优化', '社交媒体', '数据分析', '品牌管理'],
        responsibilities: [
          '制定内容营销策略和计划',
          '创作高质量营销内容',
          '管理社交媒体账号和社区',
          '分析内容表现，优化内容策略',
          '与设计团队协作，制作营销素材'
        ],
        achievements: [
          '内容阅读量提升{percentage}%，粉丝增长{number}万+',
          '创作{number}篇爆款内容，单篇阅读量{number}万+',
          '建立内容生产流程，内容产出效率提升{percentage}%',
          'SEO优化使网站流量增长{percentage}%'
        ]
      }
    }
  },
  design: {
    positions: {
      'ui-designer': {
        skills: ['Figma', 'Sketch', 'Adobe Creative Suite', 'Principle', '用户研究', '交互设计'],
        responsibilities: [
          '负责产品界面设计和用户体验优化',
          '制定设计规范和组件库',
          '参与用户研究和可用性测试',
          '与产品和开发团队协作',
          '跟进设计实现，确保设计质量'
        ],
        achievements: [
          '重设计产品界面，用户满意度提升{percentage}%',
          '建立设计系统，设计效率提升{percentage}%',
          '优化用户流程，转化率提升{percentage}%',
          '设计{number}个产品功能，获得用户好评'
        ]
      },
      'ux-designer': {
        skills: ['用户研究', '交互设计', '原型设计', '可用性测试', 'Figma', '数据分析'],
        responsibilities: [
          '进行用户研究和需求分析',
          '设计用户体验流程和交互方案',
          '制作原型和进行可用性测试',
          '分析用户行为数据，优化产品体验',
          '与跨职能团队协作，推动设计落地'
        ],
        achievements: [
          '用户研究覆盖{number}+用户，洞察准确率{percentage}%',
          '优化核心流程，用户完成率提升{percentage}%',
          '设计A/B测试，转化率提升{percentage}%',
          '建立用户体验评估体系，产品满意度{percentage}%+'
        ]
      }
    }
  }
};

// 经验级别配置
const EXPERIENCE_CONFIG = {
  entry: {
    years: '1-2年',
    level: '初级',
    focus: ['学习能力', '执行力', '团队协作'],
    achievements: {
      percentage: [10, 20, 30],
      number: [1, 3, 5]
    }
  },
  mid: {
    years: '3-5年',
    level: '中级',
    focus: ['专业技能', '项目管理', '问题解决'],
    achievements: {
      percentage: [20, 40, 60],
      number: [3, 8, 15]
    }
  },
  senior: {
    years: '5-8年',
    level: '高级',
    focus: ['技术领导', '架构设计', '团队管理'],
    achievements: {
      percentage: [30, 60, 100],
      number: [5, 15, 30]
    }
  },
  executive: {
    years: '8年以上',
    level: '专家',
    focus: ['战略规划', '团队建设', '业务增长'],
    achievements: {
      percentage: [50, 100, 200],
      number: [10, 30, 100]
    }
  }
};

// 语调配置
const TONE_CONFIG = {
  professional: {
    adjectives: ['专业的', '高效的', '可靠的', '严谨的'],
    verbs: ['负责', '管理', '执行', '完成', '实现'],
    style: '正式、专业'
  },
  creative: {
    adjectives: ['创新的', '富有创意的', '灵活的', '独特的'],
    verbs: ['创造', '设计', '开发', '探索', '突破'],
    style: '创意、活泼'
  },
  technical: {
    adjectives: ['技术精湛的', '深入的', '系统的', '全面的'],
    verbs: ['开发', '优化', '架构', '实施', '解决'],
    style: '技术、详细'
  },
  friendly: {
    adjectives: ['友好的', '积极的', '热情的', '合作的'],
    verbs: ['协助', '支持', '参与', '贡献', '帮助'],
    style: '友好、亲和'
  }
};

export class AIResumeGenerator {
  private static instance: AIResumeGenerator;
  
  static getInstance(): AIResumeGenerator {
    if (!AIResumeGenerator.instance) {
      AIResumeGenerator.instance = new AIResumeGenerator();
    }
    return AIResumeGenerator.instance;
  }

  // 生成简历
  async generateResume(config: GenerationConfig, personalInfo?: Partial<ResumeData['personalInfo']>): Promise<GenerationResult> {
    try {
      // 验证输入参数
      if (!config) {
        throw new Error('生成配置不能为空');
      }
      
      if (!config.industry || !config.position) {
        throw new Error('请提供完整的行业和职位信息');
      }
      
      if (!config.experience || !config.tone || !config.length) {
        throw new Error('请提供完整的生成配置');
      }
      
      // 模拟AI生成过程
      await new Promise(resolve => setTimeout(resolve, 2000));

      const template = this.getTemplate(config.industry, config.position);
      const experienceConfig = EXPERIENCE_CONFIG[config.experience];
      const toneConfig = TONE_CONFIG[config.tone];
      
      if (!experienceConfig) {
        throw new Error(`不支持的经验级别: ${config.experience}`);
      }
      
      if (!toneConfig) {
        throw new Error(`不支持的语调风格: ${config.tone}`);
      }

      // 生成个人信息
      const generatedPersonalInfo = this.generatePersonalInfo(personalInfo, config, toneConfig);
      
      // 生成工作经验
      const experiences = this.generateExperiences(template, experienceConfig, config);
      
      // 生成教育背景
      const education = this.generateEducation(config);
      
      // 生成技能
      const skills = this.generateSkills(template, config);
      
      // 生成项目经验
      const projects = this.generateProjects(template, experienceConfig, config);

      const resume: ResumeData = {
        personalInfo: generatedPersonalInfo,
        experience: experiences, // 修正字段名
        education,
        skills,
        projects
      };
      
      // 验证生成的简历数据
      this.validateResumeData(resume);

      // 生成建议和关键词
      const suggestions = this.generateSuggestions(config);
      const keywords = this.extractKeywords(template, config);
      const score = this.calculateScore(resume, config);
      
      // 验证最终结果
      if (typeof score !== 'number' || score < 0 || score > 100) {
        throw new Error('生成的评分无效');
      }

      return {
        resume,
        suggestions,
        keywords,
        score
      };
      
    } catch (error) {
      console.error('AI简历生成失败:', error);
      throw error; // 重新抛出错误，让调用方处理
    }
  }

  // 获取模板
  private getTemplate(industry: string, position: string) {
    try {
      if (!industry || typeof industry !== 'string') {
        throw new Error('行业参数无效');
      }
      
      if (!position || typeof position !== 'string') {
        throw new Error('职位参数无效');
      }
      
      const industryTemplate = INDUSTRY_TEMPLATES[industry as keyof typeof INDUSTRY_TEMPLATES];
      if (!industryTemplate) {
        throw new Error(`不支持的行业: ${industry}。支持的行业包括: ${Object.keys(INDUSTRY_TEMPLATES).join('、')}`);
      }

      const positionTemplate = industryTemplate.positions[position as keyof typeof industryTemplate.positions];
      if (!positionTemplate) {
        const availablePositions = Object.keys(industryTemplate.positions).join('、');
        throw new Error(`不支持的职位: ${position}。${industry}行业支持的职位包括: ${availablePositions}`);
      }

      return positionTemplate;
    } catch (error) {
      console.error('获取模板失败:', error);
      throw error;
    }
  }

  // 生成个人信息
  private generatePersonalInfo(personalInfo: Partial<ResumeData['personalInfo']> | undefined, config: GenerationConfig, toneConfig: any) {
    const experienceConfig = EXPERIENCE_CONFIG[config.experience];
    
    return {
      fullName: personalInfo?.fullName || '您的姓名',
      email: personalInfo?.email || 'your.email@example.com',
      phone: personalInfo?.phone || '138-0000-0000',
      location: personalInfo?.location || '北京市',
      summary: personalInfo?.summary || this.generateSummary(config, experienceConfig, toneConfig)
    };
  }

  // 生成职业总结
  private generateSummary(config: GenerationConfig, experienceConfig: any, toneConfig: any) {
    const adjective = toneConfig.adjectives[Math.floor(Math.random() * toneConfig.adjectives.length)];
    const focus = experienceConfig.focus.join('、');
    
    return `拥有${experienceConfig.years}${config.position}经验的${adjective}专业人士，擅长${focus}。` +
           `在${config.industry}领域具有丰富的实践经验，能够独立完成项目开发和团队协作。` +
           `具备强烈的责任心和学习能力，致力于为公司创造价值。`;
  }

  // 生成工作经验
  private generateExperiences(template: any, experienceConfig: any, config: GenerationConfig) {
    const experiences = [];
    const numExperiences = config.experience === 'entry' ? 1 : config.experience === 'mid' ? 2 : 3;

    for (let i = 0; i < numExperiences; i++) {
      const startYear = 2024 - (numExperiences - i) * 2;
      const endYear = i === 0 ? '至今' : (startYear + 2).toString();
      
      const responsibilities = template.responsibilities.slice(0, config.length === 'concise' ? 3 : 5);
      const achievements = template.achievements
        .slice(0, config.length === 'concise' ? 2 : 3)
        .map((achievement: string) => this.fillPlaceholders(achievement, experienceConfig.achievements));

      experiences.push({
        id: (i + 1).toString(),
        company: `${config.industry === 'software' ? '科技' : config.industry === 'marketing' ? '营销' : '设计'}有限公司`,
        position: i === 0 ? `${experienceConfig.level}${config.position}` : config.position,
        startDate: `${startYear}-01`,
        endDate: endYear === '至今' ? '' : `${endYear}-12`,
        current: i === 0,
        description: [...responsibilities, ...achievements].join('\n• ')
      });
    }

    return experiences;
  }

  // 生成教育背景
  private generateEducation(config: GenerationConfig) {
    const majors = {
      software: '计算机科学与技术',
      marketing: '市场营销',
      design: '视觉传达设计'
    };

    return [{
      id: '1',
      school: '知名大学',
      degree: config.experience === 'entry' ? '本科' : '硕士',
      major: majors[config.industry as keyof typeof majors] || '相关专业',
      startDate: '2016-09',
      endDate: '2020-06',
      description: 'GPA 3.8/4.0，多次获得奖学金，积极参与社团活动和实习项目。'
    }];
  }

  // 生成技能
  private generateSkills(template: any, config: GenerationConfig) {
    const allSkills = [...template.skills, ...config.skills];
    const uniqueSkills = [...new Set(allSkills)];
    
    return uniqueSkills.slice(0, config.length === 'concise' ? 6 : 10).map((skill, index) => ({
      id: (index + 1).toString(),
      name: skill,
      level: config.experience === 'entry' ? '中级' : config.experience === 'mid' ? '高级' : '专家'
    }));
  }

  // 生成项目经验
  private generateProjects(template: any, experienceConfig: any, config: GenerationConfig) {
    if (config.length === 'concise') return [];

    const projects = [];
    const numProjects = config.experience === 'entry' ? 1 : 2;

    for (let i = 0; i < numProjects; i++) {
      projects.push({
        id: (i + 1).toString(),
        name: `${config.industry}核心项目${i + 1}`,
        role: config.position,
        startDate: `${2023 - i}-01`,
        endDate: `${2023 - i}-12`,
        description: this.generateProjectDescription(template, experienceConfig, config),
        technologies: template.skills.slice(0, 5),
        achievements: template.achievements
          .slice(0, 2)
          .map((achievement: string) => this.fillPlaceholders(achievement, experienceConfig.achievements))
      });
    }

    return projects;
  }

  // 生成项目描述
  private generateProjectDescription(template: any, experienceConfig: any, config: GenerationConfig) {
    const responsibility = template.responsibilities[0];
    const achievement = this.fillPlaceholders(template.achievements[0], experienceConfig.achievements);
    
    return `${responsibility}。${achievement}。项目获得了用户和团队的一致好评。`;
  }

  // 验证简历数据完整性
  private validateResumeData(resume: ResumeData) {
    if (!resume) {
      throw new Error('简历数据为空');
    }
    
    if (!resume.personalInfo) {
      throw new Error('个人信息缺失');
    }
    
    if (!resume.personalInfo.fullName || !resume.personalInfo.fullName.trim()) {
      throw new Error('姓名信息缺失');
    }
    
    if (!resume.experience || !Array.isArray(resume.experience)) {
      throw new Error('工作经验数据格式错误');
    }
    
    if (!resume.education || !Array.isArray(resume.education)) {
      throw new Error('教育背景数据格式错误');
    }
    
    if (!resume.skills || !Array.isArray(resume.skills)) {
      throw new Error('技能数据格式错误');
    }
    
    // 验证工作经验数据
    resume.experience.forEach((exp, index) => {
      if (!exp.company || !exp.position) {
        throw new Error(`第${index + 1}条工作经验缺少公司或职位信息`);
      }
    });
    
    // 验证教育背景数据
    resume.education.forEach((edu, index) => {
      if (!edu.school || !edu.degree) {
        throw new Error(`第${index + 1}条教育背景缺少学校或学位信息`);
      }
    });
    
    // 验证技能数据
    resume.skills.forEach((skill, index) => {
      if (!skill.name) {
        throw new Error(`第${index + 1}个技能缺少名称`);
      }
    });
  }

  // 填充占位符
  private fillPlaceholders(text: string, achievements: any) {
    return text
      .replace(/{percentage}/g, () => {
        const percentages = achievements.percentage;
        return percentages[Math.floor(Math.random() * percentages.length)].toString();
      })
      .replace(/{number}/g, () => {
        const numbers = achievements.number;
        return numbers[Math.floor(Math.random() * numbers.length)].toString();
      });
  }

  // 生成建议
  private generateSuggestions(config: GenerationConfig) {
    const suggestions = [
      '根据目标职位调整技能重点，突出相关经验',
      '使用量化数据展示工作成果，增强说服力',
      '保持简历格式一致，确保专业外观',
      '定期更新简历内容，反映最新技能和经验'
    ];

    if (config.experience === 'entry') {
      suggestions.push('强调学习能力和项目经验，弥补工作经验不足');
    }

    if (config.tone === 'creative') {
      suggestions.push('在保持专业性的同时，适当展示创意思维');
    }

    return suggestions;
  }

  // 提取关键词
  private extractKeywords(template: any, config: GenerationConfig) {
    return [
      ...template.skills,
      config.position,
      config.industry,
      ...EXPERIENCE_CONFIG[config.experience].focus
    ];
  }

  // 计算分数
  private calculateScore(resume: ResumeData, config: GenerationConfig) {
    let score = 70; // 基础分
    
    // 根据经验级别调整
    if (config.experience === 'senior' || config.experience === 'executive') {
      score += 10;
    }
    
    // 根据内容详细程度调整
    if (config.length === 'comprehensive') {
      score += 10;
    }
    
    // 根据技能匹配度调整
    if (resume.skills && resume.skills.length >= 8) {
      score += 10;
    }
    
    return Math.min(100, score);
  }

  // 获取支持的行业列表
  getSupportedIndustries() {
    return Object.keys(INDUSTRY_TEMPLATES);
  }

  // 获取行业支持的职位列表
  getSupportedPositions(industry: string) {
    const industryTemplate = INDUSTRY_TEMPLATES[industry as keyof typeof INDUSTRY_TEMPLATES];
    return industryTemplate ? Object.keys(industryTemplate.positions) : [];
  }

  // 获取推荐技能
  getRecommendedSkills(industry: string, position: string) {
    try {
      const template = this.getTemplate(industry, position);
      return template.skills;
    } catch {
      return [];
    }
  }
}

// 导出单例实例
export const aiGenerator = AIResumeGenerator.getInstance();