import { useCallback, useEffect, useRef, useState } from 'react'

export function useFlashNotice(duration = 3500) {
  const [notice, setNotice] = useState(null)
  const timerRef = useRef(null)

  const clearTimer = useCallback(() => {
    if (timerRef.current !== null) {
      clearTimeout(timerRef.current)
      timerRef.current = null
    }
  }, [])

  const flash = useCallback(
    (message) => {
      clearTimer()
      setNotice(message)
      timerRef.current = setTimeout(() => {
        timerRef.current = null
        setNotice(null)
      }, duration)
    },
    [clearTimer, duration]
  )

  const durationRef = useRef(duration)

  useEffect(() => {
    if (durationRef.current === duration) return
    durationRef.current = duration
    if (timerRef.current === null) return

    clearTimer()
    timerRef.current = setTimeout(() => {
      timerRef.current = null
      setNotice(null)
    }, duration)
  }, [clearTimer, duration])

  useEffect(() => clearTimer, [clearTimer])

  return { notice, flash }
}

export default useFlashNotice
