"use client";

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import {
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
  MoreVertical,
  Maximize2,
  Minimize2,
  RotateCcw,
  Smartphone,
  Tablet,
  Monitor,
  Laptop
} from 'lucide-react';

// 断点定义
const BREAKPOINTS = {
  xs: 0,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536
} as const;

type Breakpoint = keyof typeof BREAKPOINTS;

// 设备类型
type DeviceType = 'mobile' | 'tablet' | 'desktop';

// 方向类型
type Orientation = 'portrait' | 'landscape';

// 布局配置
interface LayoutConfig {
  sidebar: {
    width: number;
    collapsible: boolean;
    defaultCollapsed: boolean;
  };
  header: {
    height: number;
    sticky: boolean;
  };
  content: {
    padding: number;
    maxWidth?: number;
  };
  footer: {
    height: number;
    sticky: boolean;
  };
}

// 响应式配置
interface ResponsiveConfig {
  mobile: LayoutConfig;
  tablet: LayoutConfig;
  desktop: LayoutConfig;
}

// 默认配置
const DEFAULT_CONFIG: ResponsiveConfig = {
  mobile: {
    sidebar: { width: 280, collapsible: true, defaultCollapsed: true },
    header: { height: 56, sticky: true },
    content: { padding: 16 },
    footer: { height: 60, sticky: false }
  },
  tablet: {
    sidebar: { width: 320, collapsible: true, defaultCollapsed: false },
    header: { height: 64, sticky: true },
    content: { padding: 24 },
    footer: { height: 64, sticky: false }
  },
  desktop: {
    sidebar: { width: 280, collapsible: true, defaultCollapsed: false },
    header: { height: 64, sticky: true },
    content: { padding: 32, maxWidth: 1200 },
    footer: { height: 64, sticky: false }
  }
};

// Hook: 使用媒体查询
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);
  
  useEffect(() => {
    const media = window.matchMedia(query);
    setMatches(media.matches);
    
    const listener = (event: MediaQueryListEvent) => {
      setMatches(event.matches);
    };
    
    media.addEventListener('change', listener);
    return () => media.removeEventListener('change', listener);
  }, [query]);
  
  return matches;
}

// Hook: 使用断点
export function useBreakpoint(): Breakpoint {
  const [breakpoint, setBreakpoint] = useState<Breakpoint>('lg');
  
  useEffect(() => {
    const updateBreakpoint = () => {
      const width = window.innerWidth;
      
      if (width >= BREAKPOINTS['2xl']) setBreakpoint('2xl');
      else if (width >= BREAKPOINTS.xl) setBreakpoint('xl');
      else if (width >= BREAKPOINTS.lg) setBreakpoint('lg');
      else if (width >= BREAKPOINTS.md) setBreakpoint('md');
      else if (width >= BREAKPOINTS.sm) setBreakpoint('sm');
      else setBreakpoint('xs');
    };
    
    updateBreakpoint();
    window.addEventListener('resize', updateBreakpoint);
    
    return () => window.removeEventListener('resize', updateBreakpoint);
  }, []);
  
  return breakpoint;
}

// Hook: 使用设备检测
export function useDeviceDetection() {
  const [deviceInfo, setDeviceInfo] = useState({
    type: 'desktop' as DeviceType,
    orientation: 'landscape' as Orientation,
    isTouchDevice: false,
    isRetina: false,
    viewportSize: { width: 1024, height: 768 }
  });
  
  useEffect(() => {
    const updateDeviceInfo = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      
      // 检测设备类型
      let type: DeviceType = 'desktop';
      if (width < BREAKPOINTS.md) type = 'mobile';
      else if (width < BREAKPOINTS.lg) type = 'tablet';
      
      // 检测方向
      const orientation: Orientation = width > height ? 'landscape' : 'portrait';
      
      // 检测触摸设备
      const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
      
      // 检测高分辨率屏幕
      const isRetina = window.devicePixelRatio > 1;
      
      setDeviceInfo({
        type,
        orientation,
        isTouchDevice,
        isRetina,
        viewportSize: { width, height }
      });
    };
    
    updateDeviceInfo();
    window.addEventListener('resize', updateDeviceInfo);
    window.addEventListener('orientationchange', updateDeviceInfo);
    
    return () => {
      window.removeEventListener('resize', updateDeviceInfo);
      window.removeEventListener('orientationchange', updateDeviceInfo);
    };
  }, []);
  
  return deviceInfo;
}

// Hook: 使用虚拟滚动
export function useVirtualScroll<T>({
  items,
  itemHeight,
  containerHeight,
  overscan = 5
}: {
  items: T[];
  itemHeight: number;
  containerHeight: number;
  overscan?: number;
}) {
  const [scrollTop, setScrollTop] = useState(0);
  
  const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
  const endIndex = Math.min(
    items.length - 1,
    Math.ceil((scrollTop + containerHeight) / itemHeight) + overscan
  );
  
  const visibleItems = items.slice(startIndex, endIndex + 1);
  const totalHeight = items.length * itemHeight;
  const offsetY = startIndex * itemHeight;
  
  const handleScroll = useCallback((event: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(event.currentTarget.scrollTop);
  }, []);
  
  return {
    visibleItems,
    totalHeight,
    offsetY,
    handleScroll,
    startIndex,
    endIndex
  };
}

// Hook: 使用触摸手势
export function useTouchGestures({
  onSwipeLeft,
  onSwipeRight,
  onSwipeUp,
  onSwipeDown,
  onPinch,
  threshold = 50
}: {
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onSwipeUp?: () => void;
  onSwipeDown?: () => void;
  onPinch?: (scale: number) => void;
  threshold?: number;
}) {
  const touchStart = useRef<{ x: number; y: number; time: number } | null>(null);
  const touchDistance = useRef<number>(0);
  
  const handleTouchStart = useCallback((event: React.TouchEvent) => {
    const touch = event.touches[0];
    touchStart.current = {
      x: touch.clientX,
      y: touch.clientY,
      time: Date.now()
    };
    
    if (event.touches.length === 2) {
      const touch1 = event.touches[0];
      const touch2 = event.touches[1];
      touchDistance.current = Math.sqrt(
        Math.pow(touch2.clientX - touch1.clientX, 2) +
        Math.pow(touch2.clientY - touch1.clientY, 2)
      );
    }
  }, []);
  
  const handleTouchMove = useCallback((event: React.TouchEvent) => {
    if (event.touches.length === 2 && onPinch) {
      const touch1 = event.touches[0];
      const touch2 = event.touches[1];
      const currentDistance = Math.sqrt(
        Math.pow(touch2.clientX - touch1.clientX, 2) +
        Math.pow(touch2.clientY - touch1.clientY, 2)
      );
      
      if (touchDistance.current > 0) {
        const scale = currentDistance / touchDistance.current;
        onPinch(scale);
      }
    }
  }, [onPinch]);
  
  const handleTouchEnd = useCallback((event: React.TouchEvent) => {
    if (!touchStart.current) return;
    
    const touch = event.changedTouches[0];
    const deltaX = touch.clientX - touchStart.current.x;
    const deltaY = touch.clientY - touchStart.current.y;
    const deltaTime = Date.now() - touchStart.current.time;
    
    // 检查是否为快速滑动
    if (deltaTime < 300) {
      if (Math.abs(deltaX) > threshold && Math.abs(deltaX) > Math.abs(deltaY)) {
        if (deltaX > 0) {
          onSwipeRight?.();
        } else {
          onSwipeLeft?.();
        }
      } else if (Math.abs(deltaY) > threshold && Math.abs(deltaY) > Math.abs(deltaX)) {
        if (deltaY > 0) {
          onSwipeDown?.();
        } else {
          onSwipeUp?.();
        }
      }
    }
    
    touchStart.current = null;
    touchDistance.current = 0;
  }, [onSwipeLeft, onSwipeRight, onSwipeUp, onSwipeDown, threshold]);
  
  return {
    onTouchStart: handleTouchStart,
    onTouchMove: handleTouchMove,
    onTouchEnd: handleTouchEnd
  };
}

// 响应式布局组件
interface ResponsiveLayoutProps {
  children: React.ReactNode;
  sidebar?: React.ReactNode;
  header?: React.ReactNode;
  footer?: React.ReactNode;
  config?: Partial<ResponsiveConfig>;
  className?: string;
}

export function ResponsiveLayout({
  children,
  sidebar,
  header,
  footer,
  config = {},
  className
}: ResponsiveLayoutProps) {
  const deviceInfo = useDeviceDetection();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  
  // 合并配置
  const layoutConfig = {
    mobile: { ...DEFAULT_CONFIG.mobile, ...config.mobile },
    tablet: { ...DEFAULT_CONFIG.tablet, ...config.tablet },
    desktop: { ...DEFAULT_CONFIG.desktop, ...config.desktop }
  };
  
  const currentConfig = layoutConfig[deviceInfo.type];
  
  // 初始化侧边栏状态
  useEffect(() => {
    setSidebarCollapsed(currentConfig.sidebar.defaultCollapsed);
  }, [deviceInfo.type, currentConfig.sidebar.defaultCollapsed]);
  
  // 触摸手势
  const touchGestures = useTouchGestures({
    onSwipeRight: () => {
      if (deviceInfo.type === 'mobile' && sidebar) {
        setSidebarOpen(true);
      }
    },
    onSwipeLeft: () => {
      if (deviceInfo.type === 'mobile' && sidebar) {
        setSidebarOpen(false);
      }
    }
  });
  
  // 移动端侧边栏
  const MobileSidebar = () => {
    if (!sidebar || deviceInfo.type !== 'mobile') return null;
    
    return (
      <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <SheetContent side="left" className="w-80 p-0">
          <ScrollArea className="h-full">
            {sidebar}
          </ScrollArea>
        </SheetContent>
      </Sheet>
    );
  };
  
  // 桌面端侧边栏
  const DesktopSidebar = () => {
    if (!sidebar || deviceInfo.type === 'mobile') return null;
    
    const width = sidebarCollapsed ? 64 : currentConfig.sidebar.width;
    
    return (
      <aside
        className={cn(
          "fixed left-0 top-0 z-40 h-full bg-background border-r transition-all duration-300",
          header && "top-16"
        )}
        style={{ width }}
      >
        <div className="flex flex-col h-full">
          {currentConfig.sidebar.collapsible && (
            <div className="flex justify-end p-2 border-b">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              >
                {sidebarCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
              </Button>
            </div>
          )}
          <ScrollArea className="flex-1">
            <div className={cn("p-4", sidebarCollapsed && "px-2")}>
              {sidebar}
            </div>
          </ScrollArea>
        </div>
      </aside>
    );
  };
  
  // 计算主内容区域的样式
  const getMainContentStyle = () => {
    let marginLeft = 0;
    let marginTop = 0;
    let marginBottom = 0;
    
    // 侧边栏边距
    if (sidebar && deviceInfo.type !== 'mobile') {
      marginLeft = sidebarCollapsed ? 64 : currentConfig.sidebar.width;
    }
    
    // 头部边距
    if (header && currentConfig.header.sticky) {
      marginTop = currentConfig.header.height;
    }
    
    // 底部边距
    if (footer && currentConfig.footer.sticky) {
      marginBottom = currentConfig.footer.height;
    }
    
    return {
      marginLeft,
      marginTop,
      marginBottom,
      minHeight: `calc(100vh - ${marginTop + marginBottom}px)`
    };
  };
  
  return (
    <div className={cn("min-h-screen bg-background", className)} {...touchGestures}>
      {/* 头部 */}
      {header && (
        <header
          className={cn(
            "z-50 w-full bg-background border-b",
            currentConfig.header.sticky && "fixed top-0"
          )}
          style={{ height: currentConfig.header.height }}
        >
          <div className="flex items-center h-full px-4">
            {/* 移动端菜单按钮 */}
            {sidebar && deviceInfo.type === 'mobile' && (
              <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="sm" className="mr-2">
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
              </Sheet>
            )}
            
            <div className="flex-1">
              {header}
            </div>
          </div>
        </header>
      )}
      
      {/* 侧边栏 */}
      <MobileSidebar />
      <DesktopSidebar />
      
      {/* 主内容区域 */}
      <main
        className="transition-all duration-300"
        style={getMainContentStyle()}
      >
        <div
          className="mx-auto"
          style={{
            padding: currentConfig.content.padding,
            maxWidth: currentConfig.content.maxWidth
          }}
        >
          {children}
        </div>
      </main>
      
      {/* 底部 */}
      {footer && (
        <footer
          className={cn(
            "w-full bg-background border-t",
            currentConfig.footer.sticky && "fixed bottom-0"
          )}
          style={{
            height: currentConfig.footer.height,
            marginLeft: sidebar && deviceInfo.type !== 'mobile' 
              ? (sidebarCollapsed ? 64 : currentConfig.sidebar.width) 
              : 0
          }}
        >
          <div className="flex items-center h-full px-4">
            {footer}
          </div>
        </footer>
      )}
    </div>
  );
}

// 响应式网格组件
interface ResponsiveGridProps {
  children: React.ReactNode;
  cols?: {
    xs?: number;
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
    '2xl'?: number;
  };
  gap?: number;
  className?: string;
}

export function ResponsiveGrid({
  children,
  cols = { xs: 1, sm: 2, md: 3, lg: 4 },
  gap = 4,
  className
}: ResponsiveGridProps) {
  const breakpoint = useBreakpoint();
  
  // 获取当前断点的列数
  const getCurrentCols = () => {
    const breakpoints: Breakpoint[] = ['2xl', 'xl', 'lg', 'md', 'sm', 'xs'];
    
    for (const bp of breakpoints) {
      if (BREAKPOINTS[bp] <= window.innerWidth && cols[bp]) {
        return cols[bp];
      }
    }
    
    return cols.xs || 1;
  };
  
  const currentCols = getCurrentCols();
  
  return (
    <div
      className={cn("grid", className)}
      style={{
        gridTemplateColumns: `repeat(${currentCols}, 1fr)`,
        gap: `${gap * 0.25}rem`
      }}
    >
      {children}
    </div>
  );
}

// 设备预览组件
interface DevicePreviewProps {
  children: React.ReactNode;
  device: 'mobile' | 'tablet' | 'desktop';
  orientation?: 'portrait' | 'landscape';
  className?: string;
}

export function DevicePreview({
  children,
  device,
  orientation = 'portrait',
  className
}: DevicePreviewProps) {
  const [currentDevice, setCurrentDevice] = useState(device);
  const [currentOrientation, setCurrentOrientation] = useState(orientation);
  
  // 设备尺寸
  const deviceSizes = {
    mobile: {
      portrait: { width: 375, height: 667 },
      landscape: { width: 667, height: 375 }
    },
    tablet: {
      portrait: { width: 768, height: 1024 },
      landscape: { width: 1024, height: 768 }
    },
    desktop: {
      portrait: { width: 1200, height: 800 },
      landscape: { width: 1200, height: 800 }
    }
  };
  
  const currentSize = deviceSizes[currentDevice][currentOrientation];
  
  return (
    <div className={cn("flex flex-col items-center space-y-4", className)}>
      {/* 设备切换器 */}
      <div className="flex items-center space-x-2">
        <Button
          variant={currentDevice === 'mobile' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setCurrentDevice('mobile')}
        >
          <Smartphone className="h-4 w-4 mr-1" />
          手机
        </Button>
        <Button
          variant={currentDevice === 'tablet' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setCurrentDevice('tablet')}
        >
          <Tablet className="h-4 w-4 mr-1" />
          平板
        </Button>
        <Button
          variant={currentDevice === 'desktop' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setCurrentDevice('desktop')}
        >
          <Monitor className="h-4 w-4 mr-1" />
          桌面
        </Button>
        
        <Separator orientation="vertical" className="h-6" />
        
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            setCurrentOrientation(prev => 
              prev === 'portrait' ? 'landscape' : 'portrait'
            );
          }}
        >
          <RotateCcw className="h-4 w-4 mr-1" />
          旋转
        </Button>
      </div>
      
      {/* 设备框架 */}
      <div
        className="bg-gray-800 rounded-lg p-4 shadow-2xl"
        style={{
          width: currentSize.width + 32,
          height: currentSize.height + 32
        }}
      >
        <div
          className="bg-white rounded overflow-hidden shadow-inner"
          style={{
            width: currentSize.width,
            height: currentSize.height
          }}
        >
          <div className="w-full h-full overflow-auto">
            {children}
          </div>
        </div>
      </div>
      
      {/* 尺寸信息 */}
      <div className="text-sm text-muted-foreground">
        {currentSize.width} × {currentSize.height} ({currentOrientation})
      </div>
    </div>
  );
}

export default ResponsiveLayout;