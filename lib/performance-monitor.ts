"use client";

// 性能指标接口
interface PerformanceMetrics {
  // Core Web Vitals
  LCP: number; // Largest Contentful Paint
  FID: number; // First Input Delay
  CLS: number; // Cumulative Layout Shift
  
  // 其他重要指标
  FCP: number; // First Contentful Paint
  TTFB: number; // Time to First Byte
  TTI: number; // Time to Interactive
  
  // 自定义指标
  pageLoadTime: number;
  domContentLoaded: number;
  resourceLoadTime: number;
  memoryUsage: number;
  
  // 用户体验指标
  timeToFirstInteraction: number;
  scrollResponsiveness: number;
  clickResponsiveness: number;
}

// 性能事件类型
type PerformanceEventType = 
  | 'page-load'
  | 'route-change'
  | 'component-mount'
  | 'component-update'
  | 'user-interaction'
  | 'api-call'
  | 'error';

// 性能事件
interface PerformanceEvent {
  type: PerformanceEventType;
  name: string;
  startTime: number;
  endTime?: number;
  duration?: number;
  metadata?: Record<string, any>;
}

// 性能阈值配置
interface PerformanceThresholds {
  LCP: { good: number; needsImprovement: number };
  FID: { good: number; needsImprovement: number };
  CLS: { good: number; needsImprovement: number };
  FCP: { good: number; needsImprovement: number };
  TTFB: { good: number; needsImprovement: number };
  pageLoadTime: { good: number; needsImprovement: number };
}

// 默认阈值（基于Google建议）
const DEFAULT_THRESHOLDS: PerformanceThresholds = {
  LCP: { good: 2500, needsImprovement: 4000 },
  FID: { good: 100, needsImprovement: 300 },
  CLS: { good: 0.1, needsImprovement: 0.25 },
  FCP: { good: 1800, needsImprovement: 3000 },
  TTFB: { good: 800, needsImprovement: 1800 },
  pageLoadTime: { good: 3000, needsImprovement: 5000 }
};

// 性能监控器
export class PerformanceMonitor {
  private static instance: PerformanceMonitor;
  private metrics: Partial<PerformanceMetrics> = {};
  private events: PerformanceEvent[] = [];
  private observers: Map<string, PerformanceObserver> = new Map();
  private thresholds: PerformanceThresholds = DEFAULT_THRESHOLDS;
  private isMonitoring = false;
  private reportCallback?: (metrics: PerformanceMetrics) => void;
  
  private constructor() {
    this.initializeObservers();
  }
  
  public static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor();
    }
    return PerformanceMonitor.instance;
  }
  
  // 初始化性能观察器
  private initializeObservers(): void {
    if (typeof window === 'undefined') return;
    
    // 观察LCP
    if ('PerformanceObserver' in window) {
      try {
        const lcpObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const lastEntry = entries[entries.length - 1] as any;
          this.metrics.LCP = lastEntry.startTime;
        });
        lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
        this.observers.set('lcp', lcpObserver);
      } catch (error) {
        console.warn('LCP observer not supported:', error);
      }
      
      // 观察FID
      try {
        const fidObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          entries.forEach((entry: any) => {
            this.metrics.FID = entry.processingStart - entry.startTime;
          });
        });
        fidObserver.observe({ entryTypes: ['first-input'] });
        this.observers.set('fid', fidObserver);
      } catch (error) {
        console.warn('FID observer not supported:', error);
      }
      
      // 观察CLS
      try {
        let clsValue = 0;
        const clsObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          entries.forEach((entry: any) => {
            if (!entry.hadRecentInput) {
              clsValue += entry.value;
              this.metrics.CLS = clsValue;
            }
          });
        });
        clsObserver.observe({ entryTypes: ['layout-shift'] });
        this.observers.set('cls', clsObserver);
      } catch (error) {
        console.warn('CLS observer not supported:', error);
      }
      
      // 观察FCP
      try {
        const fcpObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          entries.forEach((entry: any) => {
            if (entry.name === 'first-contentful-paint') {
              this.metrics.FCP = entry.startTime;
            }
          });
        });
        fcpObserver.observe({ entryTypes: ['paint'] });
        this.observers.set('fcp', fcpObserver);
      } catch (error) {
        console.warn('FCP observer not supported:', error);
      }
      
      // 观察导航时间
      try {
        const navigationObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          entries.forEach((entry: any) => {
            this.metrics.TTFB = entry.responseStart - entry.requestStart;
            this.metrics.domContentLoaded = entry.domContentLoadedEventEnd - entry.domContentLoadedEventStart;
            this.metrics.pageLoadTime = entry.loadEventEnd - entry.loadEventStart;
          });
        });
        navigationObserver.observe({ entryTypes: ['navigation'] });
        this.observers.set('navigation', navigationObserver);
      } catch (error) {
        console.warn('Navigation observer not supported:', error);
      }
      
      // 观察资源加载
      try {
        const resourceObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          let totalResourceTime = 0;
          entries.forEach((entry: any) => {
            totalResourceTime += entry.duration;
          });
          this.metrics.resourceLoadTime = totalResourceTime;
        });
        resourceObserver.observe({ entryTypes: ['resource'] });
        this.observers.set('resource', resourceObserver);
      } catch (error) {
        console.warn('Resource observer not supported:', error);
      }
    }
  }
  
  // 开始监控
  public startMonitoring(reportCallback?: (metrics: PerformanceMetrics) => void): void {
    this.isMonitoring = true;
    this.reportCallback = reportCallback;
    
    // 监控内存使用
    this.monitorMemoryUsage();
    
    // 监控用户交互
    this.monitorUserInteractions();
    
    // 定期报告
    setInterval(() => {
      if (this.isMonitoring) {
        this.generateReport();
      }
    }, 30000); // 每30秒报告一次
  }
  
  // 停止监控
  public stopMonitoring(): void {
    this.isMonitoring = false;
    this.observers.forEach(observer => observer.disconnect());
    this.observers.clear();
  }
  
  // 监控内存使用
  private monitorMemoryUsage(): void {
    if ('memory' in performance) {
      setInterval(() => {
        const memory = (performance as any).memory;
        this.metrics.memoryUsage = memory.usedJSHeapSize / memory.jsHeapSizeLimit;
      }, 5000);
    }
  }
  
  // 监控用户交互
  private monitorUserInteractions(): void {
    let firstInteractionTime: number | null = null;
    
    const interactionHandler = () => {
      if (!firstInteractionTime) {
        firstInteractionTime = performance.now();
        this.metrics.timeToFirstInteraction = firstInteractionTime;
      }
    };
    
    // 监控点击响应性
    document.addEventListener('click', (event) => {
      const startTime = performance.now();
      requestAnimationFrame(() => {
        const endTime = performance.now();
        this.metrics.clickResponsiveness = endTime - startTime;
      });
      interactionHandler();
    });
    
    // 监控滚动响应性
    let scrollStartTime: number;
    document.addEventListener('scroll', () => {
      if (!scrollStartTime) {
        scrollStartTime = performance.now();
      }
      
      clearTimeout(this.scrollTimeout);
      this.scrollTimeout = setTimeout(() => {
        const endTime = performance.now();
        this.metrics.scrollResponsiveness = endTime - scrollStartTime;
        scrollStartTime = 0;
      }, 100);
      
      interactionHandler();
    });
    
    // 监控键盘交互
    document.addEventListener('keydown', interactionHandler);
    document.addEventListener('touchstart', interactionHandler);
  }
  
  private scrollTimeout: NodeJS.Timeout | undefined;
  
  // 记录性能事件
  public recordEvent(event: Omit<PerformanceEvent, 'startTime'>): void {
    const performanceEvent: PerformanceEvent = {
      ...event,
      startTime: performance.now()
    };
    
    this.events.push(performanceEvent);
    
    // 限制事件数量
    if (this.events.length > 1000) {
      this.events = this.events.slice(-500);
    }
  }
  
  // 结束性能事件
  public endEvent(name: string): void {
    const event = this.events.find(e => e.name === name && !e.endTime);
    if (event) {
      event.endTime = performance.now();
      event.duration = event.endTime - event.startTime;
    }
  }
  
  // 获取当前指标
  public getMetrics(): Partial<PerformanceMetrics> {
    return { ...this.metrics };
  }
  
  // 获取性能事件
  public getEvents(): PerformanceEvent[] {
    return [...this.events];
  }
  
  // 生成性能报告
  public generateReport(): PerformanceMetrics {
    const report: PerformanceMetrics = {
      LCP: this.metrics.LCP || 0,
      FID: this.metrics.FID || 0,
      CLS: this.metrics.CLS || 0,
      FCP: this.metrics.FCP || 0,
      TTFB: this.metrics.TTFB || 0,
      TTI: this.calculateTTI(),
      pageLoadTime: this.metrics.pageLoadTime || 0,
      domContentLoaded: this.metrics.domContentLoaded || 0,
      resourceLoadTime: this.metrics.resourceLoadTime || 0,
      memoryUsage: this.metrics.memoryUsage || 0,
      timeToFirstInteraction: this.metrics.timeToFirstInteraction || 0,
      scrollResponsiveness: this.metrics.scrollResponsiveness || 0,
      clickResponsiveness: this.metrics.clickResponsiveness || 0
    };
    
    if (this.reportCallback) {
      this.reportCallback(report);
    }
    
    return report;
  }
  
  // 计算TTI（Time to Interactive）
  private calculateTTI(): number {
    // 简化的TTI计算
    const fcp = this.metrics.FCP || 0;
    const longTasks = this.events.filter(e => 
      e.type === 'user-interaction' && (e.duration || 0) > 50
    );
    
    if (longTasks.length === 0) {
      return fcp;
    }
    
    // 找到最后一个长任务后的安静期
    const lastLongTask = longTasks[longTasks.length - 1];
    return Math.max(fcp, lastLongTask.endTime || lastLongTask.startTime);
  }
  
  // 评估性能等级
  public evaluatePerformance(metric: keyof PerformanceThresholds, value: number): 'good' | 'needs-improvement' | 'poor' {
    const threshold = this.thresholds[metric];
    
    if (value <= threshold.good) {
      return 'good';
    } else if (value <= threshold.needsImprovement) {
      return 'needs-improvement';
    } else {
      return 'poor';
    }
  }
  
  // 获取性能建议
  public getPerformanceRecommendations(): Array<{ metric: string; issue: string; recommendation: string }> {
    const recommendations: Array<{ metric: string; issue: string; recommendation: string }> = [];
    const metrics = this.getMetrics();
    
    // LCP建议
    if (metrics.LCP && this.evaluatePerformance('LCP', metrics.LCP) !== 'good') {
      recommendations.push({
        metric: 'LCP',
        issue: `最大内容绘制时间过长 (${metrics.LCP.toFixed(0)}ms)`,
        recommendation: '优化图片加载、减少服务器响应时间、使用CDN'
      });
    }
    
    // FID建议
    if (metrics.FID && this.evaluatePerformance('FID', metrics.FID) !== 'good') {
      recommendations.push({
        metric: 'FID',
        issue: `首次输入延迟过长 (${metrics.FID.toFixed(0)}ms)`,
        recommendation: '减少JavaScript执行时间、使用Web Workers、代码分割'
      });
    }
    
    // CLS建议
    if (metrics.CLS && this.evaluatePerformance('CLS', metrics.CLS) !== 'good') {
      recommendations.push({
        metric: 'CLS',
        issue: `累积布局偏移过大 (${metrics.CLS.toFixed(3)})`,
        recommendation: '为图片和广告设置尺寸、避免在现有内容上方插入内容'
      });
    }
    
    // TTFB建议
    if (metrics.TTFB && this.evaluatePerformance('TTFB', metrics.TTFB) !== 'good') {
      recommendations.push({
        metric: 'TTFB',
        issue: `首字节时间过长 (${metrics.TTFB.toFixed(0)}ms)`,
        recommendation: '优化服务器配置、使用CDN、启用缓存'
      });
    }
    
    // 内存使用建议
    if (metrics.memoryUsage && metrics.memoryUsage > 0.8) {
      recommendations.push({
        metric: 'Memory',
        issue: `内存使用率过高 (${(metrics.memoryUsage * 100).toFixed(1)}%)`,
        recommendation: '检查内存泄漏、优化数据结构、清理未使用的对象'
      });
    }
    
    return recommendations;
  }
  
  // 设置自定义阈值
  public setThresholds(thresholds: Partial<PerformanceThresholds>): void {
    this.thresholds = { ...this.thresholds, ...thresholds };
  }
  
  // 清除数据
  public clearData(): void {
    this.metrics = {};
    this.events = [];
  }
}

// 性能装饰器
export function measurePerformance(name: string) {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;
    
    descriptor.value = async function (...args: any[]) {
      const monitor = PerformanceMonitor.getInstance();
      monitor.recordEvent({
        type: 'component-update',
        name: `${target.constructor.name}.${propertyKey}`,
        metadata: { args }
      });
      
      const startTime = performance.now();
      
      try {
        const result = await originalMethod.apply(this, args);
        const endTime = performance.now();
        
        monitor.endEvent(`${target.constructor.name}.${propertyKey}`);
        
        return result;
      } catch (error) {
        monitor.recordEvent({
          type: 'error',
          name: `${target.constructor.name}.${propertyKey}_error`,
          metadata: { error: error.message }
        });
        throw error;
      }
    };
    
    return descriptor;
  };
}

// React Hook for performance monitoring
export function usePerformanceMonitor() {
  const monitor = PerformanceMonitor.getInstance();
  
  React.useEffect(() => {
    monitor.startMonitoring();
    
    return () => {
      monitor.stopMonitoring();
    };
  }, [monitor]);
  
  return {
    recordEvent: monitor.recordEvent.bind(monitor),
    endEvent: monitor.endEvent.bind(monitor),
    getMetrics: monitor.getMetrics.bind(monitor),
    getEvents: monitor.getEvents.bind(monitor),
    generateReport: monitor.generateReport.bind(monitor),
    getRecommendations: monitor.getPerformanceRecommendations.bind(monitor)
  };
}

// 懒加载工具
export class LazyLoader {
  private static loadedModules = new Set<string>();
  private static loadingPromises = new Map<string, Promise<any>>();
  
  // 动态导入组件
  static async loadComponent<T = any>(importFn: () => Promise<T>, name: string): Promise<T> {
    if (this.loadedModules.has(name)) {
      return importFn();
    }
    
    if (this.loadingPromises.has(name)) {
      return this.loadingPromises.get(name)!;
    }
    
    const monitor = PerformanceMonitor.getInstance();
    monitor.recordEvent({
      type: 'component-mount',
      name: `lazy_load_${name}`
    });
    
    const promise = importFn().then(module => {
      this.loadedModules.add(name);
      monitor.endEvent(`lazy_load_${name}`);
      return module;
    }).catch(error => {
      monitor.recordEvent({
        type: 'error',
        name: `lazy_load_error_${name}`,
        metadata: { error: error.message }
      });
      throw error;
    });
    
    this.loadingPromises.set(name, promise);
    
    return promise;
  }
  
  // 预加载组件
  static preloadComponent(importFn: () => Promise<any>, name: string): void {
    if (!this.loadedModules.has(name) && !this.loadingPromises.has(name)) {
      // 在空闲时间预加载
      if ('requestIdleCallback' in window) {
        requestIdleCallback(() => {
          this.loadComponent(importFn, name);
        });
      } else {
        setTimeout(() => {
          this.loadComponent(importFn, name);
        }, 0);
      }
    }
  }
  
  // 清除缓存
  static clearCache(): void {
    this.loadedModules.clear();
    this.loadingPromises.clear();
  }
}

// 代码分割工具
export function createLazyComponent<T extends React.ComponentType<any>>(
  importFn: () => Promise<{ default: T }>,
  name: string,
  fallback?: React.ComponentType
): React.ComponentType<React.ComponentProps<T>> {
  const LazyComponent = React.lazy(() => 
    LazyLoader.loadComponent(importFn, name)
  );
  
  return function WrappedLazyComponent(props: React.ComponentProps<T>) {
    return (
      <React.Suspense fallback={fallback ? React.createElement(fallback) : <div>Loading...</div>}>
        <LazyComponent {...props} />
      </React.Suspense>
    );
  };
}

// 导出单例实例
export const performanceMonitor = PerformanceMonitor.getInstance();

// 导出类型
export type { PerformanceMetrics, PerformanceEvent, PerformanceEventType, PerformanceThresholds };