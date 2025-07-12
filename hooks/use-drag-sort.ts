"use client";

import { useState, useCallback } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragStartEvent,
  DragOverlay,
  UniqueIdentifier,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  horizontalListSortingStrategy,
} from '@dnd-kit/sortable';
import {
  useSortable,
  CSS,
} from '@dnd-kit/sortable';
import { restrictToVerticalAxis, restrictToHorizontalAxis } from '@dnd-kit/modifiers';

// 拖拽项目接口
export interface DragItem {
  id: string;
  [key: string]: any;
}

// 拖拽配置
export interface DragSortConfig {
  direction?: 'vertical' | 'horizontal';
  disabled?: boolean;
  onDragStart?: (item: DragItem) => void;
  onDragEnd?: (items: DragItem[]) => void;
  onDragCancel?: () => void;
}

// 拖拽排序Hook
export function useDragSort<T extends DragItem>(
  initialItems: T[],
  config: DragSortConfig = {}
) {
  const [items, setItems] = useState<T[]>(initialItems);
  const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const {
    direction = 'vertical',
    disabled = false,
    onDragStart,
    onDragEnd,
    onDragCancel
  } = config;

  // 传感器配置
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // 8px 移动距离后开始拖拽
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // 获取当前拖拽的项目
  const activeItem = activeId ? items.find(item => item.id === activeId) : null;

  // 拖拽开始
  const handleDragStart = useCallback((event: DragStartEvent) => {
    const { active } = event;
    setActiveId(active.id);
    setIsDragging(true);
    
    const item = items.find(item => item.id === active.id);
    if (item && onDragStart) {
      onDragStart(item);
    }
  }, [items, onDragStart]);

  // 拖拽结束
  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event;
    
    setActiveId(null);
    setIsDragging(false);

    if (over && active.id !== over.id) {
      const oldIndex = items.findIndex(item => item.id === active.id);
      const newIndex = items.findIndex(item => item.id === over.id);
      
      const newItems = arrayMove(items, oldIndex, newIndex);
      setItems(newItems);
      
      if (onDragEnd) {
        onDragEnd(newItems);
      }
    }
  }, [items, onDragEnd]);

  // 拖拽取消
  const handleDragCancel = useCallback(() => {
    setActiveId(null);
    setIsDragging(false);
    
    if (onDragCancel) {
      onDragCancel();
    }
  }, [onDragCancel]);

  // 更新项目列表
  const updateItems = useCallback((newItems: T[]) => {
    setItems(newItems);
  }, []);

  // 添加项目
  const addItem = useCallback((item: T, index?: number) => {
    setItems(prev => {
      if (index !== undefined) {
        const newItems = [...prev];
        newItems.splice(index, 0, item);
        return newItems;
      }
      return [...prev, item];
    });
  }, []);

  // 移除项目
  const removeItem = useCallback((id: string) => {
    setItems(prev => prev.filter(item => item.id !== id));
  }, []);

  // 移动项目
  const moveItem = useCallback((fromIndex: number, toIndex: number) => {
    setItems(prev => arrayMove(prev, fromIndex, toIndex));
  }, []);

  // 获取拖拽上下文属性
  const getDragContextProps = () => ({
    sensors,
    collisionDetection: closestCenter,
    onDragStart: handleDragStart,
    onDragEnd: handleDragEnd,
    onDragCancel: handleDragCancel,
    modifiers: direction === 'vertical' ? [restrictToVerticalAxis] : [restrictToHorizontalAxis],
  });

  // 获取排序上下文属性
  const getSortableContextProps = () => ({
    items: items.map(item => item.id),
    strategy: direction === 'vertical' ? verticalListSortingStrategy : horizontalListSortingStrategy,
  });

  return {
    items,
    activeItem,
    isDragging,
    disabled,
    updateItems,
    addItem,
    removeItem,
    moveItem,
    getDragContextProps,
    getSortableContextProps,
    DndContext,
    SortableContext,
    DragOverlay,
  };
}

// 可排序项目Hook
export function useSortableItem(id: string, disabled: boolean = false) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ 
    id,
    disabled,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return {
    ref: setNodeRef,
    style,
    attributes,
    listeners,
    isDragging,
  };
}

// 拖拽手柄Hook
export function useDragHandle() {
  const {
    attributes,
    listeners,
    setActivatorNodeRef,
  } = useSortable({ id: 'handle' });

  return {
    ref: setActivatorNodeRef,
    attributes,
    listeners,
  };
}

// 拖拽排序组件包装器
export interface DragSortWrapperProps<T extends DragItem> {
  items: T[];
  onItemsChange: (items: T[]) => void;
  direction?: 'vertical' | 'horizontal';
  disabled?: boolean;
  children: (props: {
    items: T[];
    isDragging: boolean;
    DndContext: typeof DndContext;
    SortableContext: typeof SortableContext;
    DragOverlay: typeof DragOverlay;
    activeItem: T | null;
    dragContextProps: any;
    sortableContextProps: any;
  }) => React.ReactNode;
}

export function DragSortWrapper<T extends DragItem>({
  items,
  onItemsChange,
  direction = 'vertical',
  disabled = false,
  children,
}: DragSortWrapperProps<T>) {
  const dragSort = useDragSort(items, {
    direction,
    disabled,
    onDragEnd: onItemsChange,
  });

  return (
    <>
      {children({
        items: dragSort.items,
        isDragging: dragSort.isDragging,
        DndContext: dragSort.DndContext,
        SortableContext: dragSort.SortableContext,
        DragOverlay: dragSort.DragOverlay,
        activeItem: dragSort.activeItem,
        dragContextProps: dragSort.getDragContextProps(),
        sortableContextProps: dragSort.getSortableContextProps(),
      })}
    </>
  );
}

// 简历部分拖拽排序Hook
export function useResumeSectionDragSort() {
  const [sections, setSections] = useState([
    { id: 'personal', name: '个人信息', order: 0 },
    { id: 'experience', name: '工作经验', order: 1 },
    { id: 'education', name: '教育背景', order: 2 },
    { id: 'skills', name: '技能特长', order: 3 },
  ]);

  const updateSectionOrder = useCallback((newSections: typeof sections) => {
    const updatedSections = newSections.map((section, index) => ({
      ...section,
      order: index,
    }));
    setSections(updatedSections);
    
    // 保存到本地存储
    localStorage.setItem('resumeSectionOrder', JSON.stringify(updatedSections));
  }, []);

  // 从本地存储加载顺序
  const loadSectionOrder = useCallback(() => {
    const saved = localStorage.getItem('resumeSectionOrder');
    if (saved) {
      try {
        const parsedSections = JSON.parse(saved);
        setSections(parsedSections);
      } catch (error) {
        console.error('Failed to load section order:', error);
      }
    }
  }, []);

  return {
    sections,
    updateSectionOrder,
    loadSectionOrder,
  };
}

// 工作经验拖拽排序Hook
export function useExperienceDragSort(experiences: any[]) {
  return useDragSort(experiences.map((exp, index) => ({ ...exp, id: exp.id || `exp-${index}` })), {
    direction: 'vertical',
    onDragEnd: (items) => {
      // 更新经验顺序的逻辑
      console.log('Experience order updated:', items);
    },
  });
}

// 教育背景拖拽排序Hook
export function useEducationDragSort(educations: any[]) {
  return useDragSort(educations.map((edu, index) => ({ ...edu, id: edu.id || `edu-${index}` })), {
    direction: 'vertical',
    onDragEnd: (items) => {
      // 更新教育顺序的逻辑
      console.log('Education order updated:', items);
    },
  });
}

// 技能拖拽排序Hook
export function useSkillsDragSort(skills: any[]) {
  return useDragSort(skills.map((skill, index) => ({ ...skill, id: skill.id || `skill-${index}` })), {
    direction: 'horizontal',
    onDragEnd: (items) => {
      // 更新技能顺序的逻辑
      console.log('Skills order updated:', items);
    },
  });
}