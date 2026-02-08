import { createContext, useContext, useEffect, useReducer, useRef } from 'react'
import { appReducer } from './reducer'
import { loadState, saveState } from './persistence'

const AppContext = createContext()

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, null, loadState)
  const timeoutRef = useRef(null)

  // Debounced auto-save to localStorage
  useEffect(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    timeoutRef.current = setTimeout(() => {
      saveState(state)
    }, 500)
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [state])

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  )
}

export function useAppContext() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useAppContext must be used within AppProvider')
  return ctx
}
