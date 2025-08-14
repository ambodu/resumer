// 数据导出层工具函数

import {
  PDFMakeStyle,
  PDFMakeContent,
  PDFMakeDocumentDefinition,
  PDFMakeMargins,
  PDFMakePageSize
} from './types';
import { StyleConfig } from '../data-transform-layer/types';

// PDF 样式工具
export class PDFStyleUtils {
  // 合并样式
  static mergeStyles(...styles: (PDFMakeStyle | undefined)[]): PDFMakeStyle {
    return styles.reduce((merged, style) => {
      if (!style) return merged;
      return { ...merged, ...style };
    }, {} as PDFMakeStyle);
  }
  
  // 创建基础样式
  static createBaseStyle(config: StyleConfig): Record<string, PDFMakeStyle> {
    return {
      header: {
        fontSize: config.fonts?.sizes?.h1 || 24,
        bold: true,
        color: config.colors?.primary || '#000000',
        margin: [0, 0, 0, 10]
      },
      subheader: {
        fontSize: config.fonts?.sizes?.h2 || 18,
        bold: true,
        color: config.colors?.secondary || '#333333',
        margin: [0, 10, 0, 5]
      },
      normal: {
        fontSize: config.fonts?.sizes?.body || 12,
        color: config.colors?.text || '#000000',
        lineHeight: config.spacing?.lineHeight || 1.2
      },
      small: {
        fontSize: (config.fonts?.sizes?.body || 12) - 2,
        color: config.colors?.textSecondary || '#666666'
      },
      bold: {
        bold: true
      },
      italic: {
        italics: true
      },
      link: {
        color: config.colors?.accent || '#0066cc',
        decoration: 'underline'
      }
    };
  }
  
  // 创建表格样式
  static createTableStyle(config: StyleConfig): PDFMakeStyle {
    return {
      margin: [0, 5, 0, 15],
      table: {
        headerRows: 1,
        widths: ['*'],
        body: []
      },
      layout: {
        hLineWidth: () => 0.5,
        vLineWidth: () => 0,
        hLineColor: () => config.colors?.border || '#cccccc',
        paddingLeft: () => 0,
        paddingRight: () => 0,
        paddingTop: () => 5,
        paddingBottom: () => 5
      }
    };
  }
  
  // 创建列表样式
  static createListStyle(config: StyleConfig): PDFMakeStyle {
    return {
      margin: [0, 5, 0, 10],
      fontSize: config.fonts?.sizes?.body || 12,
      color: config.colors?.text || '#000000'
    };
  }
  
  // 颜色工具
  static lightenColor(color: string, amount: number): string {
    const hex = color.replace('#', '');
    const num = parseInt(hex, 16);
    const r = Math.min(255, Math.floor((num >> 16) + amount));
    const g = Math.min(255, Math.floor(((num >> 8) & 0x00FF) + amount));
    const b = Math.min(255, Math.floor((num & 0x0000FF) + amount));
    return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`;
  }
  
  static darkenColor(color: string, amount: number): string {
    return this.lightenColor(color, -amount);
  }
  
  // 响应式字体大小
  static getResponsiveFontSize(baseSize: number, pageSize: PDFMakePageSize): number {
    const sizeMultipliers: Record<string, number> = {
      'A4': 1,
      'A3': 1.2,
      'A5': 0.8,
      'LETTER': 1,
      'LEGAL': 1.1
    };
    
    const multiplier = sizeMultipliers[pageSize as string] || 1;
    return Math.round(baseSize * multiplier);
  }
}

// PDF 内容工具
export class PDFContentUtils {
  // 创建分隔线
  static createSeparator(color: string = '#cccccc', margin: number[] = [0, 10, 0, 10]): PDFMakeContent {
    return {
      canvas: [
        {
          type: 'line',
          x1: 0,
          y1: 0,
          x2: 515, // A4 宽度减去边距
          y2: 0,
          lineWidth: 0.5,
          lineColor: color
        }
      ],
      margin
    };
  }
  
  // 创建空白间距
  static createSpacer(height: number): PDFMakeContent {
    return {
      text: '',
      margin: [0, 0, 0, height]
    };
  }
  
  // 创建页眉
  static createHeader(text: string, style?: PDFMakeStyle): PDFMakeContent {
    return {
      text,
      style: ['header', ...(style ? [style] : [])],
      margin: [0, 0, 0, 20]
    };
  }
  
  // 创建页脚
  static createFooter(text: string, pageNumber?: boolean): PDFMakeContent {
    const content: PDFMakeContent[] = [];
    
    if (text) {
      content.push({
        text,
        style: 'small',
        alignment: 'center'
      });
    }
    
    if (pageNumber) {
      content.push({
        text: 'Page ',
        style: 'small',
        alignment: 'center'
      });
      content.push({
        text: { currentPage: {} },
        style: 'small'
      });
      content.push({
        text: ' of ',
        style: 'small'
      });
      content.push({
        text: { pageCount: {} },
        style: 'small'
      });
    }
    
    return {
      columns: content,
      margin: [0, 10, 0, 0]
    };
  }
  
  // 创建两列布局
  static createTwoColumns(
    leftContent: PDFMakeContent,
    rightContent: PDFMakeContent,
    leftWidth: string | number = '*',
    rightWidth: string | number = '*',
    gap: number = 20
  ): PDFMakeContent {
    return {
      columns: [
        {
          width: leftWidth,
          ...leftContent
        },
        {
          width: gap,
          text: ''
        },
        {
          width: rightWidth,
          ...rightContent
        }
      ]
    };
  }
  
  // 创建网格布局
  static createGrid(
    items: PDFMakeContent[],
    columns: number,
    gap: number = 10
  ): PDFMakeContent[] {
    const rows: PDFMakeContent[] = [];
    
    for (let i = 0; i < items.length; i += columns) {
      const rowItems = items.slice(i, i + columns);
      const columnWidths: (string | number)[] = [];
      const columnContents: PDFMakeContent[] = [];
      
      for (let j = 0; j < columns; j++) {
        if (j < rowItems.length) {
          columnWidths.push('*');
          columnContents.push(rowItems[j]);
        } else {
          columnWidths.push('*');
          columnContents.push({ text: '' });
        }
        
        // 添加间距列（除了最后一列）
        if (j < columns - 1) {
          columnWidths.push(gap);
          columnContents.push({ text: '' });
        }
      }
      
      rows.push({
        columns: columnContents.map((content, index) => ({
          width: columnWidths[index],
          ...content
        }))
      });
    }
    
    return rows;
  }
  
  // 文本处理
  static truncateText(text: string, maxLength: number, suffix: string = '...'): string {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength - suffix.length) + suffix;
  }
  
  static wrapText(text: string, maxWidth: number, fontSize: number): string[] {
    // 简单的文本换行实现
    const words = text.split(' ');
    const lines: string[] = [];
    let currentLine = '';
    
    // 估算字符宽度（简化计算）
    const charWidth = fontSize * 0.6;
    const maxChars = Math.floor(maxWidth / charWidth);
    
    for (const word of words) {
      const testLine = currentLine ? `${currentLine} ${word}` : word;
      
      if (testLine.length <= maxChars) {
        currentLine = testLine;
      } else {
        if (currentLine) {
          lines.push(currentLine);
          currentLine = word;
        } else {
          // 单词太长，强制换行
          lines.push(word);
        }
      }
    }
    
    if (currentLine) {
      lines.push(currentLine);
    }
    
    return lines;
  }
  
  // 创建进度条
  static createProgressBar(
    percentage: number,
    width: number = 100,
    height: number = 10,
    fillColor: string = '#4CAF50',
    backgroundColor: string = '#E0E0E0'
  ): PDFMakeContent {
    const fillWidth = (width * percentage) / 100;
    
    return {
      canvas: [
        // 背景
        {
          type: 'rect',
          x: 0,
          y: 0,
          w: width,
          h: height,
          color: backgroundColor
        },
        // 填充
        {
          type: 'rect',
          x: 0,
          y: 0,
          w: fillWidth,
          h: height,
          color: fillColor
        }
      ],
      margin: [0, 2, 0, 2]
    };
  }
  
  // 创建评分星星
  static createStarRating(
    rating: number,
    maxRating: number = 5,
    starSize: number = 12,
    fillColor: string = '#FFD700',
    emptyColor: string = '#E0E0E0'
  ): PDFMakeContent {
    const stars: PDFMakeContent[] = [];
    
    for (let i = 1; i <= maxRating; i++) {
      const isFilled = i <= rating;
      stars.push({
        text: '★',
        fontSize: starSize,
        color: isFilled ? fillColor : emptyColor,
        margin: [0, 0, 2, 0]
      });
    }
    
    return {
      columns: stars
    };
  }
}

// PDF 布局工具
export class PDFLayoutUtils {
  // 计算页面尺寸
  static getPageDimensions(pageSize: PDFMakePageSize, orientation: 'portrait' | 'landscape' = 'portrait') {
    const dimensions: Record<string, { width: number; height: number }> = {
      'A4': { width: 595.28, height: 841.89 },
      'A3': { width: 841.89, height: 1190.55 },
      'A5': { width: 420.94, height: 595.28 },
      'LETTER': { width: 612, height: 792 },
      'LEGAL': { width: 612, height: 1008 }
    };
    
    const size = dimensions[pageSize as string] || dimensions['A4'];
    
    if (orientation === 'landscape') {
      return { width: size.height, height: size.width };
    }
    
    return size;
  }
  
  // 计算内容区域
  static getContentArea(pageSize: PDFMakePageSize, margins: PDFMakeMargins, orientation: 'portrait' | 'landscape' = 'portrait') {
    const pageDimensions = this.getPageDimensions(pageSize, orientation);
    const marginArray = Array.isArray(margins) ? margins : [margins, margins, margins, margins];
    
    const [left, top, right, bottom] = marginArray;
    
    return {
      width: pageDimensions.width - left - right,
      height: pageDimensions.height - top - bottom,
      left,
      top,
      right,
      bottom
    };
  }
  
  // 计算列宽
  static calculateColumnWidths(totalWidth: number, columns: (string | number)[], gaps: number[] = []): number[] {
    const gapTotal = gaps.reduce((sum, gap) => sum + gap, 0);
    const availableWidth = totalWidth - gapTotal;
    
    // 计算固定宽度的总和
    let fixedWidth = 0;
    let flexColumns = 0;
    
    columns.forEach(col => {
      if (typeof col === 'number') {
        fixedWidth += col;
      } else if (col === '*') {
        flexColumns++;
      } else if (col.endsWith('%')) {
        const percentage = parseFloat(col.replace('%', '')) / 100;
        fixedWidth += availableWidth * percentage;
      }
    });
    
    const flexWidth = (availableWidth - fixedWidth) / flexColumns;
    
    return columns.map(col => {
      if (typeof col === 'number') {
        return col;
      } else if (col === '*') {
        return flexWidth;
      } else if (col.endsWith('%')) {
        const percentage = parseFloat(col.replace('%', '')) / 100;
        return availableWidth * percentage;
      }
      return 0;
    });
  }
  
  // 自适应布局
  static createResponsiveLayout(
    content: PDFMakeContent[],
    pageSize: PDFMakePageSize,
    margins: PDFMakeMargins
  ): PDFMakeContent[] {
    const contentArea = this.getContentArea(pageSize, margins);
    const isSmallPage = contentArea.width < 400;
    
    return content.map(item => {
      if (isSmallPage && typeof item === 'object' && 'columns' in item) {
        // 在小页面上将列布局转换为堆叠布局
        return {
          stack: (item.columns as PDFMakeContent[]).filter(col => 
            typeof col === 'object' && 'text' in col && col.text !== ''
          )
        };
      }
      return item;
    });
  }
}

// PDF 验证工具
export class PDFValidationUtils {
  // 验证文档定义
  static validateDocumentDefinition(docDef: PDFMakeDocumentDefinition): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    // 检查必需字段
    if (!docDef.content) {
      errors.push('Document definition must have content');
    }
    
    // 检查页面设置
    if (docDef.pageSize && !this.isValidPageSize(docDef.pageSize)) {
      errors.push(`Invalid page size: ${docDef.pageSize}`);
    }
    
    if (docDef.pageOrientation && !['portrait', 'landscape'].includes(docDef.pageOrientation)) {
      errors.push(`Invalid page orientation: ${docDef.pageOrientation}`);
    }
    
    // 检查边距
    if (docDef.pageMargins && !this.isValidMargins(docDef.pageMargins)) {
      errors.push('Invalid page margins');
    }
    
    // 检查样式
    if (docDef.styles) {
      const styleErrors = this.validateStyles(docDef.styles);
      errors.push(...styleErrors);
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }
  
  // 验证页面大小
  private static isValidPageSize(pageSize: any): boolean {
    const validSizes = ['A4', 'A3', 'A5', 'LETTER', 'LEGAL'];
    return validSizes.includes(pageSize) || 
           (typeof pageSize === 'object' && pageSize.width && pageSize.height);
  }
  
  // 验证边距
  private static isValidMargins(margins: any): boolean {
    if (typeof margins === 'number') return margins >= 0;
    if (Array.isArray(margins)) {
      return margins.length <= 4 && margins.every(m => typeof m === 'number' && m >= 0);
    }
    return false;
  }
  
  // 验证样式
  private static validateStyles(styles: Record<string, any>): string[] {
    const errors: string[] = [];
    
    Object.entries(styles).forEach(([name, style]) => {
      if (typeof style !== 'object') {
        errors.push(`Style '${name}' must be an object`);
        return;
      }
      
      // 检查字体大小
      if (style.fontSize && (typeof style.fontSize !== 'number' || style.fontSize <= 0)) {
        errors.push(`Style '${name}' has invalid fontSize`);
      }
      
      // 检查颜色格式
      if (style.color && !this.isValidColor(style.color)) {
        errors.push(`Style '${name}' has invalid color format`);
      }
      
      // 检查边距
      if (style.margin && !this.isValidMargins(style.margin)) {
        errors.push(`Style '${name}' has invalid margin`);
      }
    });
    
    return errors;
  }
  
  // 验证颜色格式
  private static isValidColor(color: string): boolean {
    // 简单的颜色格式验证
    const hexPattern = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
    const namedColors = ['black', 'white', 'red', 'green', 'blue', 'yellow', 'cyan', 'magenta'];
    
    return hexPattern.test(color) || namedColors.includes(color.toLowerCase());
  }
}

// 导出所有工具
export const PDFUtils = {
  Style: PDFStyleUtils,
  Content: PDFContentUtils,
  Layout: PDFLayoutUtils,
  Validation: PDFValidationUtils
};