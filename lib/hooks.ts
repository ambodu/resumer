import { useDispatch, useSelector, useStore } from 'react-redux'
import type { TypedUseSelectorHook } from 'react-redux'
import type { RootState, AppDispatch, AppStore } from './store'
import { useToast } from '@/components/ui/use-toast'
import { useCallback } from 'react'
import {
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
  deleteResume,
  duplicateResume,
  setCurrentResume,
  setLoading,
  setError,
  clearError,
  reorderExperience,
  reorderEducation,
  reorderSkills
} from './store'

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch: () => AppDispatch = useDispatch
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector
export const useAppStore: () => AppStore = useStore

// Custom hooks for resume operations
export const useResumeActions = () => {
  const dispatch = useAppDispatch()
  const { toast } = useToast()

  const handleUpdatePersonalInfo = useCallback((field: string, value: string) => {
    dispatch(updatePersonalInfo({ field, value }))
  }, [dispatch])

  const handleAddExperience = useCallback(() => {
    dispatch(addExperience())
    toast({
      title: "经验已添加",
      description: "新的工作经验已添加到您的简历中",
    })
  }, [dispatch, toast])

  const handleUpdateExperience = useCallback((index: number, field: string, value: string) => {
    dispatch(updateExperience({ index, field, value }))
  }, [dispatch])

  const handleRemoveExperience = useCallback((index: number) => {
    dispatch(removeExperience(index))
    toast({
      title: "经验已删除",
      description: "工作经验已从您的简历中删除",
    })
  }, [dispatch, toast])

  const handleAddEducation = useCallback(() => {
    dispatch(addEducation())
    toast({
      title: "教育经历已添加",
      description: "新的教育经历已添加到您的简历中",
    })
  }, [dispatch, toast])

  const handleUpdateEducation = useCallback((index: number, field: string, value: string) => {
    dispatch(updateEducation({ index, field, value }))
  }, [dispatch])

  const handleRemoveEducation = useCallback((index: number) => {
    dispatch(removeEducation(index))
    toast({
      title: "教育经历已删除",
      description: "教育经历已从您的简历中删除",
    })
  }, [dispatch, toast])

  const handleAddSkill = useCallback(() => {
    dispatch(addSkill())
  }, [dispatch])

  const handleUpdateSkill = useCallback((index: number, value: string) => {
    dispatch(updateSkill({ index, value }))
  }, [dispatch])

  const handleRemoveSkill = useCallback((index: number) => {
    dispatch(removeSkill(index))
  }, [dispatch])

  const handleSaveResume = useCallback(() => {
    dispatch(saveResume())
    toast({
      title: "简历已保存",
      description: "您的简历已成功保存",
    })
  }, [dispatch, toast])

  const handleLoadTemplate = useCallback((template: any) => {
    dispatch(setCurrentResume(template))
    toast({
      title: "模板已加载",
      description: "模板已成功加载到编辑器中",
    })
  }, [dispatch, toast])

  const handleSetLoading = useCallback((loading: boolean) => {
    dispatch(setLoading(loading))
  }, [dispatch])

  const handleSetError = useCallback((error: string | null) => {
    dispatch(setError(error))
    if (error) {
      toast({
        title: "错误",
        description: error,
        variant: "destructive",
      })
    }
  }, [dispatch, toast])

  const handleDeleteResume = useCallback((id: string) => {
    dispatch(deleteResume(id))
    toast({
      title: "简历已删除",
      description: "简历已成功删除",
    })
  }, [dispatch, toast])

  const handleDuplicateResume = useCallback((id: string) => {
    dispatch(duplicateResume(id))
    toast({
      title: "简历已复制",
      description: "简历已成功复制",
    })
  }, [dispatch, toast])

  const handleClearError = useCallback(() => {
    dispatch(clearError())
  }, [dispatch])

  const handleSetCurrentResume = useCallback((resume: any) => {
    dispatch(setCurrentResume(resume));
    toast({
      title: "简历已加载",
      description: "简历已成功加载到编辑器中",
    });
  }, [dispatch, toast]);

  const handleReorderExperience = useCallback((oldIndex: number, newIndex: number) => {
    dispatch(reorderExperience({ oldIndex, newIndex }))
  }, [dispatch])

  const handleReorderEducation = useCallback((oldIndex: number, newIndex: number) => {
    dispatch(reorderEducation({ oldIndex, newIndex }))
  }, [dispatch])

  const handleReorderSkills = useCallback((oldIndex: number, newIndex: number) => {
    dispatch(reorderSkills({ oldIndex, newIndex }))
  }, [dispatch])

  return {
    updatePersonalInfo: handleUpdatePersonalInfo,
    addExperience: handleAddExperience,
    updateExperience: handleUpdateExperience,
    removeExperience: handleRemoveExperience,
    addEducation: handleAddEducation,
    updateEducation: handleUpdateEducation,
    removeEducation: handleRemoveEducation,
    addSkill: handleAddSkill,
    updateSkill: handleUpdateSkill,
    removeSkill: handleRemoveSkill,
    saveResume: handleSaveResume,
    deleteResume: handleDeleteResume,
    duplicateResume: handleDuplicateResume,
    setCurrentResume: handleSetCurrentResume,
    loadTemplate: handleLoadTemplate,
    setLoading: handleSetLoading,
    setError: handleSetError,
    clearError: handleClearError,
    reorderExperience: handleReorderExperience,
    reorderEducation: handleReorderEducation,
    reorderSkills: handleReorderSkills,
  }
}

// Hook for accessing resume state
export const useResumeState = () => {
  return useAppSelector((state) => state.resume)
}