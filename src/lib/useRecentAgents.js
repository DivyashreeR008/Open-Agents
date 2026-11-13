/**
 * useRecentAgents — tracks the last N distinct agents the user has run.
 *
 * Reads the small index maintained by useHistory instead of parsing the full
 * run history (which contains prompts and outputs) on every page entry.
 */
import { useState, useEffect, useCallback } from 'react'
import {
  HISTORY_KEY,
  RECENT_AGENTS_KEY,
  clearRecentAgents,
  loadRecentAgents,
  replaceRecentAgentsFromHistory,
} from './recentAgentsIndex'

function rebuildFromHistory() {
  try {
    const raw = localStorage.getItem(HISTORY_KEY)
    if (!raw) {
      clearRecentAgents()
      return []
    }
    return replaceRecentAgentsFromHistory(JSON.parse(raw))
  } catch {
    clearRecentAgents()
    return []
  }
}

export function useRecentAgents() {
  const [recentAgents, setRecentAgents] = useState(loadRecentAgents)

  // The index is the fast path. Rebuild only when an older tab writes the
  // history key directly and the index has not caught up yet.
  useEffect(() => {
    const handleStorage = (e) => {
      if (e.key === RECENT_AGENTS_KEY) {
        setRecentAgents(loadRecentAgents())
      } else if (e.key === HISTORY_KEY) {
        setRecentAgents(rebuildFromHistory())
      }
    }
    window.addEventListener('storage', handleStorage)
    return () => window.removeEventListener('storage', handleStorage)
  }, [])

  const clearHistory = useCallback(() => {
    try {
      localStorage.removeItem(HISTORY_KEY)
    } catch {
      // storage unavailable — reset in-memory state regardless
    }
    clearRecentAgents()
    setRecentAgents([])
  }, [])

  return { recentAgents, clearHistory }
}
