"use client";

import { useSelector, useDispatch } from 'react-redux';
import { useCallback, useEffect, useMemo } from 'react';
import type { RootState, AppDispatch } from './store';
import {
  selectTemplate,
  setCurrentResume,
  updatePersonalInfo,
  addExperience,
  updateExperience,
  removeExperience,
  addEducation,
  updateEducation,
  removeEducation,
  addSkill,
  updateSkill,
  removeSkill,
  saveResume,
  loadResume,
  deleteResume,
  duplicateResume,
  setLoading,
  setSaving,
  setError,
  clearError,
  initializeApp,
  reorderExperience,
  reorderEducation,
  reorderSkills
} from './store';

// 应用状态hook - 优化版本，减少不必要的useCallback
export const useAppState = () => {
  const dispatch = useDispatch<AppDispatch>();
  const state = useSelector((state: RootState) => state.app);
  
  // 创建actions对象，避免重复创建
  const actions = useMemo(() => ({
    // 应用管理
    initializeApp: () => dispatch(initializeApp()),
    
    // 模板管理
    selectTemplate: (templateId: string) => dispatch(selectTemplate(templateId)),
    
    // 简历数据管理
    updateResume: (data: any) => dispatch(setCurrentResume(data)),
    updatePersonalInfo: (field: string, value: string) => 
      dispatch(updatePersonalInfo({ field, value })),
    
    // 工作经历管理
    addExperience: () => dispatch(addExperience()),
    updateExperience: (index: number, field: string, value: any) => 
      dispatch(updateExperience({ index, field, value })),
    removeExperience: (index: number) => dispatch(removeExperience(index)),
    reorderExperience: (oldIndex: number, newIndex: number) => 
      dispatch(reorderExperience({ oldIndex, newIndex })),
    
    // 教育经历管理
    addEducation: () => dispatch(addEducation()),
    updateEducation: (index: number, field: string, value: string) => 
      dispatch(updateEducation({ index, field, value })),
    removeEducation: (index: number) => dispatch(removeEducation(index)),
    reorderEducation: (oldIndex: number, newIndex: number) => 
      dispatch(reorderEducation({ oldIndex, newIndex })),
    
    // 技能管理
    addSkill: () => dispatch(addSkill()),
    updateSkill: (index: number, value: string) => 
      dispatch(updateSkill({ index, value })),
    removeSkill: (index: number) => dispatch(removeSkill(index)),
    reorderSkills: (oldIndex: number, newIndex: number) => 
      dispatch(reorderSkills({ oldIndex, newIndex })),
    
    // 简历保存和加载
    saveResume: (name: string, tags?: string[]) => {
      dispatch(setSaving(true));
      try {
        dispatch(saveResume({ name, tags }));
      } finally {
        dispatch(setSaving(false));
      }
    },
    loadResume: (resumeId: string) => dispatch(loadResume(resumeId)),
    deleteResume: (resumeId: string) => dispatch(deleteResume(resumeId)),
    duplicateResume: (resumeId: string) => dispatch(duplicateResume(resumeId)),
    
    // 状态管理
    setLoading: (loading: boolean) => dispatch(setLoading(loading)),
    setError: (error: string | null) => dispatch(setError(error)),
    clearError: () => dispatch(clearError()),
  }), [dispatch]);
  
  return {
    // 状态
    ...state,
    // 优化后的actions对象
    actions
  };
};

// 简化的简历状态hook（向后兼容）
export const useResumeState = () => {
  const { currentResume, isLoading, error, hasUnsavedChanges, lastSaved } = useAppState();
  
  return {
    currentResume,
    isLoading,
    error,
    hasUnsavedChanges,
    lastSaved
  };
};

// 自动保存hook
export const useAutoSave = (interval: number = 30000) => {
  const { hasUnsavedChanges, actions, currentResume } = useAppState();
  
  useEffect(() => {
    if (!hasUnsavedChanges || !currentResume?.personalInfo?.name) return;
    
    const timer = setTimeout(() => {
      const autoSaveName = `${currentResume.personalInfo.name} - 自动保存`;
      actions.saveResume(autoSaveName, ['auto-save']);
    }, interval);
    
    return () => clearTimeout(timer);
  }, [hasUnsavedChanges, actions, currentResume?.personalInfo?.name, interval]);
};

// 模板管理hook
export const useTemplateManager = () => {
  const { currentTemplateId, savedResumes, actions } = useAppState();
  
  const getTemplateUsage = useCallback(() => {
    const usage: Record<string, number> = {};
    savedResumes.forEach(resume => {
      usage[resume.templateId] = (usage[resume.templateId] || 0) + 1;
    });
    return usage;
  }, [savedResumes]);
  
  return {
    currentTemplateId,
    selectTemplate: actions.selectTemplate,
    getTemplateUsage
  };
};

// 简历管理hook
export const useResumeManager = () => {
  const { savedResumes, actions } = useAppState();
  
  const getResumesByTemplate = useCallback((templateId: string) => {
    return savedResumes.filter(resume => resume.templateId === templateId);
  }, [savedResumes]);
  
  const getResumesByTag = useCallback((tag: string) => {
    return savedResumes.filter(resume => resume.tags.includes(tag));
  }, [savedResumes]);
  
  const getAllTags = useCallback(() => {
    const tags = new Set<string>();
    savedResumes.forEach(resume => {
      resume.tags.forEach(tag => tags.add(tag));
    });
    return Array.from(tags);
  }, [savedResumes]);
  
  return {
    savedResumes,
    loadResume: actions.loadResume,
    deleteResume: actions.deleteResume,
    duplicateResume: actions.duplicateResume,
    saveResume: actions.saveResume,
    getResumesByTemplate,
    getResumesByTag,
    getAllTags
  };
};