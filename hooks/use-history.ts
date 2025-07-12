"use client";

import { useState, useCallback, useRef, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';

// 历史记录项接口
interface HistoryItem<T> {
  id: string;
  data: T;
  timestamp: number;
  action: string;
  description?: string;
}

// 历史记录配置
interface HistoryConfig {
  maxSize?: number;
  debounceMs?: number;
  autoSave?: boolean;
  storageKey?: string;
}

// 历史记录Hook
export function useHistory<T>(
  initialData: T,
  config: HistoryConfig = {}
) {
  const {
    maxSize = 50,
    debounceMs = 1000,
    autoSave = true,
    storageKey = 'history'
  } = config;

  const [history, setHistory] = useState<HistoryItem<T>[]>([]);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [currentData, setCurrentData] = useState<T>(initialData);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);
  const { toast } = useToast();

  // 初始化历史记录
  useEffect(() => {
    if (autoSave && storageKey) {
      loadFromStorage();
    } else {
      // 添加初始状态
      addToHistory(initialData, 'init', '初始状态');
    }
  }, []);

  // 从本地存储加载历史记录
  const loadFromStorage = useCallback(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const { history: savedHistory, currentIndex: savedIndex, currentData: savedData } = JSON.parse(saved);
        setHistory(savedHistory || []);
        setCurrentIndex(savedIndex ?? -1);
        setCurrentData(savedData || initialData);
      } else {
        addToHistory(initialData, 'init', '初始状态');
      }
    } catch (error) {
      console.error('Failed to load history from storage:', error);
      addToHistory(initialData, 'init', '初始状态');
    }
  }, [initialData, storageKey]);

  // 保存到本地存储
  const saveToStorage = useCallback(() => {
    if (autoSave && storageKey) {
      try {
        localStorage.setItem(storageKey, JSON.stringify({
          history,
          currentIndex,
          currentData
        }));
      } catch (error) {
        console.error('Failed to save history to storage:', error);
      }
    }
  }, [history, currentIndex, currentData, autoSave, storageKey]);

  // 添加到历史记录
  const addToHistory = useCallback((data: T, action: string, description?: string) => {
    const newItem: HistoryItem<T> = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      data: JSON.parse(JSON.stringify(data)), // 深拷贝
      timestamp: Date.now(),
      action,
      description
    };

    setHistory(prev => {
      // 如果当前不在最新位置，删除后面的历史记录
      const newHistory = currentIndex >= 0 ? prev.slice(0, currentIndex + 1) : [];
      
      // 添加新记录
      newHistory.push(newItem);
      
      // 限制历史记录大小
      if (newHistory.length > maxSize) {
        newHistory.shift();
      }
      
      return newHistory;
    });

    setCurrentIndex(prev => {
      const newIndex = currentIndex >= 0 ? Math.min(currentIndex + 1, maxSize - 1) : 0;
      return newIndex;
    });

    setCurrentData(data);
  }, [currentIndex, maxSize]);

  // 防抖添加历史记录
  const debouncedAddToHistory = useCallback((data: T, action: string, description?: string) => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(() => {
      addToHistory(data, action, description);
    }, debounceMs);
  }, [addToHistory, debounceMs]);

  // 撤销
  const undo = useCallback(() => {
    if (canUndo) {
      const newIndex = currentIndex - 1;
      const targetItem = history[newIndex];
      
      setCurrentIndex(newIndex);
      setCurrentData(targetItem.data);
      
      toast({
        title: "已撤销",
        description: targetItem.description || `撤销到：${targetItem.action}`,
        duration: 2000
      });
      
      return targetItem.data;
    }
    return null;
  }, [currentIndex, history, toast]);

  // 重做
  const redo = useCallback(() => {
    if (canRedo) {
      const newIndex = currentIndex + 1;
      const targetItem = history[newIndex];
      
      setCurrentIndex(newIndex);
      setCurrentData(targetItem.data);
      
      toast({
        title: "已重做",
        description: targetItem.description || `重做到：${targetItem.action}`,
        duration: 2000
      });
      
      return targetItem.data;
    }
    return null;
  }, [currentIndex, history, toast]);

  // 跳转到指定历史记录
  const goToHistory = useCallback((index: number) => {
    if (index >= 0 && index < history.length) {
      const targetItem = history[index];
      setCurrentIndex(index);
      setCurrentData(targetItem.data);
      
      toast({
        title: "已跳转",
        description: targetItem.description || `跳转到：${targetItem.action}`,
        duration: 2000
      });
      
      return targetItem.data;
    }
    return null;
  }, [history, toast]);

  // 清空历史记录
  const clearHistory = useCallback(() => {
    setHistory([]);
    setCurrentIndex(-1);
    addToHistory(currentData, 'clear', '清空历史记录');
    
    toast({
      title: "历史记录已清空",
      description: "所有历史记录已被清除",
      duration: 2000
    });
  }, [currentData, addToHistory, toast]);

  // 获取历史记录摘要
  const getHistorySummary = useCallback(() => {
    return history.map((item, index) => ({
      index,
      action: item.action,
      description: item.description,
      timestamp: new Date(item.timestamp).toLocaleString(),
      isCurrent: index === currentIndex
    }));
  }, [history, currentIndex]);

  // 导出历史记录
  const exportHistory = useCallback(() => {
    const exportData = {
      history,
      currentIndex,
      exportTime: new Date().toISOString(),
      version: '1.0'
    };
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `history-${Date.now()}.json`;
    link.click();
    URL.revokeObjectURL(url);
  }, [history, currentIndex]);

  // 导入历史记录
  const importHistory = useCallback((file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importData = JSON.parse(e.target?.result as string);
        if (importData.history && Array.isArray(importData.history)) {
          setHistory(importData.history);
          setCurrentIndex(importData.currentIndex ?? importData.history.length - 1);
          
          const currentItem = importData.history[importData.currentIndex ?? importData.history.length - 1];
          if (currentItem) {
            setCurrentData(currentItem.data);
          }
          
          toast({
            title: "历史记录已导入",
            description: `成功导入 ${importData.history.length} 条历史记录`,
            duration: 3000
          });
        }
      } catch (error) {
        toast({
          title: "导入失败",
          description: "历史记录文件格式错误",
          duration: 3000
        });
      }
    };
    reader.readAsText(file);
  }, [toast]);

  // 保存到存储（当历史记录变化时）
  useEffect(() => {
    saveToStorage();
  }, [saveToStorage]);

  // 计算状态
  const canUndo = currentIndex > 0;
  const canRedo = currentIndex < history.length - 1;
  const historySize = history.length;
  const currentItem = history[currentIndex];

  return {
    // 数据
    currentData,
    history,
    currentIndex,
    currentItem,
    
    // 状态
    canUndo,
    canRedo,
    historySize,
    
    // 操作
    addToHistory,
    debouncedAddToHistory,
    undo,
    redo,
    goToHistory,
    clearHistory,
    
    // 工具
    getHistorySummary,
    exportHistory,
    importHistory,
    loadFromStorage,
    saveToStorage
  };
}

// 简历历史记录Hook
export function useResumeHistory(initialResume: any) {
  const history = useHistory(initialResume, {
    maxSize: 100,
    debounceMs: 2000,
    autoSave: true,
    storageKey: 'resume-history'
  });

  // 简历特定的操作
  const saveResumeState = useCallback((resume: any, action: string, description?: string) => {
    history.addToHistory(resume, action, description);
  }, [history]);

  const debouncedSaveResumeState = useCallback((resume: any, action: string, description?: string) => {
    history.debouncedAddToHistory(resume, action, description);
  }, [history]);

  // 快捷操作
  const savePersonalInfo = useCallback((resume: any) => {
    saveResumeState(resume, 'personal-info', '更新个人信息');
  }, [saveResumeState]);

  const saveExperience = useCallback((resume: any) => {
    saveResumeState(resume, 'experience', '更新工作经验');
  }, [saveResumeState]);

  const saveEducation = useCallback((resume: any) => {
    saveResumeState(resume, 'education', '更新教育背景');
  }, [saveResumeState]);

  const saveSkills = useCallback((resume: any) => {
    saveResumeState(resume, 'skills', '更新技能特长');
  }, [saveResumeState]);

  return {
    ...history,
    saveResumeState,
    debouncedSaveResumeState,
    savePersonalInfo,
    saveExperience,
    saveEducation,
    saveSkills
  };
}

// 历史记录面板组件Hook
export function useHistoryPanel() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const openPanel = useCallback(() => setIsOpen(true), []);
  const closePanel = useCallback(() => setIsOpen(false), []);
  const togglePanel = useCallback(() => setIsOpen(prev => !prev), []);

  const selectHistoryItem = useCallback((index: number) => {
    setSelectedIndex(index);
  }, []);

  const clearSelection = useCallback(() => {
    setSelectedIndex(null);
  }, []);

  return {
    isOpen,
    selectedIndex,
    openPanel,
    closePanel,
    togglePanel,
    selectHistoryItem,
    clearSelection
  };
}