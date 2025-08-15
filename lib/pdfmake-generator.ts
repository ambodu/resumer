"use client";

import { TDocumentDefinitions, Content, TableCell, Style } from 'pdfmake/interfaces';
import { ResumeData, PersonalInfo, Experience, Education } from './types';

// 动态导入pdfmake以避免SSR问题
let pdfMake: any = null;
let isInitializing = false;

const initializePdfMake = async () => {
  if (typeof window === 'undefined') {
    throw new Error('PDF生成器只能在浏览器环境中使用');
  }
  
  if (pdfMake) {
    return pdfMake;
  }
  
  if (isInitializing) {
    // 等待初始化完成
    while (isInitializing) {
      await new Promise(resolve => setTimeout(resolve, 50));
    }
    return pdfMake;
  }
  
  try {
    isInitializing = true;
    
    try {
      // 动态导入pdfmake
      const pdfMakeModule = await import('pdfmake/build/pdfmake');
      pdfMake = pdfMakeModule.default || pdfMakeModule;
      
      if (!pdfMake) {
        throw new Error('pdfMake模块加载失败');
      }
      
      // 动态导入字体文件
      const pdfFonts = await import('pdfmake/build/vfs_fonts');
      
      // 尝试不同的字体文件结构
      if (pdfFonts.pdfMake && pdfFonts.pdfMake.vfs) {
        pdfMake.vfs = pdfFonts.pdfMake.vfs;
      } else if (pdfFonts.default && pdfFonts.default.pdfMake && pdfFonts.default.pdfMake.vfs) {
        pdfMake.vfs = pdfFonts.default.pdfMake.vfs;
      } else if (pdfFonts.vfs) {
        pdfMake.vfs = pdfFonts.vfs;
      } else if (pdfFonts.default && pdfFonts.default.vfs) {
        pdfMake.vfs = pdfFonts.default.vfs;
      } else {
        // 如果都没有，尝试直接使用pdfFonts
        console.warn('使用备用字体设置方案');
        pdfMake.vfs = pdfFonts;
      }
      
      // 设置默认字体
      pdfMake.fonts = {
        Roboto: {
          normal: 'Roboto-Regular.ttf',
          bold: 'Roboto-Medium.ttf',
          italics: 'Roboto-Italic.ttf',
          bolditalics: 'Roboto-MediumItalic.ttf'
        }
      };
      
    } catch (fontError) {
      console.warn('字体文件加载失败，使用无字体模式:', fontError);
      // 如果字体加载失败，设置一个空的vfs
      pdfMake.vfs = {};
      pdfMake.fonts = {
        Roboto: {
          normal: 'Helvetica',
          bold: 'Helvetica-Bold',
          italics: 'Helvetica-Oblique',
          bolditalics: 'Helvetica-BoldOblique'
        }
      };
    }
    
    console.log('pdfMake初始化成功');
    return pdfMake;
    
  } catch (error) {
    console.error('pdfMake初始化失败:', error);
    pdfMake = null;
    throw new Error(`PDF生成器初始化失败: ${error instanceof Error ? error.message : '未知错误'}`);
  } finally {
    isInitializing = false;
  }
};

// PDF样式定义
const styles: { [key: string]: Style } = {
  header: {
    fontSize: 24,
    bold: true,
    alignment: 'center',
    margin: [0, 0, 0, 20]
  },
  subheader: {
    fontSize: 18,
    bold: true,
    margin: [0, 20, 0, 10],
    color: '#2563eb'
  },
  sectionTitle: {
    fontSize: 16,
    bold: true,
    margin: [0, 15, 0, 8],
    color: '#1f2937'
  },
  jobTitle: {
    fontSize: 14,
    bold: true,
    margin: [0, 8, 0, 2]
  },
  company: {
    fontSize: 12,
    color: '#2563eb',
    margin: [0, 0, 0, 2]
  },
  dateRange: {
    fontSize: 10,
    color: '#6b7280',
    margin: [0, 0, 0, 5]
  },
  description: {
    fontSize: 11,
    lineHeight: 1.4,
    margin: [0, 0, 0, 10]
  },
  contactInfo: {
    fontSize: 11,
    alignment: 'center',
    margin: [0, 0, 0, 15]
  },
  summary: {
    fontSize: 11,
    lineHeight: 1.4,
    margin: [0, 0, 0, 15],
    alignment: 'justify'
  },
  skillItem: {
    fontSize: 11,
    margin: [0, 2, 0, 2]
  }
};

// PDF生成器类
export class PdfMakeGenerator {
  private static instance: PdfMakeGenerator;
  
  private constructor() {}
  
  public static getInstance(): PdfMakeGenerator {
    if (!PdfMakeGenerator.instance) {
      PdfMakeGenerator.instance = new PdfMakeGenerator();
    }
    return PdfMakeGenerator.instance;
  }
  
  // 生成PDF文档定义
  private createDocumentDefinition(resumeData: ResumeData): TDocumentDefinitions {
    const content: Content[] = [];
    
    // 个人信息部分
    if (resumeData.personalInfo) {
      content.push(...this.createPersonalInfoSection(resumeData.personalInfo));
    }
    
    // 工作经验部分
    if (resumeData.experience && resumeData.experience.length > 0) {
      content.push(...this.createExperienceSection(resumeData.experience));
    }
    
    // 教育背景部分
    if (resumeData.education && resumeData.education.length > 0) {
      content.push(...this.createEducationSection(resumeData.education));
    }
    
    // 技能部分
    if (resumeData.skills && resumeData.skills.length > 0) {
      content.push(...this.createSkillsSection(resumeData.skills));
    }
    
    return {
      content,
      styles,
      pageSize: 'A4',
      pageMargins: [40, 60, 40, 60],
      defaultStyle: {
        font: 'Roboto',
        fontSize: 11,
        lineHeight: 1.3
      }
    };
  }
  
  // 创建个人信息部分
  private createPersonalInfoSection(personalInfo: PersonalInfo): Content[] {
    const content: Content[] = [];
    
    // 姓名
    if (personalInfo.fullName) {
      content.push({
        text: personalInfo.fullName,
        style: 'header'
      });
    }
    
    // 职位标题
    if (personalInfo.title) {
      content.push({
        text: personalInfo.title,
        style: 'subheader'
      });
    }
    
    // 联系信息
    const contactItems: string[] = [];
    if (personalInfo.email) contactItems.push(personalInfo.email);
    if (personalInfo.phone) contactItems.push(personalInfo.phone);
    if (personalInfo.location) contactItems.push(personalInfo.location);
    if (personalInfo.website) contactItems.push(personalInfo.website);
    
    if (contactItems.length > 0) {
      content.push({
        text: contactItems.join(' • '),
        style: 'contactInfo'
      });
    }
    
    // 个人简介
    if (personalInfo.summary) {
      content.push({
        text: personalInfo.summary,
        style: 'summary'
      });
    }
    
    return content;
  }
  
  // 创建工作经验部分
  private createExperienceSection(experiences: Experience[]): Content[] {
    const content: Content[] = [];
    
    content.push({
      text: '工作经验',
      style: 'sectionTitle'
    });
    
    experiences.forEach((exp, index) => {
      // 职位名称
      if (exp.position) {
        content.push({
          text: exp.position,
          style: 'jobTitle'
        });
      }
      
      // 公司名称
      if (exp.company) {
        content.push({
          text: exp.company,
          style: 'company'
        });
      }
      
      // 工作时间
      const dateText = `${exp.startDate} - ${exp.endDate || '至今'}`;
      content.push({
        text: dateText,
        style: 'dateRange'
      });
      
      // 工作描述
      if (exp.description) {
        content.push({
          text: exp.description,
          style: 'description'
        });
      }
      
      // 添加间距（除了最后一项）
      if (index < experiences.length - 1) {
        content.push({ text: '', margin: [0, 0, 0, 10] });
      }
    });
    
    return content;
  }
  
  // 创建教育背景部分
  private createEducationSection(educations: Education[]): Content[] {
    const content: Content[] = [];
    
    content.push({
      text: '教育背景',
      style: 'sectionTitle'
    });
    
    educations.forEach((edu, index) => {
      // 学位和专业
      const degreeText = `${edu.degree}${edu.field ? ` - ${edu.field}` : ''}`;
      content.push({
        text: degreeText,
        style: 'jobTitle'
      });
      
      // 学校名称
      if (edu.school) {
        content.push({
          text: edu.school,
          style: 'company'
        });
      }
      
      // 时间
      const dateText = `${edu.startDate} - ${edu.endDate}`;
      content.push({
        text: dateText,
        style: 'dateRange'
      });
      
      // GPA（如果有）
      if (edu.gpa) {
        content.push({
          text: `GPA: ${edu.gpa}`,
          style: 'description'
        });
      }
      
      // 添加间距（除了最后一项）
      if (index < educations.length - 1) {
        content.push({ text: '', margin: [0, 0, 0, 10] });
      }
    });
    
    return content;
  }
  
  // 创建技能部分
  private createSkillsSection(skills: string[]): Content[] {
    const content: Content[] = [];
    
    content.push({
      text: '专业技能',
      style: 'sectionTitle'
    });
    
    // 将技能分为多列显示
    const skillsPerColumn = Math.ceil(skills.length / 2);
    const leftColumn = skills.slice(0, skillsPerColumn);
    const rightColumn = skills.slice(skillsPerColumn);
    
    const tableBody: TableCell[][] = [];
    const maxRows = Math.max(leftColumn.length, rightColumn.length);
    
    for (let i = 0; i < maxRows; i++) {
      const row: TableCell[] = [
        leftColumn[i] ? { text: `• ${leftColumn[i]}`, style: 'skillItem' } : '',
        rightColumn[i] ? { text: `• ${rightColumn[i]}`, style: 'skillItem' } : ''
      ];
      tableBody.push(row);
    }
    
    content.push({
      table: {
        widths: ['50%', '50%'],
        body: tableBody
      },
      layout: 'noBorders'
    });
    
    return content;
  }
  
  // 生成并下载PDF
  public async generatePDF(resumeData: ResumeData, filename?: string): Promise<void> {
    try {
      const pdfMakeInstance = await initializePdfMake();
      if (!pdfMakeInstance) {
        throw new Error('PDF生成器初始化失败');
      }
      
      const docDefinition = this.createDocumentDefinition(resumeData);
      const pdfDocGenerator = pdfMakeInstance.createPdf(docDefinition);
      
      const finalFilename = filename || `${resumeData.personalInfo?.fullName || '简历'}.pdf`;
      
      // 下载PDF
      pdfDocGenerator.download(finalFilename);
    } catch (error) {
      console.error('PDF生成失败:', error);
      throw new Error('PDF生成失败，请重试');
    }
  }
  
  // 生成PDF Blob
  public async generatePDFBlob(resumeData: ResumeData): Promise<Blob> {
    try {
      const pdfMakeInstance = await initializePdfMake();
      if (!pdfMakeInstance) {
        throw new Error('PDF生成器初始化失败');
      }
      
      const docDefinition = this.createDocumentDefinition(resumeData);
      const pdfDocGenerator = pdfMakeInstance.createPdf(docDefinition);
      
      return new Promise((resolve, reject) => {
        pdfDocGenerator.getBlob((blob: Blob) => {
          resolve(blob);
        });
      });
    } catch (error) {
      console.error('PDF Blob生成失败:', error);
      throw new Error('PDF生成失败，请重试');
    }
  }
  
  // 预览PDF（在新窗口中打开）
  public async previewPDF(resumeData: ResumeData): Promise<void> {
    try {
      const pdfMakeInstance = await initializePdfMake();
      if (!pdfMakeInstance) {
        throw new Error('PDF生成器初始化失败');
      }
      
      const docDefinition = this.createDocumentDefinition(resumeData);
      const pdfDocGenerator = pdfMakeInstance.createPdf(docDefinition);
      
      pdfDocGenerator.open();
    } catch (error) {
      console.error('PDF预览失败:', error);
      throw new Error('PDF预览失败，请重试');
    }
  }
}

// 导出单例实例
export const pdfMakeGenerator = PdfMakeGenerator.getInstance();