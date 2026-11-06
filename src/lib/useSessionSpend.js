import { useState, useCallback, useEffect } from 'react'
import { estimateInputCost, estimateOutputCost, getPricing } from './modelPricing'

const STORAGE_KEY = 'oa_session_spend'
const MAX_RUNS = 200

function toNonNegativeNumber(value) {
  const numeric = typeof value === 'number' ? value : Number(value)
  return Number.isFinite(numeric) && numeric >= 0 ? numeric : 0
}

function normalizeRun(run) {
  if (!run || typeof run !== 'object' || Array.isArray(run)) return null

  const inputTokens = toNonNegativeNumber(run.inputTokens)
  const outputTokens = toNonNegativeNumber(run.outputTokens)
  const inputCost = toNonNegativeNumber(run.inputCost)
  const outputCost = toNonNegativeNumber(run.outputCost)
  const storedTotal = toNonNegativeNumber(run.totalCost)
  const componentTotal = inputCost + outputCost

  return {
    ...run,
    inputTokens,
    outputTokens,
    inputCost,
    outputCost,
    totalCost: componentTotal > 0 ? componentTotal : storedTotal,
  }
}

function loadSession() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const data = JSON.parse(raw)
      if (data && typeof data === 'object' && Array.isArray(data.runs)) {
        const runs = data.runs
          .map(normalizeRun)
          .filter(Boolean)
          .slice(0, MAX_RUNS)
        // Recompute rather than trusting a stored total, which may be stale,
        // non-numeric, or from a record that was written by an older build.
        const totalSpend = runs.reduce((sum, run) => sum + run.totalCost, 0)
        return { runs, totalSpend }
      }
    }
  } catch {}
  return { runs: [], totalSpend: 0 }
}

function saveSession(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  } catch {}
}

export function useSessionSpend() {
  const [sessionData, setSessionData] = useState(() => loadSession())

  useEffect(() => {
    const handleStorage = (e) => {
      if (e.key === STORAGE_KEY) {
        setSessionData(loadSession())
      }
    }
    window.addEventListener('storage', handleStorage)
    return () => window.removeEventListener('storage', handleStorage)
  }, [])

  const addRun = useCallback(({ model, inputTokens, outputTokens, inputCost, outputCost }) => {
    const safeInputTokens = toNonNegativeNumber(inputTokens)
    const safeOutputTokens = toNonNegativeNumber(outputTokens)
    const explicitInput = Number.isFinite(inputCost) && inputCost >= 0 ? inputCost : null
    const explicitOutput = Number.isFinite(outputCost) && outputCost >= 0 ? outputCost : null

    let inputC = explicitInput
    let outputC = explicitOutput

    if (inputC == null && safeInputTokens > 0 && model) {
      inputC = estimateInputCost(model, safeInputTokens) || 0
    }
    if (outputC == null && safeOutputTokens > 0 && model) {
      outputC = estimateOutputCost(model, safeOutputTokens) || 0
    }

    const runCost = (inputC || 0) + (outputC || 0)
    const run = {
      model,
      inputTokens: safeInputTokens,
      outputTokens: safeOutputTokens,
      inputCost: inputC || 0,
      outputCost: outputC || 0,
      totalCost: runCost,
      timestamp: Date.now(),
    }

    // Merge against the current on-disk value, not stale in-memory state,
    // so a concurrent write (another tab, or two runs completing close
    // together) isn't silently discarded by the last write winning.
    const prev = loadSession()
    const runs = [run, ...prev.runs].slice(0, MAX_RUNS)
    const totalSpend = runs.reduce((sum, r) => sum + r.totalCost, 0)
    const newData = { runs, totalSpend }
    saveSession(newData)
    setSessionData(newData)
  }, [])

  const clearSession = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY)
    setSessionData({ runs: [], totalSpend: 0 })
  }, [])

  return {
    runs: sessionData.runs,
    totalSpend: sessionData.totalSpend,
    addRun,
    clearSession,
  }
}
