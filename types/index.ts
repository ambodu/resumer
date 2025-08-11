// Re-export all types from lib/types.ts
export * from "../lib/types";
import type { ResumeData } from "../lib/types";

// I18n Types
export interface Locale {
  code: "zh" | "en";
  name: string;
  flag: string;
}

export interface TranslationFunction {
  (key: string, params?: Record<string, string | number>): string;
}

export interface I18nContextType {
  locale: string;
  setLocale: (locale: string) => void;
  t: TranslationFunction;
  formatDate: (date: Date) => string;
  formatNumber: (num: number) => string;
  formatCurrency: (amount: number) => string;
}

// UI Component Types
export interface ButtonProps {
  variant?:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link";
  size?: "default" | "sm" | "lg" | "icon";
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
}

export interface CardProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  description?: string;
}

// Template Types
export interface Template {
  id: string;
  name: string;
  description: string;
  preview: string;
  category: string;
  isPremium: boolean;
  tags: string[];
}

export interface TemplateCategory {
  id: string;
  name: string;
  description: string;
  templates: Template[];
}

// AI Types
export interface AiSuggestion {
  type: "improvement" | "addition" | "correction";
  section: string;
  content: string;
  confidence: number;
}

export interface AiAnalysis {
  score: number;
  suggestions: AiSuggestion[];
  strengths: string[];
  weaknesses: string[];
}

// User Types
export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  subscription: "free" | "premium";
  createdAt: Date;
  updatedAt: Date;
}

export interface UserResume {
  id: string;
  userId: string;
  title: string;
  data: ResumeData;
  templateId: string;
  createdAt: Date;
  updatedAt: Date;
  isPublic: boolean;
}

// API Types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Form Types
export interface FormField {
  name: string;
  label: string;
  type: "text" | "email" | "tel" | "textarea" | "select" | "date";
  required?: boolean;
  placeholder?: string;
  options?: { value: string; label: string }[];
}

export interface FormSection {
  id: string;
  title: string;
  fields: FormField[];
}

// Export utility types
export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>;
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};
