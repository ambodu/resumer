"use client";

import { useEffect, useCallback, useRef } from 'react';
import { useResumeActions } from '@/lib/hooks';
import { useToast } from '@/components/ui/use-toast';

interface KeyboardShortcut {
  key: string;
  ctrlKey?: boolean;
  shiftKey?: boolean;
  altKey?: boolean;
  metaKey?: boolean;
  action: () => void;
  description: string;
  category: string;
}

export function useKeyboardShortcuts() {
  const { saveResume, exportToPDF } = useResumeActions();
  const { toast } = useToast();
  const isActiveRef = useRef(true);

  // 快捷键配置
  const shortcuts: KeyboardShortcut[] = [
    // 文件操作
    {
      key: 's',
      ctrlKey: true,
      action: () => {
        saveResume();
        toast({
          title: "简历已保存",
          description: "您的简历已自动保存到本地存储"
        });
      },
      description: '保存简历',
      category: '文件操作'
    },
    {
      key: 'p',
      ctrlKey: true,
      action: () => {
        exportToPDF();
        toast({
          title: "导出PDF",
          description: "正在生成PDF文件..."
        });
      },
      description: '导出PDF',
      category: '文件操作'
    },
    {
      key: 'n',
      ctrlKey: true,
      action: () => {
        if (confirm('确定要创建新简历吗？当前未保存的更改将丢失。')) {
          window.location.href = '/templates';
        }
      },
      description: '新建简历',
      category: '文件操作'
    },
    {
      key: 'o',
      ctrlKey: true,
      action: () => {
        window.location.href = '/resumes';
      },
      description: '打开简历管理',
      category: '文件操作'
    },

    // 编辑操作
    {
      key: 'z',
      ctrlKey: true,
      action: () => {
        // 撤销操作（需要实现历史记录）
        toast({
          title: "撤销",
          description: "撤销功能正在开发中"
        });
      },
      description: '撤销',
      category: '编辑操作'
    },
    {
      key: 'y',
      ctrlKey: true,
      action: () => {
        // 重做操作（需要实现历史记录）
        toast({
          title: "重做",
          description: "重做功能正在开发中"
        });
      },
      description: '重做',
      category: '编辑操作'
    },
    {
      key: 'z',
      ctrlKey: true,
      shiftKey: true,
      action: () => {
        // 重做操作（备选快捷键）
        toast({
          title: "重做",
          description: "重做功能正在开发中"
        });
      },
      description: '重做（备选）',
      category: '编辑操作'
    },

    // 导航操作
    {
      key: '1',
      ctrlKey: true,
      action: () => {
        window.location.href = '/';
      },
      description: '跳转到首页',
      category: '导航操作'
    },
    {
      key: '2',
      ctrlKey: true,
      action: () => {
        window.location.href = '/templates';
      },
      description: '跳转到模板页',
      category: '导航操作'
    },
    {
      key: '3',
      ctrlKey: true,
      action: () => {
        window.location.href = '/editor';
      },
      description: '跳转到编辑器',
      category: '导航操作'
    },
    {
      key: '4',
      ctrlKey: true,
      action: () => {
        window.location.href = '/resumes';
      },
      description: '跳转到简历管理',
      category: '导航操作'
    },

    // 视图操作
    {
      key: 'Tab',
      action: () => {
        // 切换编辑/预览模式
        const editButton = document.querySelector('[data-mode="edit"]') as HTMLButtonElement;
        const previewButton = document.querySelector('[data-mode="preview"]') as HTMLButtonElement;
        
        if (editButton?.classList.contains('bg-blue-500')) {
          previewButton?.click();
        } else {
          editButton?.click();
        }
      },
      description: '切换编辑/预览模式',
      category: '视图操作'
    },
    {
      key: 'f',
      ctrlKey: true,
      action: () => {
        // 搜索功能
        const searchInput = document.querySelector('input[type="search"]') as HTMLInputElement;
        if (searchInput) {
          searchInput.focus();
        } else {
          toast({
            title: "搜索",
            description: "当前页面没有搜索功能"
          });
        }
      },
      description: '搜索',
      category: '视图操作'
    },

    // 帮助操作
    {
      key: '?',
      shiftKey: true,
      action: () => {
        showShortcutsHelp();
      },
      description: '显示快捷键帮助',
      category: '帮助操作'
    },
    {
      key: 'F1',
      action: () => {
        showShortcutsHelp();
      },
      description: '显示快捷键帮助',
      category: '帮助操作'
    }
  ];

  // 显示快捷键帮助
  const showShortcutsHelp = useCallback(() => {
    const helpContent = shortcuts
      .reduce((acc, shortcut) => {
        if (!acc[shortcut.category]) {
          acc[shortcut.category] = [];
        }
        acc[shortcut.category].push(shortcut);
        return acc;
      }, {} as Record<string, KeyboardShortcut[]>);

    const helpText = Object.entries(helpContent)
      .map(([category, shortcuts]) => {
        const shortcutList = shortcuts
          .map(s => {
            const keys = [];
            if (s.ctrlKey) keys.push('Ctrl');
            if (s.shiftKey) keys.push('Shift');
            if (s.altKey) keys.push('Alt');
            if (s.metaKey) keys.push('Cmd');
            keys.push(s.key.toUpperCase());
            return `${keys.join(' + ')}: ${s.description}`;
          })
          .join('\n');
        return `${category}:\n${shortcutList}`;
      })
      .join('\n\n');

    alert(`键盘快捷键帮助:\n\n${helpText}`);
  }, [shortcuts]);

  // 处理键盘事件
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    // 如果在输入框中，忽略某些快捷键
    const target = event.target as HTMLElement;
    const isInputElement = target.tagName === 'INPUT' || 
                          target.tagName === 'TEXTAREA' || 
                          target.contentEditable === 'true';

    // 在输入框中只允许某些快捷键
    if (isInputElement) {
      const allowedInInput = ['s', 'p', 'z', 'y', '?', 'F1'];
      if (!allowedInInput.includes(event.key) && event.ctrlKey) {
        return;
      }
    }

    // 查找匹配的快捷键
    const matchedShortcut = shortcuts.find(shortcut => {
      return (
        shortcut.key.toLowerCase() === event.key.toLowerCase() &&
        !!shortcut.ctrlKey === event.ctrlKey &&
        !!shortcut.shiftKey === event.shiftKey &&
        !!shortcut.altKey === event.altKey &&
        !!shortcut.metaKey === event.metaKey
      );
    });

    if (matchedShortcut && isActiveRef.current) {
      event.preventDefault();
      event.stopPropagation();
      matchedShortcut.action();
    }
  }, [shortcuts]);

  // 激活/停用快捷键
  const setActive = useCallback((active: boolean) => {
    isActiveRef.current = active;
  }, []);

  // 添加自定义快捷键
  const addShortcut = useCallback((shortcut: KeyboardShortcut) => {
    shortcuts.push(shortcut);
  }, [shortcuts]);

  // 移除快捷键
  const removeShortcut = useCallback((key: string, modifiers?: Partial<Pick<KeyboardShortcut, 'ctrlKey' | 'shiftKey' | 'altKey' | 'metaKey'>>) => {
    const index = shortcuts.findIndex(s => 
      s.key === key &&
      (!modifiers?.ctrlKey || s.ctrlKey === modifiers.ctrlKey) &&
      (!modifiers?.shiftKey || s.shiftKey === modifiers.shiftKey) &&
      (!modifiers?.altKey || s.altKey === modifiers.altKey) &&
      (!modifiers?.metaKey || s.metaKey === modifiers.metaKey)
    );
    if (index > -1) {
      shortcuts.splice(index, 1);
    }
  }, [shortcuts]);

  // 绑定事件监听器
  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);

  // 显示快捷键提示
  const showShortcutToast = useCallback((message: string) => {
    toast({
      title: "快捷键提示",
      description: message,
      duration: 2000
    });
  }, [toast]);

  return {
    shortcuts,
    setActive,
    addShortcut,
    removeShortcut,
    showShortcutsHelp,
    showShortcutToast
  };
}

// 快捷键提示组件Hook
export function useShortcutHints() {
  const { showShortcutToast } = useKeyboardShortcuts();

  const showHint = useCallback((action: string) => {
    const hints: Record<string, string> = {
      save: 'Ctrl + S 保存简历',
      export: 'Ctrl + P 导出PDF',
      new: 'Ctrl + N 新建简历',
      open: 'Ctrl + O 打开简历管理',
      undo: 'Ctrl + Z 撤销',
      redo: 'Ctrl + Y 重做',
      help: '? 或 F1 显示帮助'
    };

    if (hints[action]) {
      showShortcutToast(hints[action]);
    }
  }, [showShortcutToast]);

  return { showHint };
}