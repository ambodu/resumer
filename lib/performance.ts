"use client";

// 性能监控工具
export class PerformanceMonitor {
  private static instance: PerformanceMonitor;
  private metrics: Map<string, number> = new Map();
  private observers: PerformanceObserver[] = [];

  static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor();
    }
    return PerformanceMonitor.instance;
  }

  // 初始化性能监控
  init() {
    if (typeof window === 'undefined') return;

    // 监控Web Vitals
    this.observeWebVitals();
    
    // 监控资源加载
    this.observeResourceTiming();
    
    // 监控长任务
    this.observeLongTasks();
  }

  // 监控Web Vitals指标
  private observeWebVitals() {
    // LCP (Largest Contentful Paint)
    const lcpObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const lastEntry = entries[entries.length - 1];
      this.metrics.set('LCP', lastEntry.startTime);
      console.log('LCP:', lastEntry.startTime);
    });
    lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
    this.observers.push(lcpObserver);

    // FID (First Input Delay)
    const fidObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach((entry: any) => {
        this.metrics.set('FID', entry.processingStart - entry.startTime);
        console.log('FID:', entry.processingStart - entry.startTime);
      });
    });
    fidObserver.observe({ entryTypes: ['first-input'] });
    this.observers.push(fidObserver);

    // CLS (Cumulative Layout Shift)
    let clsValue = 0;
    const clsObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach((entry: any) => {
        if (!entry.hadRecentInput) {
          clsValue += entry.value;
        }
      });
      this.metrics.set('CLS', clsValue);
      console.log('CLS:', clsValue);
    });
    clsObserver.observe({ entryTypes: ['layout-shift'] });
    this.observers.push(clsObserver);
  }

  // 监控资源加载时间
  private observeResourceTiming() {
    const resourceObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach((entry) => {
        if (entry.name.includes('.js') || entry.name.includes('.css')) {
          console.log(`Resource: ${entry.name}, Duration: ${entry.duration}ms`);
        }
      });
    });
    resourceObserver.observe({ entryTypes: ['resource'] });
    this.observers.push(resourceObserver);
  }

  // 监控长任务
  private observeLongTasks() {
    const longTaskObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach((entry) => {
        console.warn(`Long task detected: ${entry.duration}ms`);
      });
    });
    longTaskObserver.observe({ entryTypes: ['longtask'] });
    this.observers.push(longTaskObserver);
  }

  // 获取性能指标
  getMetrics() {
    return Object.fromEntries(this.metrics);
  }

  // 清理观察器
  cleanup() {
    this.observers.forEach(observer => observer.disconnect());
    this.observers = [];
  }
}

// 图片优化工具
export class ImageOptimizer {
  // 压缩图片
  static compressImage(
    file: File,
    quality: number = 0.8,
    maxWidth: number = 1920,
    maxHeight: number = 1080
  ): Promise<Blob> {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d')!;
      const img = new Image();

      img.onload = () => {
        // 计算新尺寸
        let { width, height } = img;
        
        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }
        
        if (height > maxHeight) {
          width = (width * maxHeight) / height;
          height = maxHeight;
        }

        canvas.width = width;
        canvas.height = height;

        // 绘制并压缩
        ctx.drawImage(img, 0, 0, width, height);
        canvas.toBlob(resolve, 'image/jpeg', quality);
      };

      img.src = URL.createObjectURL(file);
    });
  }

  // 生成WebP格式
  static toWebP(file: File, quality: number = 0.8): Promise<Blob> {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d')!;
      const img = new Image();

      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);
        canvas.toBlob(resolve, 'image/webp', quality);
      };

      img.src = URL.createObjectURL(file);
    });
  }

  // 生成缩略图
  static generateThumbnail(
    file: File,
    size: number = 200
  ): Promise<Blob> {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d')!;
      const img = new Image();

      img.onload = () => {
        canvas.width = size;
        canvas.height = size;
        
        // 居中裁剪
        const scale = Math.max(size / img.width, size / img.height);
        const x = (size - img.width * scale) / 2;
        const y = (size - img.height * scale) / 2;
        
        ctx.drawImage(img, x, y, img.width * scale, img.height * scale);
        canvas.toBlob(resolve, 'image/jpeg', 0.8);
      };

      img.src = URL.createObjectURL(file);
    });
  }
}

// 缓存管理
export class CacheManager {
  private static readonly CACHE_NAME = 'resume-editor-cache';
  private static readonly CACHE_VERSION = 'v1';
  private static readonly FULL_CACHE_NAME = `${CacheManager.CACHE_NAME}-${CacheManager.CACHE_VERSION}`;

  // 缓存资源
  static async cacheResources(urls: string[]) {
    if ('caches' in window) {
      const cache = await caches.open(CacheManager.FULL_CACHE_NAME);
      await cache.addAll(urls);
    }
  }

  // 获取缓存资源
  static async getCachedResource(url: string): Promise<Response | undefined> {
    if ('caches' in window) {
      const cache = await caches.open(CacheManager.FULL_CACHE_NAME);
      return await cache.match(url);
    }
  }

  // 清理旧缓存
  static async clearOldCaches() {
    if ('caches' in window) {
      const cacheNames = await caches.keys();
      const oldCaches = cacheNames.filter(
        name => name.startsWith(CacheManager.CACHE_NAME) && name !== CacheManager.FULL_CACHE_NAME
      );
      
      await Promise.all(
        oldCaches.map(name => caches.delete(name))
      );
    }
  }
}

// 代码分割工具
export class CodeSplitting {
  // 预加载模块
  static preloadModule(moduleFactory: () => Promise<any>) {
    if (typeof window !== 'undefined') {
      // 在空闲时间预加载
      if ('requestIdleCallback' in window) {
        requestIdleCallback(() => moduleFactory());
      } else {
        setTimeout(() => moduleFactory(), 0);
      }
    }
  }

  // 条件加载
  static conditionalLoad<T>(
    condition: boolean,
    moduleFactory: () => Promise<{ default: T }>
  ): Promise<T | null> {
    if (condition) {
      return moduleFactory().then(module => module.default);
    }
    return Promise.resolve(null);
  }
}

// 防抖和节流工具
export class ThrottleDebounce {
  // 防抖
  static debounce<T extends (...args: any[]) => any>(
    func: T,
    delay: number
  ): (...args: Parameters<T>) => void {
    let timeoutId: NodeJS.Timeout;
    return (...args: Parameters<T>) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func(...args), delay);
    };
  }

  // 节流
  static throttle<T extends (...args: any[]) => any>(
    func: T,
    delay: number
  ): (...args: Parameters<T>) => void {
    let lastCall = 0;
    return (...args: Parameters<T>) => {
      const now = Date.now();
      if (now - lastCall >= delay) {
        lastCall = now;
        func(...args);
      }
    };
  }
}

// 内存优化
export class MemoryOptimizer {
  private static weakMap = new WeakMap();
  private static observers: IntersectionObserver[] = [];

  // 清理未使用的引用
  static cleanup() {
    MemoryOptimizer.observers.forEach(observer => observer.disconnect());
    MemoryOptimizer.observers = [];
  }

  // 图片懒加载
  static lazyLoadImages(selector: string = 'img[data-src]') {
    const images = document.querySelectorAll(selector);
    
    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target as HTMLImageElement;
          const src = img.dataset.src;
          if (src) {
            img.src = src;
            img.removeAttribute('data-src');
            imageObserver.unobserve(img);
          }
        }
      });
    });

    images.forEach(img => imageObserver.observe(img));
    MemoryOptimizer.observers.push(imageObserver);
  }

  // 组件卸载时清理
  static onUnmount(cleanup: () => void) {
    return () => {
      cleanup();
      MemoryOptimizer.cleanup();
    };
  }
}

// 初始化性能监控
if (typeof window !== 'undefined') {
  const monitor = PerformanceMonitor.getInstance();
  monitor.init();
  
  // 页面卸载时清理
  window.addEventListener('beforeunload', () => {
    monitor.cleanup();
    MemoryOptimizer.cleanup();
  });
}