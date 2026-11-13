import { useState, useCallback, useEffect } from 'react'
import { stripCredentialFields } from './secretPolicy'
import {
  clearRecentAgents,
  recordRecentAgent,
  replaceRecentAgentsFromHistory,
} from './recentAgentsIndex'

const STORAGE_KEY = 'OpenAgents_history'

export const HISTORY_LIMITS = Object.freeze({
  items: 10,
  outputCharacters: 20000,
  totalCharacters: 200000,
})

const OUTPUT_TRUNCATION_SUFFIX =
  '\n\n[Output truncated in history to keep it within the local storage limit.]'

function serializedLength(history) {
  return JSON.stringify(history).length
}

function trimRun(run) {
  if (typeof run.output !== 'string' || run.output.length <= HISTORY_LIMITS.outputCharacters) {
    return run
  }
  return {
    ...run,
    output: `${run.output.slice(0, HISTORY_LIMITS.outputCharacters)}${OUTPUT_TRUNCATION_SUFFIX}`,
  }
}

function boundHistory(history) {
  const bounded = history.slice(0, HISTORY_LIMITS.items).map(trimRun)
  // Keep at least the newest run even if its inputs are unusually large. The
  // output cap above is the normal way a single entry stays small.
  while (bounded.length > 1 && serializedLength(bounded) > HISTORY_LIMITS.totalCharacters) {
    bounded.pop()
  }
  return bounded
}

function isQuotaError(error) {
  return error?.name === 'QuotaExceededError'
}

function loadHistory() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (!saved) return []
    const parsed = JSON.parse(saved)
    if (!Array.isArray(parsed)) return []
    // Older builds and hand-edited storage can contain nulls or primitives.
    // The recent-runs list maps over every entry, so keep only records that
    // can safely be rendered and deleted.
    return boundHistory(
      parsed.filter((entry) => entry && typeof entry === 'object' && !Array.isArray(entry))
    )
  } catch (error) {
    console.error('Error loading history from localStorage:', error)
    return []
  }
}

function persistHistory(history) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(history))
    return { ok: true, history }
  } catch (error) {
    if (isQuotaError(error)) {
      console.error('LocalStorage quota exceeded. History was not saved.')
    } else {
      console.error('Error saving history to localStorage:', error)
    }
    return { ok: false, error }
  }
}

/**
 * Custom hook to manage agent execution history in localStorage.
 *
 * Footprint: at most 10 runs, 20,000 output characters per run (plus a short
 * truncation marker), with older runs removed to stay near a 200,000
 * serialized-character budget. Long outputs are truncated in history and the
 * recent-run panel says so.
 *
 * Writes are computed against the freshest localStorage value (re-read at
 * write time) rather than only the in-memory React state, and this tab's
 * state is resynced whenever another tab writes to the same key. Without
 * this, two tabs (or two updates racing close together) each compute a
 * new value from their own possibly-stale in-memory copy and the last
 * write silently overwrites the other's runs.
 *
 * A run is added to React state only after the storage write succeeds. If the
 * write fails, saveRun returns a failure result so the caller can show a
 * visible warning instead of presenting a phantom run that disappears on
 * reload.
 */
export const useHistory = () => {
  const [history, setHistory] = useState(() => loadHistory())

  // Pick up writes made by other tabs/windows to the same key.
  useEffect(() => {
    const handleStorage = (e) => {
      // A null key means another tab called localStorage.clear().
      if (e.key === STORAGE_KEY || e.key === null) {
        setHistory(loadHistory())
      }
    }
    window.addEventListener('storage', handleStorage)
    return () => window.removeEventListener('storage', handleStorage)
  }, [])

  /**
   * Save a new run to history.
   * @param {Object} run - The run data (agentId, agentName, inputs, output, provider).
   *   Pass runId to reuse the same id in analytics so the run is not counted twice.
   * @returns {{ok: boolean, pruned?: boolean, error?: Error, reason?: 'quota'|'storage'}}
   */
  const saveRun = useCallback(({ runId, ...run }) => {
    const timestamp = Date.now()
    const newRun = {
      ...stripCredentialFields(run),
      id: runId || `${run.agentId}_${timestamp}`,
      timestamp,
    }

    // Merge against the current on-disk value, not stale in-memory state,
    // so a concurrent write (another tab, or a near-simultaneous call)
    // isn't silently discarded.
    const existing = loadHistory()
    const candidate = boundHistory([newRun, ...existing])
    const budgetPruned = candidate.length < Math.min(existing.length + 1, HISTORY_LIMITS.items)

    let result = persistHistory(candidate)

    if (!result.ok && isQuotaError(result.error)) {
      // Storage is tight. Keep the newest run rather than rejecting it just
      // because older entries no longer fit.
      const fallback = boundHistory([newRun])
      const fallbackResult = persistHistory(fallback)
      if (fallbackResult.ok) {
        result = fallbackResult
        setHistory(fallback)
        recordRecentAgent(newRun)
        return { ok: true, pruned: fallback.length < candidate.length }
      }
      result = fallbackResult
    }

    if (result.ok) {
      setHistory(candidate)
      recordRecentAgent(newRun)
      return { ok: true, pruned: budgetPruned }
    }

    // Leave React state unchanged. The run is not shown because it is not
    // stored, and the previous on-disk history is still intact.
    return {
      ok: false,
      error: result.error,
      reason: isQuotaError(result.error) ? 'quota' : 'storage',
    }
  }, [])

  /**
   * Delete a specific run from history.
   * @param {string} runId - The unique ID of the run to delete.
   * @returns {{ok: boolean, error?: Error}}
   */
  const deleteRun = useCallback((runId) => {
    const updatedHistory = loadHistory().filter((run) => run.id !== runId)
    const result = persistHistory(updatedHistory)
    if (result.ok) {
      setHistory(updatedHistory)
      replaceRecentAgentsFromHistory(updatedHistory)
    }
    return result
  }, [])

  /**
   * Clear all history from state and localStorage.
   * @returns {{ok: boolean, error?: Error}}
   */
  const clearHistory = useCallback(() => {
    const result = persistHistory([])
    if (result.ok) {
      setHistory([])
      clearRecentAgents()
    }
    return result
  }, [])

  /**
   * Get the current history (optional wrapper, history state is already returned).
   */
  const getHistory = useCallback(() => history, [history])

  return {
    history,
    saveRun,
    deleteRun,
    clearHistory,
    getHistory,
  }
}

export default useHistory
