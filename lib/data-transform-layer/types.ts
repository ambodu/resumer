// 数据中间层类型定义

// 简历数据结构
export interface ResumeData {
  personalInfo: PersonalInfo;
  experience: WorkExperience[];
  education: Education[];
  skills: Skill[];
  projects: Project[];
  languages?: Language[];
  certifications?: Certification[];
  awards?: Award[];
  references?: Reference[];
}

// 个人信息
export interface PersonalInfo {
  fullName: string;
  email: string;
  phone: string;
  address?: string;
  website?: string;
  linkedin?: string;
  github?: string;
  summary?: string;
  avatar?: string;
}

// 工作经历
export interface WorkExperience {
  id: string;
  company: string;
  position: string;
  startDate: Date | string;
  endDate?: Date | string;
  current?: boolean;
  location?: string;
  description?: string;
  achievements?: string[];
  technologies?: string[];
}

// 教育经历
export interface Education {
  id: string;
  school: string;
  degree: string;
  major: string;
  startDate: Date | string;
  endDate?: Date | string;
  current?: boolean;
  gpa?: number;
  location?: string;
  description?: string;
  courses?: string[];
}

// 技能
export interface Skill {
  id: string;
  name: string;
  level: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  category?: string;
  description?: string;
  yearsOfExperience?: number;
}

// 项目经历
export interface Project {
  id: string;
  name: string;
  role: string;
  startDate: Date | string;
  endDate?: Date | string;
  current?: boolean;
  description?: string;
  technologies?: string[];
  url?: string;
  github?: string;
  achievements?: string[];
}

// 语言能力
export interface Language {
  id: string;
  name: string;
  level: 'basic' | 'conversational' | 'fluent' | 'native';
  certification?: string;
}

// 认证证书
export interface Certification {
  id: string;
  name: string;
  issuer: string;
  issueDate: Date | string;
  expiryDate?: Date | string;
  credentialId?: string;
  url?: string;
}

// 奖项荣誉
export interface Award {
  id: string;
  title: string;
  issuer: string;
  date: Date | string;
  description?: string;
}

// 推荐人
export interface Reference {
  id: string;
  name: string;
  position: string;
  company: string;
  email: string;
  phone?: string;
  relationship: string;
}

// 样式配置
export interface StyleConfig {
  // 字体配置
  fonts: FontConfig;
  // 颜色配置
  colors: ColorConfig;
  // 间距配置
  spacing: SpacingConfig;
  // 布局配置
  layout: LayoutConfig;
  // 组件样式
  components: ComponentStyleConfig;
}

// 字体配置
export interface FontConfig {
  primary: FontDefinition;
  secondary: FontDefinition;
  heading: FontDefinition;
  body: FontDefinition;
  caption: FontDefinition;
}

// 字体定义
export interface FontDefinition {
  family: string;
  size: number;
  weight?: 'normal' | 'bold' | 'light' | number;
  style?: 'normal' | 'italic';
  lineHeight?: number;
  letterSpacing?: number;
}

// 颜色配置
export interface ColorConfig {
  primary: string;
  secondary: string;
  accent: string;
  text: {
    primary: string;
    secondary: string;
    muted: string;
    inverse: string;
  };
  background: {
    primary: string;
    secondary: string;
    accent: string;
  };
  border: {
    light: string;
    medium: string;
    dark: string;
  };
}

// 间距配置
export interface SpacingConfig {
  xs: number;
  sm: number;
  md: number;
  lg: number;
  xl: number;
  xxl: number;
}

// 布局配置
export interface LayoutConfig {
  pageSize: 'A4' | 'Letter' | 'Legal';
  orientation: 'portrait' | 'landscape';
  margins: {
    top: number;
    right: number;
    bottom: number;
    left: number;
  };
  columns: number;
  columnGap: number;
  maxWidth?: number;
}

// 组件样式配置
export interface ComponentStyleConfig {
  header: HeaderStyleConfig;
  section: SectionStyleConfig;
  list: ListStyleConfig;
  table: TableStyleConfig;
  divider: DividerStyleConfig;
}

// 头部样式配置
export interface HeaderStyleConfig {
  background?: string;
  padding: SpacingValue;
  textAlign: 'left' | 'center' | 'right';
  borderBottom?: BorderConfig;
}

// 章节样式配置
export interface SectionStyleConfig {
  marginBottom: number;
  titleStyle: TextStyleConfig;
  contentStyle: TextStyleConfig;
  background?: string;
  padding?: SpacingValue;
  border?: BorderConfig;
}

// 列表样式配置
export interface ListStyleConfig {
  itemSpacing: number;
  bulletStyle: 'disc' | 'circle' | 'square' | 'none';
  indentation: number;
}

// 表格样式配置
export interface TableStyleConfig {
  headerBackground: string;
  headerTextColor: string;
  borderColor: string;
  borderWidth: number;
  cellPadding: SpacingValue;
  alternateRowBackground?: string;
}

// 分割线样式配置
export interface DividerStyleConfig {
  color: string;
  width: number;
  style: 'solid' | 'dashed' | 'dotted';
  margin: SpacingValue;
}

// 文本样式配置
export interface TextStyleConfig {
  font: FontDefinition;
  color: string;
  alignment?: 'left' | 'center' | 'right' | 'justify';
  decoration?: 'none' | 'underline' | 'linethrough';
  margin?: SpacingValue;
}

// 边框配置
export interface BorderConfig {
  width: number;
  style: 'solid' | 'dashed' | 'dotted';
  color: string;
}

// 间距值
export type SpacingValue = number | {
  top?: number;
  right?: number;
  bottom?: number;
  left?: number;
};

// 简历模板
export interface ResumeTemplate {
  id: string;
  name: string;
  description: string;
  category: 'modern' | 'classic' | 'creative' | 'minimal' | 'professional';
  preview: string; // 预览图片URL
  styleConfig: StyleConfig;
  layoutConfig: TemplateLayoutConfig;
  sectionOrder: string[];
  customSections?: CustomSectionConfig[];
}

// 模板布局配置
export interface TemplateLayoutConfig {
  type: 'single-column' | 'two-column' | 'three-column' | 'sidebar';
  headerPosition: 'top' | 'left' | 'right';
  sidebarWidth?: number;
  sidebarPosition?: 'left' | 'right';
  sectionSpacing: number;
  showSectionDividers: boolean;
}

// 自定义章节配置
export interface CustomSectionConfig {
  id: string;
  title: string;
  type: 'text' | 'list' | 'table' | 'custom';
  required: boolean;
  defaultContent?: any;
  styleOverrides?: Partial<SectionStyleConfig>;
}

// 样式化数据
export interface StyledResumeData {
  template: ResumeTemplate;
  data: ResumeData;
  styledSections: StyledSection[];
  metadata: ResumeMetadata;
}

// 样式化章节
export interface StyledSection {
  id: string;
  type: SectionType;
  title: string;
  content: StyledContent;
  style: SectionStyleConfig;
  visible: boolean;
  order: number;
}

// 章节类型
export type SectionType = 
  | 'personal-info'
  | 'summary'
  | 'experience'
  | 'education'
  | 'skills'
  | 'projects'
  | 'languages'
  | 'certifications'
  | 'awards'
  | 'references'
  | 'custom';

// 样式化内容
export type StyledContent = 
  | StyledTextContent
  | StyledListContent
  | StyledTableContent
  | StyledPersonalInfoContent;

// 样式化文本内容
export interface StyledTextContent {
  type: 'text';
  text: string;
  style: TextStyleConfig;
}

// 样式化列表内容
export interface StyledListContent {
  type: 'list';
  items: StyledListItem[];
  style: ListStyleConfig;
}

// 样式化列表项
export interface StyledListItem {
  id: string;
  content: StyledTextContent | StyledListContent;
  level: number;
  style?: TextStyleConfig;
}

// 样式化表格内容
export interface StyledTableContent {
  type: 'table';
  headers: string[];
  rows: StyledTableRow[];
  style: TableStyleConfig;
}

// 样式化表格行
export interface StyledTableRow {
  id: string;
  cells: StyledTableCell[];
}

// 样式化表格单元格
export interface StyledTableCell {
  content: string;
  style?: TextStyleConfig;
  colspan?: number;
  rowspan?: number;
}

// 样式化个人信息内容
export interface StyledPersonalInfoContent {
  type: 'personal-info';
  layout: 'horizontal' | 'vertical' | 'card';
  fields: StyledPersonalInfoField[];
  style: ComponentStyleConfig;
}

// 样式化个人信息字段
export interface StyledPersonalInfoField {
  key: keyof PersonalInfo;
  label: string;
  value: string;
  icon?: string;
  style: TextStyleConfig;
  visible: boolean;
}

// 简历元数据
export interface ResumeMetadata {
  createdAt: Date;
  updatedAt: Date;
  version: string;
  author: string;
  title: string;
  description?: string;
  tags: string[];
  language: string;
  pageCount: number;
  wordCount: number;
}

// 数据转换选项
export interface TransformOptions {
  template: ResumeTemplate;
  includeEmptySections: boolean;
  customSectionOrder?: string[];
  styleOverrides?: Partial<StyleConfig>;
  filterSections?: string[];
  dateFormat?: string;
  locale?: string;
}

// 数据转换结果
export interface TransformResult {
  success: boolean;
  data?: StyledResumeData;
  errors: TransformError[];
  warnings: TransformWarning[];
}

// 转换错误
export interface TransformError {
  code: string;
  message: string;
  section?: string;
  field?: string;
  severity: 'error' | 'warning';
}

// 转换警告
export interface TransformWarning {
  code: string;
  message: string;
  section?: string;
  field?: string;
  suggestion?: string;
}

// 模板验证结果
export interface TemplateValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

// 数据验证结果
export interface DataValidationResult {
  isValid: boolean;
  missingRequired: string[];
  invalidFields: { field: string; reason: string }[];
  suggestions: string[];
}