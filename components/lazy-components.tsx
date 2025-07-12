"use client";

import { lazy, Suspense } from 'react';
import { Loading } from '@/components/ui/loading';

// 懒加载组件
const LazyResumeEditor = lazy(() => import('@/components/editor/resume-editor').then(module => ({ default: module.ResumeEditor })));
const LazyResumePreview = lazy(() => import('@/components/editor/resume-preview').then(module => ({ default: module.ResumePreview })));
const LazyResumeForm = lazy(() => import('@/components/editor/resume-form').then(module => ({ default: module.ResumeForm })));
const LazyResumeManager = lazy(() => import('@/components/resume-manager').then(module => ({ default: module.ResumeManager })));
const LazyTemplateSelector = lazy(() => import('@/components/templates/template-selector').then(module => ({ default: module.TemplateSelector })));
const LazyTestimonials = lazy(() => import('@/components/testimonials').then(module => ({ default: module.Testimonials })));

// 加载状态组件
const LoadingFallback = ({ className = "" }: { className?: string }) => (
  <div className={`flex items-center justify-center min-h-[200px] ${className}`}>
    <Loading size="lg" text="加载中..." />
  </div>
);

// 编辑器加载状态
const EditorLoadingFallback = () => (
  <div className="flex items-center justify-center min-h-[600px] bg-gray-50 rounded-lg">
    <div className="text-center space-y-4">
      <Loading size="lg" />
      <p className="text-gray-600">正在加载编辑器...</p>
    </div>
  </div>
);

// 预览加载状态
const PreviewLoadingFallback = () => (
  <div className="flex items-center justify-center min-h-[800px] bg-white border rounded-lg shadow-sm">
    <div className="text-center space-y-4">
      <Loading size="lg" />
      <p className="text-gray-600">正在生成预览...</p>
    </div>
  </div>
);

// 模板选择器加载状态
const TemplateLoadingFallback = () => (
  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
    {Array.from({ length: 6 }).map((_, i) => (
      <div key={i} className="bg-gray-100 rounded-lg h-64 animate-pulse" />
    ))}
  </div>
);

// 导出懒加载组件
export const ResumeEditor = (props: any) => (
  <Suspense fallback={<EditorLoadingFallback />}>
    <LazyResumeEditor {...props} />
  </Suspense>
);

export const ResumePreview = (props: any) => (
  <Suspense fallback={<PreviewLoadingFallback />}>
    <LazyResumePreview {...props} />
  </Suspense>
);

export const ResumeForm = (props: any) => (
  <Suspense fallback={<LoadingFallback />}>
    <LazyResumeForm {...props} />
  </Suspense>
);

export const ResumeManager = (props: any) => (
  <Suspense fallback={<LoadingFallback />}>
    <LazyResumeManager {...props} />
  </Suspense>
);

export const TemplateSelector = (props: any) => (
  <Suspense fallback={<TemplateLoadingFallback />}>
    <LazyTemplateSelector {...props} />
  </Suspense>
);

export const Testimonials = (props: any) => (
  <Suspense fallback={<LoadingFallback />}>
    <LazyTestimonials {...props} />
  </Suspense>
);

// 通用懒加载HOC
export function withLazyLoading<T extends object>(
  Component: React.ComponentType<T>,
  fallback?: React.ReactNode
) {
  return function LazyComponent(props: T) {
    return (
      <Suspense fallback={fallback || <LoadingFallback />}>
        <Component {...props} />
      </Suspense>
    );
  };
}

// 预加载函数
export const preloadComponents = {
  editor: () => import('@/components/editor/resume-editor'),
  preview: () => import('@/components/editor/resume-preview'),
  form: () => import('@/components/editor/resume-form'),
  manager: () => import('@/components/resume-manager'),
  templates: () => import('@/components/templates/template-selector'),
  testimonials: () => import('@/components/testimonials'),
};

// 预加载钩子
export const usePreloadComponents = () => {
  const preload = (components: (keyof typeof preloadComponents)[]) => {
    components.forEach(component => {
      preloadComponents[component]();
    });
  };

  return { preload };
};