"use client";

import { ResumeData } from './types';
import { pdfMakeGenerator } from './pdfmake-generator';

// PDF生成配置
interface PDFConfig {
  format: 'A4' | 'Letter';
  orientation: 'portrait' | 'landscape';
  margin: number;
  scale: number;
  quality: number;
}

// 默认配置
const DEFAULT_CONFIG: PDFConfig = {
  format: 'A4',
  orientation: 'portrait',
  margin: 20,
  scale: 2,
  quality: 0.95
};

// 优化的PDF生成器
export class PDFGenerator {
  private static instance: PDFGenerator;
  private config: PDFConfig = DEFAULT_CONFIG;
  
  private constructor() {}
  
  public static getInstance(): PDFGenerator {
    if (!PDFGenerator.instance) {
      PDFGenerator.instance = new PDFGenerator();
    }
    return PDFGenerator.instance;
  }
  
  // 设置配置
  public setConfig(config: Partial<PDFConfig>): void {
    this.config = { ...this.config, ...config };
  }
  
  // 生成PDF（使用pdfmake，支持可选择文本）
  public async generatePDF(elementOrData: HTMLElement | ResumeData, options?: { filename?: string }): Promise<void> {
    try {
      // 如果传入的是ResumeData，直接使用pdfmake生成
      if (this.isResumeData(elementOrData)) {
        await pdfMakeGenerator.generatePDF(elementOrData, options?.filename);
        return;
      }
      
      // 如果传入的是HTMLElement，回退到原有方案
      const filename = options?.filename || 'resume.pdf';
      await this.generatePDFWithCanvas(elementOrData, filename);
    } catch (error) {
      console.error('PDF生成失败:', error);
      throw new Error('PDF生成失败，请重试');
    }
  }
  
  // 类型检查辅助函数
  private isResumeData(data: any): data is ResumeData {
    return data && typeof data === 'object' && 'personalInfo' in data;
  }
  
  // 使用pdfmake生成PDF（推荐方法）
  public async generatePDFFromData(resumeData: ResumeData, filename?: string): Promise<void> {
    try {
      await pdfMakeGenerator.generatePDF(resumeData, filename);
    } catch (error) {
      console.error('PDF生成失败:', error);
      throw new Error('PDF生成失败，请重试');
    }
  }
  
  // 预览PDF
  public async previewPDF(resumeData: ResumeData): Promise<void> {
    try {
      await pdfMakeGenerator.previewPDF(resumeData);
    } catch (error) {
      console.error('PDF预览失败:', error);
      throw new Error('PDF预览失败，请重试');
    }
  }
  
  // 生成PDF Blob
  public async generatePDFBlob(resumeData: ResumeData): Promise<Blob> {
    try {
      return await pdfMakeGenerator.generatePDFBlob(resumeData);
    } catch (error) {
      console.error('PDF Blob生成失败:', error);
      throw new Error('PDF生成失败，请重试');
    }
  }
  
  // 使用浏览器原生打印API（备用方案）
  public async generatePDFWithPrint(element: HTMLElement, filename: string): Promise<void> {
    try {
      // 创建打印样式
      const printStyles = this.createPrintStyles();
      document.head.appendChild(printStyles);
      
      // 克隆元素以避免影响原始DOM
      const clonedElement = element.cloneNode(true) as HTMLElement;
      clonedElement.style.position = 'absolute';
      clonedElement.style.left = '-9999px';
      clonedElement.style.top = '0';
      clonedElement.style.width = '210mm'; // A4宽度
      clonedElement.style.minHeight = '297mm'; // A4高度
      clonedElement.style.padding = `${this.config.margin}mm`;
      clonedElement.style.backgroundColor = 'white';
      clonedElement.style.fontSize = '12px';
      clonedElement.style.lineHeight = '1.4';
      
      document.body.appendChild(clonedElement);
      
      // 等待字体和图片加载
      await this.waitForAssets();
      
      // 使用浏览器打印API
      const originalTitle = document.title;
      document.title = filename;
      
      // 隐藏其他元素
      const originalElements = Array.from(document.body.children);
      originalElements.forEach(el => {
        if (el !== clonedElement) {
          (el as HTMLElement).style.display = 'none';
        }
      });
      
      // 触发打印
      window.print();
      
      // 恢复页面状态
      document.title = originalTitle;
      originalElements.forEach(el => {
        (el as HTMLElement).style.display = '';
      });
      
      document.body.removeChild(clonedElement);
      document.head.removeChild(printStyles);
      
    } catch (error) {
      console.error('PDF生成失败:', error);
      throw new Error('PDF生成失败，请重试');
    }
  }
  
  // 使用html2canvas + jsPDF的备用方案
  public async generatePDFWithCanvas(element: HTMLElement, filename: string): Promise<void> {
    try {
      // 动态导入库以减少初始包大小
      const [{ default: html2canvas }, { default: jsPDF }] = await Promise.all([
        import('html2canvas'),
        import('jspdf')
      ]);
      
      // 生成canvas
      const canvas = await html2canvas(element, {
        scale: this.config.scale,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        logging: false,
        width: element.scrollWidth,
        height: element.scrollHeight,
        onclone: (clonedDoc) => {
          // 优化克隆文档
          const clonedElement = clonedDoc.body;
          clonedElement.style.transform = 'scale(1)';
          clonedElement.style.transformOrigin = 'top left';
        }
      });
      
      if (!canvas || canvas.width === 0 || canvas.height === 0) {
        throw new Error('无法生成有效的画布');
      }
      
      // 创建PDF
      const pdf = new jsPDF({
        orientation: this.config.orientation,
        unit: 'mm',
        format: this.config.format.toLowerCase() as 'a4' | 'letter'
      });
      
      const imgData = canvas.toDataURL('image/jpeg', this.config.quality);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = pdfWidth - (this.config.margin * 2);
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      let heightLeft = imgHeight;
      let position = this.config.margin;
      
      // 添加第一页
      pdf.addImage(imgData, 'JPEG', this.config.margin, position, imgWidth, imgHeight);
      heightLeft -= (pdfHeight - this.config.margin * 2);
      
      // 添加额外页面
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight + this.config.margin;
        pdf.addPage();
        pdf.addImage(imgData, 'JPEG', this.config.margin, position, imgWidth, imgHeight);
        heightLeft -= (pdfHeight - this.config.margin * 2);
      }
      
      // 保存PDF
      const sanitizedFilename = filename.replace(/[<>:"/\\|?*]/g, '_');
      pdf.save(sanitizedFilename);
      
    } catch (error) {
      console.error('Canvas PDF生成失败:', error);
      throw new Error('PDF生成失败，请检查网络连接后重试');
    }
  }
  
  // 创建打印样式
  private createPrintStyles(): HTMLStyleElement {
    const style = document.createElement('style');
    style.textContent = `
      @media print {
        * {
          -webkit-print-color-adjust: exact !important;
          color-adjust: exact !important;
        }
        
        @page {
          size: ${this.config.format};
          margin: ${this.config.margin}mm;
        }
        
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          font-size: 12px;
          line-height: 1.4;
          color: #000;
        }
        
        .no-print {
          display: none !important;
        }
        
        .page-break {
          page-break-before: always;
        }
        
        .avoid-break {
          page-break-inside: avoid;
        }
      }
    `;
    return style;
  }
  
  // 等待资源加载
  private waitForAssets(): Promise<void> {
    return new Promise((resolve) => {
      // 等待字体加载
      if (document.fonts && document.fonts.ready) {
        document.fonts.ready.then(() => {
          // 等待图片加载
          const images = Array.from(document.images);
          const imagePromises = images.map(img => {
            if (img.complete) return Promise.resolve();
            return new Promise(resolve => {
              img.onload = img.onerror = resolve;
            });
          });
          
          Promise.all(imagePromises).then(() => {
            setTimeout(resolve, 100); // 额外等待时间确保渲染完成
          });
        });
      } else {
        setTimeout(resolve, 500);
      }
    });
  }
  
  // 生成图片
  public async generateImage(element: HTMLElement, format: 'png' | 'jpeg' = 'png'): Promise<string> {
    try {
      const { default: html2canvas } = await import('html2canvas');
      
      const canvas = await html2canvas(element, {
        scale: this.config.scale,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        logging: false
      });
      
      const quality = format === 'jpeg' ? this.config.quality : undefined;
      return canvas.toDataURL(`image/${format}`, quality);
      
    } catch (error) {
      console.error('图片生成失败:', error);
      throw new Error('图片生成失败，请重试');
    }
  }
  
  // 下载图片
  public async downloadImage(element: HTMLElement, filename: string, format: 'png' | 'jpeg' = 'png'): Promise<void> {
    try {
      const dataURL = await this.generateImage(element, format);
      
      const link = document.createElement('a');
      link.download = `${filename}.${format}`;
      link.href = dataURL;
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
    } catch (error) {
      console.error('图片下载失败:', error);
      throw new Error('图片下载失败，请重试');
    }
  }
}

// 导出单例实例
export const pdfGenerator = PDFGenerator.getInstance();