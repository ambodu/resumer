import { configureStore, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { ResumeData } from './types'
import { resumeTemplates } from './templates'

// Resume slice for managing resume data
const resumeSlice = createSlice({
  name: 'resume',
  initialState: {
    currentResume: resumeTemplates.empty,
    savedResumes: [] as ResumeData[],
    isLoading: false,
    error: null as string | null,
    lastSaved: null as string | null,
  },
  reducers: {
    setCurrentResume: (state, action: PayloadAction<ResumeData>) => {
      state.currentResume = action.payload
      state.lastSaved = new Date().toISOString()
    },
    updatePersonalInfo: (state, action: PayloadAction<{ field: string; value: string }>) => {
      const { field, value } = action.payload
      state.currentResume.personalInfo[field as keyof typeof state.currentResume.personalInfo] = value
    },
    addExperience: (state) => {
      state.currentResume.experience.push({
        company: '',
        position: '',
        startDate: '',
        endDate: '',
        description: ''
      })
    },
    updateExperience: (state, action: PayloadAction<{ index: number; field: string; value: string }>) => {
      const { index, field, value } = action.payload
      if (state.currentResume.experience[index]) {
        state.currentResume.experience[index][field as keyof typeof state.currentResume.experience[0]] = value
      }
    },
    removeExperience: (state, action: PayloadAction<number>) => {
      state.currentResume.experience.splice(action.payload, 1)
    },
    addEducation: (state) => {
      state.currentResume.education.push({
        school: '',
        degree: '',
        field: '',
        graduationDate: ''
      })
    },
    updateEducation: (state, action: PayloadAction<{ index: number; field: string; value: string }>) => {
      const { index, field, value } = action.payload
      if (state.currentResume.education[index]) {
        state.currentResume.education[index][field as keyof typeof state.currentResume.education[0]] = value
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
    saveResume: (state) => {
      if (state.currentResume) {
        const existingIndex = state.savedResumes.findIndex(
          (resume) => resume.id === state.currentResume?.id
        );
        
        if (existingIndex >= 0) {
          state.savedResumes[existingIndex] = state.currentResume;
        } else {
          state.savedResumes.push({
            ...state.currentResume,
            id: Date.now().toString(),
          });
        }
        
        state.lastSaved = new Date().toISOString();
      }
    },
    deleteResume: (state, action: PayloadAction<string>) => {
      state.savedResumes = state.savedResumes.filter(
        (resume) => resume.id !== action.payload
      );
      // If the deleted resume is currently being edited, clear it
      if (state.currentResume?.id === action.payload) {
        state.currentResume = resumeTemplates.empty;
      }
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
    loadResume: (state, action: PayloadAction<ResumeData>) => {
      state.currentResume = action.payload
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload
    },
    clearError: (state) => {
      state.error = null
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
  setError,
  clearError,
  reorderExperience,
  reorderEducation,
  reorderSkills
} = resumeSlice.actions

export const makeStore = () => {
  return configureStore({
    reducer: {
      resume: resumeSlice.reducer
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: {
          ignoredActions: ['persist/PERSIST']
        }
      })
  })
}

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore['getState']>
export type AppDispatch = AppStore['dispatch']