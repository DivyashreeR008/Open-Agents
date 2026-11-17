import { useCallback, useEffect, useRef, useState } from 'react'

export function useTimedState(initialValue, enabled = true) {
  const [value, setValue] = useState(initialValue)
  const timerRef = useRef(null)
  const enabledRef = useRef(enabled)
  const initialRef = useRef(initialValue)
  initialRef.current = initialValue

  useEffect(() => {
    enabledRef.current = enabled

    if (!enabled) {
      clearTimeout(timerRef.current)
      timerRef.current = null
      setValue(initialRef.current)
    }

    return () => {
      enabledRef.current = false
      clearTimeout(timerRef.current)
      timerRef.current = null
    }
  }, [enabled])

  const update = useCallback((nextValue, delayMs) => {
    if (!enabledRef.current) return
    clearTimeout(timerRef.current)
    timerRef.current = null
    setValue(nextValue)
    if (delayMs > 0) {
      timerRef.current = setTimeout(() => {
        timerRef.current = null
        setValue(initialRef.current)
      }, delayMs)
    }
  }, [])

  return [enabled ? value : initialRef.current, update]
}
