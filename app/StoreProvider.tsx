'use client'
import { useRef, useEffect } from 'react'
import { Provider } from 'react-redux'
import { makeStore, AppStore } from '../lib/store'

export default function StoreProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const storeRef = useRef<AppStore>()
  
  if (!storeRef.current) {
    // Create the store instance the first time this renders
    storeRef.current = makeStore()
  }

  useEffect(() => {
    // Load saved data from localStorage on app start
    const savedData = localStorage.getItem('resumeData')
    if (savedData && storeRef.current) {
      try {
        const parsedData = JSON.parse(savedData)
        storeRef.current.dispatch({ type: 'resume/setCurrentResume', payload: parsedData })
      } catch (error) {
        console.error('Failed to load saved resume data:', error)
      }
    }

    // Save data to localStorage whenever store changes
    const unsubscribe = storeRef.current?.subscribe(() => {
      const state = storeRef.current?.getState()
      if (state?.resume.currentResume) {
        localStorage.setItem('resumeData', JSON.stringify(state.resume.currentResume))
      }
    })

    return () => {
      unsubscribe?.()
    }
  }, [])

  return <Provider store={storeRef.current}>{children}</Provider>
}