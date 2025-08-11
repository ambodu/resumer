'use client'
import { useRef, useEffect } from 'react'
import { Provider } from 'react-redux'
import { makeStore, AppStore } from '../lib/store'
import { initializeApp } from '../lib/store'

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
    // Initialize app with saved data using the new action
    if (storeRef.current) {
      storeRef.current.dispatch(initializeApp())
    }
  }, [])

  return <Provider store={storeRef.current}>{children}</Provider>
}