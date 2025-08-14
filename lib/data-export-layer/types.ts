// 数据导出层类型定义

import { StyledResumeData } from '../data-transform-layer/types';

// PDFMake 基础类型定义
export interface PDFMakeMargins {
  left?: number;
  top?: number;
  right?: number;
  bottom?: number;
}

export interface PDFMakePageSize {
  width: number;
  height: number;
}

export interface PDFMakeStyle {
  fontSize?: number;
  fontFamily?: string;
  bold?: boolean;
  italics?: boolean;
  alignment?: 'left' | 'center' | 'right' | 'justify';
  color?: string;
  background?: string;
  decoration?: 'underline' | 'lineThrough' | 'overline';
  decorationStyle?: 'dashed' | 'dotted' | 'double' | 'wavy';
  decorationColor?: string;
  margin?: number | [number] | [number, number] | [number, number, number, number];
  marginLeft?: number;
  marginTop?: number;
  marginRight?: number;
  marginBottom?: number;
  lineHeight?: number;
  characterSpacing?: number;
  wordSpacing?: number;
  fillColor?: string;
  fillOpacity?: number;
}

export interface PDFMakeColumn {
  width?: number | string | 'auto' | '*';
  text?: string | PDFMakeContent[];
  stack?: PDFMakeContent[];
  columns?: PDFMakeColumn[];
  table?: PDFMakeTable;
  image?: string;
  svg?: string;
  canvas?: PDFMakeCanvas[];
  qr?: string;
  pageBreak?: 'before' | 'after';
  style?: string | string[];
  margin?: number | [number] | [number, number] | [number, number, number, number];
  alignment?: 'left' | 'center' | 'right' | 'justify';
  fontSize?: number;
  bold?: boolean;
  italics?: boolean;
  color?: string;
  background?: string;
  decoration?: 'underline' | 'lineThrough' | 'overline';
  decorationStyle?: 'dashed' | 'dotted' | 'double' | 'wavy';
  decorationColor?: string;
  lineHeight?: number;
  characterSpacing?: number;
  wordSpacing?: number;
  fillColor?: string;
  fillOpacity?: number;
  unbreakable?: boolean;
  headlineLevel?: number;
  tocItem?: boolean | string | string[];
  tocStyle?: string | string[];
  tocMargin?: number | [number] | [number, number] | [number, number, number, number];
  tocNumberStyle?: string | string[];
}

export interface PDFMakeTableCell {
  text?: string | PDFMakeContent[];
  stack?: PDFMakeContent[];
  columns?: PDFMakeColumn[];
  table?: PDFMakeTable;
  image?: string;
  svg?: string;
  canvas?: PDFMakeCanvas[];
  qr?: string;
  style?: string | string[];
  colSpan?: number;
  rowSpan?: number;
  fillColor?: string;
  fillOpacity?: number;
  border?: [boolean, boolean, boolean, boolean];
  borderColor?: [string, string, string, string] | string;
  margin?: number | [number] | [number, number] | [number, number, number, number];
  alignment?: 'left' | 'center' | 'right' | 'justify';
  fontSize?: number;
  bold?: boolean;
  italics?: boolean;
  color?: string;
  background?: string;
  decoration?: 'underline' | 'lineThrough' | 'overline';
  decorationStyle?: 'dashed' | 'dotted' | 'double' | 'wavy';
  decorationColor?: string;
  lineHeight?: number;
  characterSpacing?: number;
  wordSpacing?: number;
  noWrap?: boolean;
}

export interface PDFMakeTable {
  body: PDFMakeTableCell[][];
  widths?: (number | string | 'auto' | '*')[];
  heights?: (number | ((row: number) => number))[];
  headerRows?: number;
  dontBreakRows?: boolean;
  keepWithHeaderRows?: number;
  layout?: string | {
    hLineWidth?: (i: number, node: any) => number;
    vLineWidth?: (i: number, node: any) => number;
    hLineColor?: (i: number, node: any) => string;
    vLineColor?: (i: number, node: any) => string;
    hLineStyle?: (i: number, node: any) => { dash?: { length: number; space?: number } };
    vLineStyle?: (i: number, node: any) => { dash?: { length: number; space?: number } };
    fillColor?: (rowIndex: number, node: any, columnIndex: number) => string;
    fillOpacity?: (rowIndex: number, node: any, columnIndex: number) => number;
    paddingLeft?: (i: number, node: any) => number;
    paddingRight?: (i: number, node: any) => number;
    paddingTop?: (i: number, node: any) => number;
    paddingBottom?: (i: number, node: any) => number;
  };
}

export interface PDFMakeCanvas {
  type: 'line' | 'rect' | 'ellipse' | 'polyline';
  x1?: number;
  y1?: number;
  x2?: number;
  y2?: number;
  x?: number;
  y?: number;
  w?: number;
  h?: number;
  r?: number;
  rx?: number;
  ry?: number;
  points?: { x: number; y: number }[];
  closePath?: boolean;
  lineWidth?: number;
  lineColor?: string;
  lineCap?: 'butt' | 'round' | 'square';
  dash?: { length: number; space?: number };
  fillOpacity?: number;
  strokeOpacity?: number;
  color?: string;
  fillColor?: string;
}

export interface PDFMakeImage {
  image: string;
  width?: number;
  height?: number;
  fit?: [number, number];
  cover?: { width: number; height: number; align?: 'left' | 'center' | 'right'; valign?: 'top' | 'center' | 'bottom' };
  alignment?: 'left' | 'center' | 'right';
  margin?: number | [number] | [number, number] | [number, number, number, number];
  style?: string | string[];
  pageBreak?: 'before' | 'after';
}

export interface PDFMakeText {
  text: string | (string | PDFMakeInlineStyle)[];
  style?: string | string[];
  alignment?: 'left' | 'center' | 'right' | 'justify';
  fontSize?: number;
  fontFamily?: string;
  bold?: boolean;
  italics?: boolean;
  color?: string;
  background?: string;
  decoration?: 'underline' | 'lineThrough' | 'overline';
  decorationStyle?: 'dashed' | 'dotted' | 'double' | 'wavy';
  decorationColor?: string;
  margin?: number | [number] | [number, number] | [number, number, number, number];
  lineHeight?: number;
  characterSpacing?: number;
  wordSpacing?: number;
  fillColor?: string;
  fillOpacity?: number;
  pageBreak?: 'before' | 'after';
  tocItem?: boolean | string | string[];
  tocStyle?: string | string[];
  tocMargin?: number | [number] | [number, number] | [number, number, number, number];
  tocNumberStyle?: string | string[];
  headlineLevel?: number;
  unbreakable?: boolean;
  noWrap?: boolean;
  preserveLeadingSpaces?: boolean;
  preserveTrailingSpaces?: boolean;
}

export interface PDFMakeInlineStyle {
  text: string;
  style?: string | string[];
  fontSize?: number;
  fontFamily?: string;
  bold?: boolean;
  italics?: boolean;
  color?: string;
  background?: string;
  decoration?: 'underline' | 'lineThrough' | 'overline';
  decorationStyle?: 'dashed' | 'dotted' | 'double' | 'wavy';
  decorationColor?: string;
  lineHeight?: number;
  characterSpacing?: number;
  wordSpacing?: number;
  fillColor?: string;
  fillOpacity?: number;
  link?: string;
  linkToPage?: number;
  linkToDestination?: string;
  noWrap?: boolean;
}

export interface PDFMakeStack {
  stack: PDFMakeContent[];
  style?: string | string[];
  margin?: number | [number] | [number, number] | [number, number, number, number];
  alignment?: 'left' | 'center' | 'right' | 'justify';
  unbreakable?: boolean;
  pageBreak?: 'before' | 'after';
}

export interface PDFMakeColumns {
  columns: PDFMakeColumn[];
  columnGap?: number;
  style?: string | string[];
  margin?: number | [number] | [number, number] | [number, number, number, number];
  alignment?: 'left' | 'center' | 'right' | 'justify';
  unbreakable?: boolean;
  pageBreak?: 'before' | 'after';
}

export interface PDFMakeOrderedList {
  ol: PDFMakeContent[];
  type?: 'lower-alpha' | 'upper-alpha' | 'lower-roman' | 'upper-roman' | 'none';
  separator?: string | [string, string];
  start?: number;
  reversed?: boolean;
  style?: string | string[];
  margin?: number | [number] | [number, number] | [number, number, number, number];
  alignment?: 'left' | 'center' | 'right' | 'justify';
  markerColor?: string;
  counter?: string;
}

export interface PDFMakeUnorderedList {
  ul: PDFMakeContent[];
  type?: 'square' | 'circle' | 'none';
  style?: string | string[];
  margin?: number | [number] | [number, number] | [number, number, number, number];
  alignment?: 'left' | 'center' | 'right' | 'justify';
  markerColor?: string;
}

export type PDFMakeContent = 
  | string
  | PDFMakeText
  | PDFMakeImage
  | PDFMakeStack
  | PDFMakeColumns
  | PDFMakeTable
  | PDFMakeOrderedList
  | PDFMakeUnorderedList
  | PDFMakeCanvas[]
  | { qr: string; style?: string | string[]; margin?: number | [number] | [number, number] | [number, number, number, number] }
  | { svg: string; style?: string | string[]; margin?: number | [number] | [number, number] | [number, number, number, number] }
  | { pageBreak: 'before' | 'after' }
  | { text: string | (string | PDFMakeInlineStyle)[]; [key: string]: any };

export interface PDFMakeDocumentDefinition {
  content: PDFMakeContent[];
  styles?: { [key: string]: PDFMakeStyle };
  defaultStyle?: PDFMakeStyle;
  pageSize?: 'A4' | 'A3' | 'A5' | 'LEGAL' | 'LETTER' | 'TABLOID' | PDFMakePageSize;
  pageOrientation?: 'portrait' | 'landscape';
  pageMargins?: number | [number] | [number, number] | [number, number, number, number] | PDFMakeMargins;
  header?: PDFMakeContent | ((currentPage: number, pageCount: number, pageSize: PDFMakePageSize) => PDFMakeContent);
  footer?: PDFMakeContent | ((currentPage: number, pageCount: number, pageSize: PDFMakePageSize) => PDFMakeContent);
  background?: PDFMakeContent | ((currentPage: number, pageSize: PDFMakePageSize) => PDFMakeContent);
  compress?: boolean;
  metadata?: {
    title?: string;
    author?: string;
    subject?: string;
    keywords?: string;
    creator?: string;
    producer?: string;
    creationDate?: Date;
    modDate?: Date;
    trapped?: string;
  };
  permissions?: {
    printing?: 'highResolution' | 'lowResolution';
    modifying?: boolean;
    copying?: boolean;
    annotating?: boolean;
    fillingForms?: boolean;
    contentAccessibility?: boolean;
    documentAssembly?: boolean;
  };
  encrypt?: {
    userPassword?: string;
    ownerPassword?: string;
    permissions?: {
      printing?: 'highResolution' | 'lowResolution';
      modifying?: boolean;
      copying?: boolean;
      annotating?: boolean;
      fillingForms?: boolean;
      contentAccessibility?: boolean;
      documentAssembly?: boolean;
    };
  };
  userPassword?: string;
  ownerPassword?: string;
  info?: {
    title?: string;
    author?: string;
    subject?: string;
    keywords?: string;
    creator?: string;
    producer?: string;
    creationDate?: Date;
    modDate?: Date;
    trapped?: string;
  };
  watermark?: string | {
    text: string;
    color?: string;
    opacity?: number;
    bold?: boolean;
    italics?: boolean;
    fontSize?: number;
    angle?: number;
  };
  pageBreakBefore?: (currentNode: any, followingNodesOnPage: any[], nodesOnNextPage: any[], previousNodesOnPage: any[]) => boolean;
  images?: { [key: string]: string };
  fonts?: {
    [fontName: string]: {
      normal?: string;
      bold?: string;
      italics?: string;
      bolditalics?: string;
    };
  };
}

// 导出配置类型
export interface ExportOptions {
  // 基础选项
  format: 'pdf' | 'blob' | 'base64' | 'buffer';
  filename?: string;
  
  // PDF 特定选项
  pageSize?: 'A4' | 'A3' | 'A5' | 'LEGAL' | 'LETTER' | 'TABLOID';
  pageOrientation?: 'portrait' | 'landscape';
  pageMargins?: number | [number, number, number, number];
  
  // 质量选项
  compress?: boolean;
  imageQuality?: number;
  optimizeForPrint?: boolean;
  
  // 元数据
  metadata?: {
    title?: string;
    author?: string;
    subject?: string;
    keywords?: string;
    creator?: string;
  };
  
  // 安全选项
  permissions?: {
    printing?: boolean;
    modifying?: boolean;
    copying?: boolean;
    annotating?: boolean;
  };
  
  // 水印
  watermark?: {
    text: string;
    opacity?: number;
    color?: string;
    fontSize?: number;
    angle?: number;
  };
  
  // 自定义选项
  customStyles?: { [key: string]: PDFMakeStyle };
  customFonts?: { [key: string]: any };
  
  // 回调函数
  onProgress?: (progress: number) => void;
  onComplete?: (result: ExportResult) => void;
  onError?: (error: Error) => void;
}

// 导出结果类型
export interface ExportResult {
  success: boolean;
  data?: Blob | string | Buffer | ArrayBuffer;
  filename?: string;
  size?: number;
  pageCount?: number;
  metadata?: {
    title?: string;
    author?: string;
    creationDate?: Date;
    modificationDate?: Date;
  };
  errors?: ExportError[];
  warnings?: ExportWarning[];
  performance?: {
    startTime: number;
    endTime: number;
    duration: number;
    memoryUsage?: number;
  };
}

// 导出错误类型
export interface ExportError {
  code: string;
  message: string;
  type: 'validation' | 'processing' | 'rendering' | 'output';
  details?: any;
  stack?: string;
}

// 导出警告类型
export interface ExportWarning {
  code: string;
  message: string;
  type: 'formatting' | 'compatibility' | 'performance' | 'quality';
  details?: any;
}

// PDF 生成器接口
export interface PDFGenerator {
  // 生成 PDF
  generatePDF(data: StyledResumeData, options?: ExportOptions): Promise<ExportResult>;
  
  // 生成 PDF Blob
  generatePDFBlob(data: StyledResumeData, options?: ExportOptions): Promise<Blob>;
  
  // 生成 PDF Base64
  generatePDFBase64(data: StyledResumeData, options?: ExportOptions): Promise<string>;
  
  // 生成 PDF Buffer
  generatePDFBuffer(data: StyledResumeData, options?: ExportOptions): Promise<Buffer>;
  
  // 预览 PDF
  previewPDF(data: StyledResumeData, options?: ExportOptions): Promise<string>;
  
  // 验证数据
  validateData(data: StyledResumeData): { isValid: boolean; errors: ExportError[]; warnings: ExportWarning[] };
  
  // 获取支持的选项
  getSupportedOptions(): Partial<ExportOptions>;
}

// 数据转换器接口
export interface DataConverter {
  // 转换为 PDFMake 文档定义
  convertToPDFMake(data: StyledResumeData, options?: ExportOptions): PDFMakeDocumentDefinition;
  
  // 转换个人信息
  convertPersonalInfo(data: StyledResumeData['personalInfo']): PDFMakeContent[];
  
  // 转换工作经历
  convertExperience(data: StyledResumeData['experience']): PDFMakeContent[];
  
  // 转换教育背景
  convertEducation(data: StyledResumeData['education']): PDFMakeContent[];
  
  // 转换技能
  convertSkills(data: StyledResumeData['skills']): PDFMakeContent[];
  
  // 转换项目经历
  convertProjects(data: StyledResumeData['projects']): PDFMakeContent[];
  
  // 转换自定义章节
  convertCustomSection(data: any): PDFMakeContent[];
}

// 样式转换器接口
export interface StyleConverter {
  // 转换样式配置
  convertStyles(styleConfig: any): { [key: string]: PDFMakeStyle };
  
  // 转换字体配置
  convertFontConfig(fontConfig: any): PDFMakeStyle;
  
  // 转换颜色配置
  convertColorConfig(colorConfig: any): { [key: string]: string };
  
  // 转换间距配置
  convertSpacingConfig(spacingConfig: any): { [key: string]: number };
  
  // 转换布局配置
  convertLayoutConfig(layoutConfig: any): Partial<PDFMakeDocumentDefinition>;
}

// 渲染器接口
export interface PDFRenderer {
  // 渲染文档
  render(definition: PDFMakeDocumentDefinition, options?: ExportOptions): Promise<ExportResult>;
  
  // 渲染为 Blob
  renderToBlob(definition: PDFMakeDocumentDefinition, options?: ExportOptions): Promise<Blob>;
  
  // 渲染为 Base64
  renderToBase64(definition: PDFMakeDocumentDefinition, options?: ExportOptions): Promise<string>;
  
  // 渲染为 Buffer
  renderToBuffer(definition: PDFMakeDocumentDefinition, options?: ExportOptions): Promise<Buffer>;
  
  // 获取页面信息
  getPageInfo(definition: PDFMakeDocumentDefinition): Promise<{ pageCount: number; pageSize: PDFMakePageSize }>;
}

// 导出管理器配置
export interface ExportManagerConfig {
  // 默认选项
  defaultOptions?: Partial<ExportOptions>;
  
  // 缓存配置
  enableCache?: boolean;
  cacheSize?: number;
  cacheTTL?: number;
  
  // 性能配置
  maxConcurrentExports?: number;
  timeoutMs?: number;
  
  // 错误处理
  retryAttempts?: number;
  retryDelay?: number;
  
  // 日志配置
  enableLogging?: boolean;
  logLevel?: 'debug' | 'info' | 'warn' | 'error';
}

// 导出任务类型
export interface ExportTask {
  id: string;
  data: StyledResumeData;
  options: ExportOptions;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  progress: number;
  startTime?: number;
  endTime?: number;
  result?: ExportResult;
  error?: Error;
}

// 导出队列接口
export interface ExportQueue {
  // 添加任务
  addTask(data: StyledResumeData, options: ExportOptions): Promise<string>;
  
  // 获取任务状态
  getTaskStatus(taskId: string): ExportTask | null;
  
  // 取消任务
  cancelTask(taskId: string): boolean;
  
  // 清空队列
  clearQueue(): void;
  
  // 获取队列状态
  getQueueStatus(): {
    pending: number;
    processing: number;
    completed: number;
    failed: number;
  };
}