import { configureStore, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { ResumeData } from './types'
import { resumeTemplates, getTemplate } from './templates'
import { storageManager } from './storage-manager'

// 应用状态接口
interface AppState {
  // 当前编辑的简历数据
  currentResume: ResumeData;
  // 当前选择的模板ID
  currentTemplateId: string;
  // 保存的简历列表
  savedResumes: Array<{
    id: string;
    name: string;
    templateId: string;
    data: ResumeData;
    createdAt: string;
    updatedAt: string;
    tags: string[];
    thumbnail?: string;
  }>;
  // 应用状态
  isLoading: boolean;
  isSaving: boolean;
  hasUnsavedChanges: boolean;
  error: string | null;
  lastSaved: string | null;
}

// 应用slice
const appSlice = createSlice({
  name: 'app',
  initialState: {
    currentResume: resumeTemplates.modern,
    currentTemplateId: 'modern',
    savedResumes: [],
    isLoading: false,
    isSaving: false,
    hasUnsavedChanges: false,
    error: null,
    lastSaved: null,
  } as AppState,
  reducers: {
    // 模板管理
    selectTemplate: (state, action: PayloadAction<string>) => {
      const templateId = action.payload;
      const templateData = getTemplate(templateId);
      state.currentTemplateId = templateId;
      state.currentResume = templateData;
      state.hasUnsavedChanges = false;
      state.lastSaved = new Date().toISOString();
      
      // 保存模板选择
      storageManager.saveTemplateSelection(templateId);
      storageManager.saveCurrentResume(templateData, templateId);
    },
    
    setCurrentResume: (state, action: PayloadAction<ResumeData>) => {
      state.currentResume = action.payload;
      state.hasUnsavedChanges = true;
      
      // 自动保存到本地存储
      storageManager.saveCurrentResume(action.payload, state.currentTemplateId);
    },
    updatePersonalInfo: (state, action: PayloadAction<{ field: string; value: string }>) => {
      const { field, value } = action.payload
      state.currentResume.personalInfo[field as keyof typeof state.currentResume.personalInfo] = value
    },
    addExperience: (state) => {
      state.currentResume.experience.push({
        id: Date.now().toString(),
        company: '',
        position: '',
        startDate: '',
        endDate: '',
        description: '',
        current: false
      })
    },
    updateExperience: (state, action: PayloadAction<{ index: number; field: string; value: any }>) => {
      const { index, field, value } = action.payload
      if (state.currentResume.experience[index]) {
        (state.currentResume.experience[index] as any)[field] = value
      }
    },
    removeExperience: (state, action: PayloadAction<number>) => {
      state.currentResume.experience.splice(action.payload, 1)
    },
    addEducation: (state) => {
      state.currentResume.education.push({
        id: Date.now().toString(),
        school: '',
        degree: '',
        field: '',
        startDate: '',
        endDate: '',
        graduationDate: ''
      })
    },
    updateEducation: (state, action: PayloadAction<{ index: number; field: string; value: string }>) => {
      const { index, field, value } = action.payload
      if (state.currentResume.education[index]) {
        (state.currentResume.education[index] as any)[field] = value
      }
    },
    removeEducation: (state, action: PayloadAction<number>) => {
      state.currentResume.education.splice(action.payload, 1)
    },
    addSkill: (state) => {
      state.currentResume.skills.push('')
    },
    updateSkill: (state, action: PayloadAction<{ index: number; value: string }>) => {
      const { index, value } = action.payload
      if (state.currentResume.skills[index] !== undefined) {
        state.currentResume.skills[index] = value
      }
    },
    removeSkill: (state, action: PayloadAction<number>) => {
      state.currentResume.skills.splice(action.payload, 1)
    },
    saveResume: (state, action: PayloadAction<{ name: string; tags?: string[] }>) => {
      if (state.currentResume) {
        const { name, tags = [] } = action.payload;
        const now = new Date().toISOString();
        const resumeId = state.currentResume.id || Date.now().toString();
        
        const savedResume = {
          id: resumeId,
          name,
          templateId: state.currentTemplateId,
          data: { ...state.currentResume, id: resumeId },
          createdAt: state.currentResume.id ? 
            state.savedResumes.find(r => r.id === resumeId)?.createdAt || now : now,
          updatedAt: now,
          tags,
        };
        
        // 更新状态
        const existingIndex = state.savedResumes.findIndex(r => r.id === resumeId);
        if (existingIndex >= 0) {
          state.savedResumes[existingIndex] = savedResume;
        } else {
          state.savedResumes.push(savedResume);
        }
        
        state.currentResume.id = resumeId;
        state.hasUnsavedChanges = false;
        state.lastSaved = now;
        
        // 保存到本地存储
        storageManager.saveResume(savedResume);
      }
    },
    deleteResume: (state, action: PayloadAction<string>) => {
      const resumeId = action.payload;
      state.savedResumes = state.savedResumes.filter(r => r.id !== resumeId);
      
      // 如果删除的是当前编辑的简历，切换到默认模板
      if (state.currentResume?.id === resumeId) {
        state.currentResume = getTemplate(state.currentTemplateId);
        state.hasUnsavedChanges = false;
      }
      
      // 从本地存储删除
      storageManager.deleteResume(resumeId);
    },
    duplicateResume: (state, action: PayloadAction<string>) => {
      const resumeToDuplicate = state.savedResumes.find(
        (resume) => resume.id === action.payload
      );
      if (resumeToDuplicate) {
        const duplicatedResume = {
          ...resumeToDuplicate,
          id: Date.now().toString(),
          personalInfo: {
            ...resumeToDuplicate.personalInfo,
            fullName: `${resumeToDuplicate.personalInfo.fullName} (副本)`
          }
        };
        state.savedResumes.push(duplicatedResume);
      }
    },
    loadResume: (state, action: PayloadAction<string>) => {
      const resumeId = action.payload;
      const savedResume = state.savedResumes.find(r => r.id === resumeId);
      if (savedResume) {
        state.currentResume = savedResume.data;
        state.currentTemplateId = savedResume.templateId;
        state.hasUnsavedChanges = false;
        state.lastSaved = savedResume.updatedAt;
      }
    },
    
    // 应用状态管理
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setSaving: (state, action: PayloadAction<boolean>) => {
      state.isSaving = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
    
    // 初始化应用数据
    initializeApp: (state) => {
      // 加载保存的简历列表
      const savedResumes = storageManager.loadResumes();
      state.savedResumes = savedResumes;
      
      // 恢复模板选择
      const templateSelection = storageManager.loadTemplateSelection();
      if (templateSelection) {
        state.currentTemplateId = templateSelection.templateId;
      }
      
      // 恢复当前工作数据
      const currentWork = storageManager.loadCurrentResume();
      if (currentWork && currentWork.templateId === state.currentTemplateId) {
        state.currentResume = currentWork.data;
        state.hasUnsavedChanges = false;
      } else {
        state.currentResume = getTemplate(state.currentTemplateId);
      }
    },
    reorderExperience: (state, action: PayloadAction<{ oldIndex: number; newIndex: number }>) => {
      const { oldIndex, newIndex } = action.payload
      const [removed] = state.currentResume.experience.splice(oldIndex, 1)
      state.currentResume.experience.splice(newIndex, 0, removed)
    },
    reorderEducation: (state, action: PayloadAction<{ oldIndex: number; newIndex: number }>) => {
      const { oldIndex, newIndex } = action.payload
      const [removed] = state.currentResume.education.splice(oldIndex, 1)
      state.currentResume.education.splice(newIndex, 0, removed)
    },
    reorderSkills: (state, action: PayloadAction<{ oldIndex: number; newIndex: number }>) => {
      const { oldIndex, newIndex } = action.payload
      const [removed] = state.currentResume.skills.splice(oldIndex, 1)
      state.currentResume.skills.splice(newIndex, 0, removed)
    }
  }
})

export const {
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
} = appSlice.actions

export const makeStore = () => {
  return configureStore({
    reducer: {
      app: appSlice.reducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: {
          ignoredActions: ['persist/PERSIST'],
          ignoredPaths: ['app.lastSaved']
        }
      })
  })
}

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore['getState']>
export type AppDispatch = AppStore['dispatch']