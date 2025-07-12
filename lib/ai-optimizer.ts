"use client";

import { ResumeData } from './types';

// AI优化建议类型
export interface OptimizationSuggestion {
  id: string;
  type: 'content' | 'structure' | 'format' | 'keyword' | 'achievement';
  severity: 'low' | 'medium' | 'high' | 'critical';
  section: string;
  title: string;
  description: string;
  suggestion: string;
  example?: string;
  impact: string;
  priority: number;
}

// AI优化分析结果
export interface OptimizationAnalysis {
  score: number; // 0-100
  suggestions: OptimizationSuggestion[];
  strengths: string[];
  weaknesses: string[];
  keywords: {
    missing: string[];
    present: string[];
    recommended: string[];
  };
  readability: {
    score: number;
    issues: string[];
  };
  atsCompatibility: {
    score: number;
    issues: string[];
  };
}

// 行业关键词库
const INDUSTRY_KEYWORDS = {
  software: [
    'JavaScript', 'TypeScript', 'React', 'Vue', 'Angular', 'Node.js',
    'Python', 'Java', 'C++', 'Git', 'Docker', 'Kubernetes', 'AWS',
    '微服务', '敏捷开发', 'DevOps', 'CI/CD', '前端开发', '后端开发',
    '全栈开发', '移动开发', '数据库设计', 'API开发', '性能优化'
  ],
  marketing: [
    '数字营销', 'SEO', 'SEM', '社交媒体营销', '内容营销', '品牌管理',
    'Google Analytics', '转化率优化', 'A/B测试', '用户增长', 'KPI',
    '市场调研', '竞品分析', '营销策略', '客户获取', '用户留存'
  ],
  analyst: [
    'Excel', 'SQL', 'Python', 'R', 'Tableau', 'Power BI', '数据分析',
    '统计分析', '数据可视化', '商业智能', '预测建模', '机器学习',
    '数据挖掘', 'KPI分析', '业务分析', '财务建模', '风险分析'
  ],
  manager: [
    '团队管理', '项目管理', '战略规划', '预算管理', '绩效管理',
    '人才培养', '跨部门协作', '流程优化', '变革管理', '领导力',
    'OKR', 'KPI', '敏捷管理', 'Scrum', '风险管控', '决策分析'
  ],
  teacher: [
    '课程设计', '教学方法', '学生评估', '教育技术', '多媒体教学',
    '班级管理', '家校沟通', '教育心理学', '差异化教学', '教学研究',
    '课程标准', '教学评价', '教育创新', '学习指导', '教师培训'
  ],
  doctor: [
    '临床诊断', '治疗方案', '医学研究', '病例分析', '医患沟通',
    '医疗质量', '循证医学', '多学科协作', '医疗安全', '继续教育',
    '临床技能', '医学伦理', '健康教育', '疾病预防', '医疗管理'
  ],
  designer: [
    'UI/UX设计', '视觉设计', '交互设计', '用户研究', '原型设计',
    'Figma', 'Sketch', 'Adobe Creative Suite', '设计系统', '品牌设计',
    '用户体验', '设计思维', '可用性测试', '响应式设计', '设计规范'
  ],
  sales: [
    '销售策略', '客户关系管理', '销售流程', '谈判技巧', '市场开拓',
    'CRM系统', '销售预测', '客户需求分析', '销售培训', '团队建设',
    '业绩达成', '客户维护', '销售漏斗', '商务谈判', '渠道管理'
  ],
  finance: [
    '财务分析', '预算编制', '成本控制', '投资分析', '风险管理',
    '财务报表', '税务筹划', '资金管理', '内控制度', '审计配合',
    'Excel建模', 'SAP', '财务软件', '合规管理', '财务规划'
  ]
};

// 通用技能关键词
const SOFT_SKILLS = [
  '沟通能力', '团队协作', '问题解决', '创新思维', '学习能力',
  '时间管理', '压力管理', '适应能力', '责任心', '执行力',
  '分析能力', '决策能力', '领导力', '影响力', '客户服务'
];

// 成就动词
const ACHIEVEMENT_VERBS = [
  '提升', '优化', '改进', '实现', '完成', '达成', '超越',
  '降低', '减少', '节省', '增加', '扩大', '建立', '开发',
  '设计', '实施', '管理', '领导', '协调', '推动', '创新'
];

export class AIResumeOptimizer {
  private static instance: AIResumeOptimizer;
  
  static getInstance(): AIResumeOptimizer {
    if (!AIResumeOptimizer.instance) {
      AIResumeOptimizer.instance = new AIResumeOptimizer();
    }
    return AIResumeOptimizer.instance;
  }

  // 分析简历并生成优化建议
  analyzeResume(resume: ResumeData, targetIndustry?: string): OptimizationAnalysis {
    try {
      // 验证输入参数
      if (!resume) {
        throw new Error('简历数据不能为空');
      }
      
      if (!resume.personalInfo) {
        throw new Error('简历缺少个人信息');
      }
      
      const suggestions: OptimizationSuggestion[] = [];
      const strengths: string[] = [];
      const weaknesses: string[] = [];
      
      let personalAnalysis, experienceAnalysis, educationAnalysis, skillsAnalysis;
      let keywordAnalysis, readabilityAnalysis, atsAnalysis;
      
      try {
        // 分析个人信息
        personalAnalysis = this.analyzePersonalInfo(resume.personalInfo);
        suggestions.push(...personalAnalysis.suggestions);
        strengths.push(...personalAnalysis.strengths);
        weaknesses.push(...personalAnalysis.weaknesses);
      } catch (error) {
        console.error('个人信息分析失败:', error);
        personalAnalysis = { suggestions: [], strengths: [], weaknesses: ['个人信息分析失败'], score: 0 };
        weaknesses.push('个人信息分析失败');
      }

      try {
        // 分析工作经验
        experienceAnalysis = this.analyzeExperience(resume.experience || []);
        suggestions.push(...experienceAnalysis.suggestions);
        strengths.push(...experienceAnalysis.strengths);
        weaknesses.push(...experienceAnalysis.weaknesses);
      } catch (error) {
        console.error('工作经验分析失败:', error);
        experienceAnalysis = { suggestions: [], strengths: [], weaknesses: ['工作经验分析失败'], score: 0 };
        weaknesses.push('工作经验分析失败');
      }

      try {
        // 分析教育背景
        educationAnalysis = this.analyzeEducation(resume.education || []);
        suggestions.push(...educationAnalysis.suggestions);
        strengths.push(...educationAnalysis.strengths);
        weaknesses.push(...educationAnalysis.weaknesses);
      } catch (error) {
        console.error('教育背景分析失败:', error);
        educationAnalysis = { suggestions: [], strengths: [], weaknesses: ['教育背景分析失败'], score: 0 };
        weaknesses.push('教育背景分析失败');
      }

      try {
        // 分析技能
        skillsAnalysis = this.analyzeSkills(resume.skills || [], targetIndustry);
        suggestions.push(...skillsAnalysis.suggestions);
        strengths.push(...skillsAnalysis.strengths);
        weaknesses.push(...skillsAnalysis.weaknesses);
      } catch (error) {
        console.error('技能分析失败:', error);
        skillsAnalysis = { suggestions: [], strengths: [], weaknesses: ['技能分析失败'], score: 0 };
        weaknesses.push('技能分析失败');
      }

      try {
        // 关键词分析
        keywordAnalysis = this.analyzeKeywords(resume, targetIndustry);
      } catch (error) {
        console.error('关键词分析失败:', error);
        keywordAnalysis = { score: 0, missing: [], present: [], recommended: [] };
        weaknesses.push('关键词分析失败');
      }
      
      try {
        // 可读性分析
        readabilityAnalysis = this.analyzeReadability(resume);
      } catch (error) {
        console.error('可读性分析失败:', error);
        readabilityAnalysis = { score: 0, issues: ['可读性分析失败'] };
        weaknesses.push('可读性分析失败');
      }
      
      try {
        // ATS兼容性分析
        atsAnalysis = this.analyzeATSCompatibility(resume);
      } catch (error) {
        console.error('ATS兼容性分析失败:', error);
        atsAnalysis = { score: 0, issues: ['ATS兼容性分析失败'] };
        weaknesses.push('ATS兼容性分析失败');
      }
      
      // 计算总分
      const score = this.calculateOverallScore({
        personalInfo: personalAnalysis?.score || 0,
        experience: experienceAnalysis?.score || 0,
        education: educationAnalysis?.score || 0,
        skills: skillsAnalysis?.score || 0,
        keywords: keywordAnalysis?.score || 0,
        readability: readabilityAnalysis?.score || 0,
        ats: atsAnalysis?.score || 0
      });

      // 按优先级排序建议
      suggestions.sort((a, b) => b.priority - a.priority);

      return {
        score: Math.max(0, Math.min(100, score)), // 确保分数在0-100范围内
        suggestions,
        strengths: [...new Set(strengths.filter(s => s))], // 过滤空值
        weaknesses: [...new Set(weaknesses.filter(w => w))], // 过滤空值
        keywords: keywordAnalysis || { score: 0, missing: [], present: [], recommended: [] },
        readability: readabilityAnalysis || { score: 0, issues: [] },
        atsCompatibility: atsAnalysis || { score: 0, issues: [] }
      };
      
    } catch (error) {
      console.error('简历分析失败:', error);
      
      // 返回默认的错误状态
      return {
        score: 0,
        suggestions: [],
        strengths: [],
        weaknesses: ['简历分析过程中出现错误'],
        keywords: { score: 0, missing: [], present: [], recommended: [] },
        readability: { score: 0, issues: ['分析失败'] },
        atsCompatibility: { score: 0, issues: ['分析失败'] }
      };
    }
  }

  // 分析个人信息
  private analyzePersonalInfo(personalInfo: any) {
    try {
      if (!personalInfo) {
        throw new Error('个人信息数据为空');
      }
      
      const suggestions: OptimizationSuggestion[] = [];
      const strengths: string[] = [];
      const weaknesses: string[] = [];
      let score = 100;

      // 检查必填字段
      if (!personalInfo.fullName?.trim()) {
      suggestions.push({
        id: 'personal-name',
        type: 'content',
        severity: 'critical',
        section: '个人信息',
        title: '缺少姓名',
        description: '简历必须包含完整的姓名信息',
        suggestion: '请填写您的完整姓名',
        impact: '没有姓名的简历无法被HR识别',
        priority: 100
      });
      score -= 30;
      weaknesses.push('缺少基本个人信息');
    } else {
      strengths.push('个人信息完整');
    }

    if (!personalInfo.email?.trim()) {
      suggestions.push({
        id: 'personal-email',
        type: 'content',
        severity: 'critical',
        section: '个人信息',
        title: '缺少邮箱',
        description: '邮箱是HR联系您的重要方式',
        suggestion: '请添加有效的邮箱地址',
        impact: 'HR无法通过邮件联系您',
        priority: 95
      });
      score -= 25;
    }

    if (!personalInfo.phone?.trim()) {
      suggestions.push({
        id: 'personal-phone',
        type: 'content',
        severity: 'high',
        section: '个人信息',
        title: '缺少电话',
        description: '电话是重要的联系方式',
        suggestion: '请添加有效的手机号码',
        impact: 'HR无法电话联系您',
        priority: 90
      });
      score -= 20;
    }

    // 检查邮箱格式
    if (personalInfo.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(personalInfo.email)) {
      suggestions.push({
        id: 'personal-email-format',
        type: 'format',
        severity: 'medium',
        section: '个人信息',
        title: '邮箱格式错误',
        description: '邮箱格式不正确',
        suggestion: '请使用正确的邮箱格式，如：example@email.com',
        impact: '可能导致HR无法正确识别邮箱',
        priority: 70
      });
      score -= 10;
    }

    // 检查职业总结
    if (!personalInfo.summary?.trim()) {
      suggestions.push({
        id: 'personal-summary',
        type: 'content',
        severity: 'medium',
        section: '个人信息',
        title: '建议添加职业总结',
        description: '职业总结能快速展示您的核心优势',
        suggestion: '添加2-3句话的职业总结，突出您的专业技能和经验',
        example: '拥有5年前端开发经验，精通React和Vue框架，具备丰富的大型项目开发经验',
        impact: '帮助HR快速了解您的核心竞争力',
        priority: 60
      });
      score -= 15;
    } else if (personalInfo.summary.length < 50) {
      suggestions.push({
        id: 'personal-summary-short',
        type: 'content',
        severity: 'low',
        section: '个人信息',
        title: '职业总结过于简短',
        description: '当前职业总结内容较少',
        suggestion: '扩展职业总结，详细描述您的专业技能、经验年限和核心优势',
        impact: '更详细的总结有助于展示专业能力',
        priority: 40
      });
      score -= 5;
    } else {
      strengths.push('职业总结清晰明确');
    }

      return { suggestions, strengths, weaknesses, score };
    } catch (error) {
      console.error('个人信息分析错误:', error);
      return {
        suggestions: [],
        strengths: [],
        weaknesses: ['个人信息分析失败'],
        score: 0
      };
    }
  }

  // 分析工作经验
  private analyzeExperience(experience: any[]) {
    try {
      if (!Array.isArray(experience)) {
        throw new Error('工作经验数据格式错误');
      }
      
      const suggestions: OptimizationSuggestion[] = [];
      const strengths: string[] = [];
      const weaknesses: string[] = [];
      let score = 100;

      if (!experience || experience.length === 0) {
      suggestions.push({
        id: 'experience-empty',
        type: 'content',
        severity: 'critical',
        section: '工作经验',
        title: '缺少工作经验',
        description: '简历应包含相关工作经验',
        suggestion: '添加您的工作经历，包括公司名称、职位、时间和主要职责',
        impact: '没有工作经验会大大降低简历竞争力',
        priority: 100
      });
      score = 0;
      weaknesses.push('缺少工作经验');
      return { suggestions, strengths, weaknesses, score };
    }

    experience.forEach((exp, index) => {
      // 检查必填字段
      if (!exp.company?.trim()) {
        suggestions.push({
          id: `experience-company-${index}`,
          type: 'content',
          severity: 'high',
          section: '工作经验',
          title: `第${index + 1}段经历缺少公司名称`,
          description: '每段工作经历都应包含公司名称',
          suggestion: '请填写完整的公司名称',
          impact: 'HR无法了解您的工作背景',
          priority: 85
        });
        score -= 15;
      }

      if (!exp.position?.trim()) {
        suggestions.push({
          id: `experience-position-${index}`,
          type: 'content',
          severity: 'high',
          section: '工作经验',
          title: `第${index + 1}段经历缺少职位名称`,
          description: '每段工作经历都应包含具体职位',
          suggestion: '请填写具体的职位名称',
          impact: 'HR无法了解您的职业发展轨迹',
          priority: 85
        });
        score -= 15;
      }

      // 检查工作描述
      if (!exp.description?.trim()) {
        suggestions.push({
          id: `experience-description-${index}`,
          type: 'content',
          severity: 'medium',
          section: '工作经验',
          title: `第${index + 1}段经历缺少工作描述`,
          description: '工作描述能展示您的具体职责和成就',
          suggestion: '添加3-5条工作职责和成就，使用量化数据',
          example: '• 负责前端团队管理，带领5人团队完成10+项目\n• 优化系统性能，页面加载速度提升40%',
          impact: '详细的工作描述能更好地展示能力',
          priority: 70
        });
        score -= 20;
      } else {
        // 检查是否包含成就动词
        const hasAchievementVerbs = ACHIEVEMENT_VERBS.some(verb => 
          exp.description.includes(verb)
        );
        if (!hasAchievementVerbs) {
          suggestions.push({
            id: `experience-achievement-${index}`,
            type: 'content',
            severity: 'low',
            section: '工作经验',
            title: `第${index + 1}段经历建议使用成就导向的描述`,
            description: '使用动作词汇能更好地展示您的贡献',
            suggestion: '使用"提升"、"优化"、"实现"等动词开头描述工作成果',
            impact: '成就导向的描述更有说服力',
            priority: 50
          });
          score -= 5;
        }

        // 检查是否包含数字
        const hasNumbers = /\d+/.test(exp.description);
        if (!hasNumbers) {
          suggestions.push({
            id: `experience-numbers-${index}`,
            type: 'content',
            severity: 'medium',
            section: '工作经验',
            title: `第${index + 1}段经历建议添加量化数据`,
            description: '量化的成果更有说服力',
            suggestion: '在描述中加入具体数字，如提升百分比、项目数量、团队规模等',
            example: '管理团队从3人扩展到8人，项目交付效率提升35%',
            impact: '量化数据能更直观地展示工作成果',
            priority: 65
          });
          score -= 10;
        } else {
          strengths.push('工作描述包含量化数据');
        }
      }
    });

      if (experience.length >= 2) {
        strengths.push('工作经验丰富');
      }

      return { suggestions, strengths, weaknesses, score };
    } catch (error) {
      console.error('工作经验分析错误:', error);
      return {
        suggestions: [],
        strengths: [],
        weaknesses: ['工作经验分析失败'],
        score: 0
      };
    }
  }

  // 分析教育背景
  private analyzeEducation(education: any[]) {
    try {
      if (!Array.isArray(education)) {
        throw new Error('教育背景数据格式错误');
      }
      
      const suggestions: OptimizationSuggestion[] = [];
      const strengths: string[] = [];
      const weaknesses: string[] = [];
      let score = 100;

      if (!education || education.length === 0) {
      suggestions.push({
        id: 'education-empty',
        type: 'content',
        severity: 'high',
        section: '教育背景',
        title: '缺少教育背景',
        description: '教育背景是简历的重要组成部分',
        suggestion: '添加您的教育经历，包括学校、专业、学历和毕业时间',
        impact: '缺少教育背景可能影响HR对您的评估',
        priority: 80
      });
      score = 50;
      weaknesses.push('缺少教育背景');
      return { suggestions, strengths, weaknesses, score };
    }

    education.forEach((edu, index) => {
      if (!edu.school?.trim()) {
        suggestions.push({
          id: `education-school-${index}`,
          type: 'content',
          severity: 'medium',
          section: '教育背景',
          title: `第${index + 1}段教育经历缺少学校名称`,
          description: '请填写完整的学校名称',
          suggestion: '添加学校的完整名称',
          impact: '学校信息有助于HR了解您的教育背景',
          priority: 60
        });
        score -= 15;
      }

      if (!edu.degree?.trim()) {
        suggestions.push({
          id: `education-degree-${index}`,
          type: 'content',
          severity: 'medium',
          section: '教育背景',
          title: `第${index + 1}段教育经历缺少学历信息`,
          description: '请填写学历层次',
          suggestion: '添加学历信息，如本科、硕士、博士等',
          impact: '学历信息是重要的筛选条件',
          priority: 70
        });
        score -= 15;
      }

      if (!edu.major?.trim()) {
        suggestions.push({
          id: `education-major-${index}`,
          type: 'content',
          severity: 'low',
          section: '教育背景',
          title: `第${index + 1}段教育经历建议添加专业信息`,
          description: '专业信息有助于展示专业背景',
          suggestion: '添加所学专业名称',
          impact: '专业背景与职位匹配度是重要考量因素',
          priority: 50
        });
        score -= 10;
      }
    });

      if (education.length > 0) {
        strengths.push('教育背景完整');
      }

      return { suggestions, strengths, weaknesses, score };
    } catch (error) {
      console.error('教育背景分析错误:', error);
      return {
        suggestions: [],
        strengths: [],
        weaknesses: ['教育背景分析失败'],
        score: 0
      };
    }
  }

  // 分析技能
  private analyzeSkills(skills: any[], targetIndustry?: string) {
    try {
      if (!Array.isArray(skills)) {
        throw new Error('技能数据格式错误');
      }
      
      const suggestions: OptimizationSuggestion[] = [];
      const strengths: string[] = [];
      const weaknesses: string[] = [];
      let score = 100;

      if (!skills || skills.length === 0) {
      suggestions.push({
        id: 'skills-empty',
        type: 'content',
        severity: 'high',
        section: '技能特长',
        title: '缺少技能信息',
        description: '技能是展示专业能力的重要部分',
        suggestion: '添加与目标职位相关的专业技能',
        impact: '技能信息是HR筛选的重要依据',
        priority: 85
      });
      score = 30;
      weaknesses.push('缺少技能信息');
      return { suggestions, strengths, weaknesses, score };
    }

    // 检查技能数量
    if (skills.length < 5) {
      suggestions.push({
        id: 'skills-few',
        type: 'content',
        severity: 'medium',
        section: '技能特长',
        title: '技能数量较少',
        description: '建议添加更多相关技能',
        suggestion: '补充更多专业技能，建议5-10个核心技能',
        impact: '更多技能展示能提高匹配度',
        priority: 60
      });
      score -= 20;
    } else if (skills.length > 15) {
      suggestions.push({
        id: 'skills-many',
        type: 'structure',
        severity: 'low',
        section: '技能特长',
        title: '技能过多',
        description: '技能列表过长可能分散注意力',
        suggestion: '保留最核心的10-12个技能，突出重点',
        impact: '精简的技能列表更有针对性',
        priority: 30
      });
      score -= 10;
    } else {
      strengths.push('技能数量适中');
    }

    // 检查行业相关技能
    if (targetIndustry && INDUSTRY_KEYWORDS[targetIndustry as keyof typeof INDUSTRY_KEYWORDS]) {
      const industryKeywords = INDUSTRY_KEYWORDS[targetIndustry as keyof typeof INDUSTRY_KEYWORDS];
      const skillNames = skills.map(skill => skill.name || skill).join(' ');
      const matchedKeywords = industryKeywords.filter(keyword => 
        skillNames.toLowerCase().includes(keyword.toLowerCase())
      );
      
      if (matchedKeywords.length < 3) {
        suggestions.push({
          id: 'skills-industry-match',
          type: 'keyword',
          severity: 'medium',
          section: '技能特长',
          title: '缺少行业相关技能',
          description: `建议添加更多${targetIndustry}行业相关技能`,
          suggestion: `考虑添加以下技能：${industryKeywords.slice(0, 5).join('、')}`,
          impact: '行业相关技能能提高简历匹配度',
          priority: 75
        });
        score -= 15;
      } else {
        strengths.push('技能与目标行业匹配');
      }
    }

      return { suggestions, strengths, weaknesses, score };
    } catch (error) {
      console.error('技能分析错误:', error);
      return {
        suggestions: [],
        strengths: [],
        weaknesses: ['技能分析失败'],
        score: 0
      };
    }
  }

  // 关键词分析
  private analyzeKeywords(resume: ResumeData, targetIndustry?: string) {
    try {
    const allText = JSON.stringify(resume).toLowerCase();
    const present: string[] = [];
    const missing: string[] = [];
    const recommended: string[] = [];
    
    if (targetIndustry && INDUSTRY_KEYWORDS[targetIndustry as keyof typeof INDUSTRY_KEYWORDS]) {
      const industryKeywords = INDUSTRY_KEYWORDS[targetIndustry as keyof typeof INDUSTRY_KEYWORDS];
      
      industryKeywords.forEach(keyword => {
        if (allText.includes(keyword.toLowerCase())) {
          present.push(keyword);
        } else {
          missing.push(keyword);
        }
      });
      
      recommended.push(...missing.slice(0, 10));
    }
    
    // 检查软技能
    SOFT_SKILLS.forEach(skill => {
      if (allText.includes(skill.toLowerCase())) {
        present.push(skill);
      } else if (recommended.length < 15) {
        recommended.push(skill);
      }
    });
    
    const score = Math.min(100, (present.length / (present.length + missing.length)) * 100);
    
      return {
        score,
        missing,
        present,
        recommended
      };
    } catch (error) {
      console.error('关键词分析错误:', error);
      return {
        score: 0,
        missing: [],
        present: [],
        recommended: []
      };
    }
  }

  // 可读性分析
  private analyzeReadability(resume: ResumeData) {
    try {
    const issues: string[] = [];
    let score = 100;
    
    // 检查文本长度
    const allText = JSON.stringify(resume);
    if (allText.length < 500) {
      issues.push('简历内容过少，建议补充更多详细信息');
      score -= 30;
    } else if (allText.length > 3000) {
      issues.push('简历内容过多，建议精简重点信息');
      score -= 20;
    }
    
    // 检查段落结构
    const experienceText = resume.experience?.map(exp => exp.description).join(' ') || '';
    if (experienceText && !experienceText.includes('•') && !experienceText.includes('-')) {
      issues.push('建议使用项目符号组织工作描述');
      score -= 15;
    }
    
      return { score, issues };
    } catch (error) {
      console.error('可读性分析错误:', error);
      return {
        score: 0,
        issues: ['可读性分析失败']
      };
    }
  }

  // ATS兼容性分析
  private analyzeATSCompatibility(resume: ResumeData) {
    try {
      const issues: string[] = [];
      let score = 100;
      
      // 检查特殊字符
      const allText = JSON.stringify(resume);
      if (/[\u2022\u2013\u2014]/.test(allText)) {
        issues.push('避免使用特殊符号，建议使用标准的项目符号');
        score -= 10;
      }
      
      // 检查日期格式
      const datePattern = /\d{4}[-/]\d{1,2}[-/]\d{1,2}/;
      if (!datePattern.test(allText)) {
        issues.push('建议使用标准日期格式（YYYY-MM-DD）');
        score -= 15;
      }
      
      return { score, issues };
    } catch (error) {
      console.error('ATS兼容性分析错误:', error);
      return {
        score: 0,
        issues: ['ATS兼容性分析失败']
      };
    }
  }

  // 计算总分
  private calculateOverallScore(scores: Record<string, number>) {
    try {
      if (!scores || typeof scores !== 'object') {
        throw new Error('分数数据格式错误');
      }
      
      const weights = {
        personalInfo: 0.15,
        experience: 0.35,
        education: 0.15,
        skills: 0.20,
        keywords: 0.10,
        readability: 0.03,
        ats: 0.02
      };
      
      const totalScore = Object.entries(weights).reduce((total, [key, weight]) => {
        const score = scores[key] || 0;
        if (typeof score !== 'number' || isNaN(score)) {
          console.warn(`无效的分数值: ${key} = ${score}`);
          return total;
        }
        return total + Math.max(0, Math.min(100, score)) * weight;
      }, 0);
      
      return Math.round(Math.max(0, Math.min(100, totalScore)));
    } catch (error) {
      console.error('总分计算错误:', error);
      return 0;
    }
  }

  // 生成优化报告
  generateOptimizationReport(analysis: OptimizationAnalysis): string {
    try {
      if (!analysis || typeof analysis !== 'object') {
        throw new Error('分析结果数据无效');
      }
      
      const { score, suggestions, strengths, weaknesses } = analysis;
    
    let report = `# 简历优化报告\n\n`;
    report += `## 总体评分：${score}/100\n\n`;
    
    if (score >= 80) {
      report += `🎉 您的简历质量很高！`;
    } else if (score >= 60) {
      report += `👍 您的简历基础良好，还有提升空间。`;
    } else {
      report += `⚠️ 您的简历需要重点优化。`;
    }
    
    report += `\n\n## 优势\n`;
    strengths.forEach(strength => {
      report += `✅ ${strength}\n`;
    });
    
    report += `\n## 待改进项\n`;
    weaknesses.forEach(weakness => {
      report += `❌ ${weakness}\n`;
    });
    
    report += `\n## 优化建议\n`;
    suggestions.slice(0, 10).forEach((suggestion, index) => {
      const priority = suggestion.severity === 'critical' ? '🔴' : 
                     suggestion.severity === 'high' ? '🟠' : 
                     suggestion.severity === 'medium' ? '🟡' : '🟢';
      report += `\n### ${index + 1}. ${priority} ${suggestion.title}\n`;
      report += `**问题：** ${suggestion.description}\n`;
      report += `**建议：** ${suggestion.suggestion}\n`;
      if (suggestion.example) {
        report += `**示例：** ${suggestion.example}\n`;
      }
      report += `**影响：** ${suggestion.impact}\n`;
    });
    
      return report;
    } catch (error) {
      console.error('生成优化报告错误:', error);
      return `# 简历优化报告\n\n⚠️ 报告生成失败，请稍后重试。\n\n错误信息：${error instanceof Error ? error.message : '未知错误'}`;
    }
  }
}

// 导出单例实例
export const aiOptimizer = AIResumeOptimizer.getInstance();