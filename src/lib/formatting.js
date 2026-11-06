import { useEffect, useState } from 'react'

const MINUTE = 60 * 1000
const HOUR = 60 * MINUTE
const DAY = 24 * HOUR

function timestampValue(timestamp) {
  if (timestamp == null || timestamp === '') return NaN
  if (typeof timestamp === 'number') return timestamp
  if (timestamp instanceof Date) return timestamp.getTime()
  return new Date(timestamp).getTime()
}

/**
 * Short, human-readable age for a timestamp. Invalid values return "unknown"
 * rather than a misleading "just now", and future timestamps are clamped so a
 * clock skew never produces a negative age.
 *
 * @param {number|string|Date} timestamp
 * @param {number} [now]
 * @returns {string}
 */
export function formatRelativeTime(timestamp, now = Date.now()) {
  const value = timestampValue(timestamp)
  if (!Number.isFinite(value)) return 'unknown'

  const elapsed = Math.max(0, now - value)
  if (elapsed < MINUTE) return 'just now'
  if (elapsed < HOUR) return `${Math.floor(elapsed / MINUTE)}m ago`
  if (elapsed < DAY) return `${Math.floor(elapsed / HOUR)}h ago`
  return `${Math.floor(elapsed / DAY)}d ago`
}

/**
 * Full local timestamp for a tooltip, so the relative label is never the only
 * record of when something happened.
 *
 * @param {number|string|Date} timestamp
 * @returns {string}
 */
export function formatExactTime(timestamp) {
  const value = timestampValue(timestamp)
  if (!Number.isFinite(value)) return ''
  return new Date(value).toLocaleString()
}

/**
 * Format a USD amount so a nonzero charge never renders as zero. Precision
 * increases as the amount shrinks, and every surface uses the same rule.
 *
 * @param {number} value
 * @param {{ symbol?: boolean }} [options]
 * @returns {string}
 */
export function formatCost(value, { symbol = true } = {}) {
  if (value == null || typeof value !== 'number' || !Number.isFinite(value) || value < 0) {
    return '\u2014'
  }
  if (value === 0) return `${symbol ? '$' : ''}0.00`

  const prefix = symbol ? '$' : ''
  if (value >= 1) return `${prefix}${value.toFixed(2)}`

  const digits = value >= 0.01 ? 3 : 4
  if (value >= 0.0001) {
    const amount = value.toFixed(digits).replace(/0+$/, '').replace(/\.$/, '')
    return `${prefix}${amount}`
  }
  return `${prefix}<0.0001`
}

/**
 * Current time, refreshed on an interval so relative labels age while the page
 * stays open. The interval is cleaned up on unmount.
 *
 * @param {number} [intervalMs]
 * @returns {number}
 */
export function useNow(intervalMs = 30_000) {
  const [now, setNow] = useState(() => Date.now())

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), intervalMs)
    return () => clearInterval(id)
  }, [intervalMs])

  return now
}
