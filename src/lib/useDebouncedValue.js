import { useEffect, useState } from 'react'

/**
 * Returns a copy of `value` that only changes after the value has stayed
 * unchanged for `delay` milliseconds.
 *
 * The initial value is returned immediately so URL-backed filters render
 * correctly on the first pass instead of flashing an unfiltered list.
 */
export function useDebouncedValue(value, delay = 250) {
  const [debouncedValue, setDebouncedValue] = useState(value)

  useEffect(() => {
    if (Object.is(value, debouncedValue)) return undefined

    const timer = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => clearTimeout(timer)
  }, [debouncedValue, delay, value])

  return debouncedValue
}
