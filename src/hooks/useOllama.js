import { useState, useEffect, useCallback, useRef } from 'react'
import { useAppContext } from '../store/AppContext'

export function useOllama() {
  const { state } = useAppContext()
  const { ollamaUrl, ollamaModel } = state.settings
  const [isConnected, setIsConnected] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const intervalRef = useRef(null)

  const checkConnection = useCallback(async () => {
    try {
      const res = await fetch(`${ollamaUrl}/api/tags`, {
        method: 'GET',
        signal: AbortSignal.timeout(5000),
      })
      setIsConnected(res.ok)
      return res.ok
    } catch {
      setIsConnected(false)
      return false
    }
  }, [ollamaUrl])

  // Check connection on mount and every 30s
  useEffect(() => {
    checkConnection()
    intervalRef.current = setInterval(checkConnection, 30000)
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [checkConnection])

  const sendMessage = useCallback(
    async (messages) => {
      setIsLoading(true)
      setError(null)
      try {
        const res = await fetch(`${ollamaUrl}/api/chat`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            model: ollamaModel,
            messages,
            stream: false,
          }),
        })
        if (!res.ok) {
          throw new Error(`Ollama error: ${res.status} ${res.statusText}`)
        }
        const data = await res.json()
        return data.message
      } catch (err) {
        const msg = err.message || 'Failed to connect to Ollama'
        setError(msg)
        throw err
      } finally {
        setIsLoading(false)
      }
    },
    [ollamaUrl, ollamaModel]
  )

  return { sendMessage, checkConnection, isConnected, isLoading, error, model: ollamaModel }
}
