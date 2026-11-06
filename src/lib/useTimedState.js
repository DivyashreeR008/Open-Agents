import { useCallback, useEffect, useRef, useState } from 'react'

export function useTimedState(initialValue, enabled = true) {
  const [value, setValue] = useState(initialValue)
  const timerRef = useRef(null)
  const enabledRef = useRef(enabled)

  useEffect(() => {
    enabledRef.current = enabled
    if (!enabled) setValue(initialValue)

    return () => {
      enabledRef.current = false
      clearTimeout(timerRef.current)
      timerRef.current = null
    }
  }, [enabled, initialValue])

  const update = useCallback(
    (nextValue, delayMs) => {
      if (!enabledRef.current) return
      clearTimeout(timerRef.current)
      timerRef.current = null
      setValue(nextValue)
      if (delayMs > 0) {
        timerRef.current = setTimeout(() => {
          timerRef.current = null
          setValue(initialValue)
        }, delayMs)
      }
    },
    [initialValue]
  )

  return [value, update]
}
