import { useState, useEffect, useCallback } from 'react'
import * as supabaseModule from './supabase'

const { supabase } = supabaseModule

const PRICING = {
  'gpt-4o': { input: 0.005, output: 0.015 },
  'claude-sonnet': { input: 0.003, output: 0.015 },
}

export const AGENT_RUN_PAGE_SIZE = 250

const METRICS_UNAVAILABLE_MESSAGE =
  'Run history requires the optional Supabase backend. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY, then retry.'

function backendIsConfigured() {
  // Lightweight test doubles may only provide the client. Fall back to the
  // configured path when the optional flag is absent.
  try {
    return supabaseModule.isSupabaseConfigured !== false
  } catch {
    return true
  }
}

function normalizeError(error) {
  if (typeof error === 'string' && error.trim()) return { message: error }
  if (error?.message) return { ...error, message: error.message }
  return { message: 'Run history could not be loaded. Check your connection and try again.' }
}

export function estimateCost(model, inputTokens, outputTokens) {
  const p =
    typeof model === 'string' && Object.prototype.hasOwnProperty.call(PRICING, model)
      ? PRICING[model]
      : null
  if (!p) return null // unknown model — don't silently record as $0
  return (inputTokens / 1000) * p.input + (outputTokens / 1000) * p.output
}

export async function logAgentRun({
  agentRunId,
  model,
  inputTokens,
  outputTokens,
  status,
  durationMs,
}) {
  if (!backendIsConfigured()) {
    return {
      data: null,
      error: { message: 'Agent run logging requires Supabase configuration.' },
    }
  }

  const cost = estimateCost(model, inputTokens, outputTokens)
  try {
    return await supabase.from('agent_runs').insert({
      agent_run_id: agentRunId,
      model,
      input_tokens: inputTokens,
      output_tokens: outputTokens,
      estimated_cost_usd: cost, // null when pricing is unknown, not 0
      status,
      duration_ms: durationMs,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    return { data: null, error: normalizeError(error) }
  }
}

export function useAgentRunMetrics(rangeDays = 30) {
  const [runs, setRuns] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchRuns = useCallback(async () => {
    setLoading(true)
    setError(null)

    if (!backendIsConfigured()) {
      setRuns([])
      setError({ message: METRICS_UNAVAILABLE_MESSAGE })
      setLoading(false)
      return
    }

    try {
      const since = new Date(Date.now() - rangeDays * 24 * 60 * 60 * 1000).toISOString()
      const allRuns = []
      let offset = 0

      while (true) {
        const query = supabase
          .from('agent_runs')
          .select('*')
          .gte('timestamp', since)
          .order('timestamp', { ascending: false })

        // Support older lightweight test doubles that expose the ordered
        // query as a thenable without PostgREST's range builder.
        const response =
          typeof query?.range === 'function'
            ? await query.range(offset, offset + AGENT_RUN_PAGE_SIZE - 1)
            : await query

        if (response?.error) {
          setError(normalizeError(response.error))
          return
        }

        const page = Array.isArray(response?.data) ? response.data : []
        allRuns.push(...page)
        if (page.length < AGENT_RUN_PAGE_SIZE) break
        offset += AGENT_RUN_PAGE_SIZE
      }

      setRuns(allRuns)
    } catch (err) {
      setError(normalizeError(err))
    } finally {
      setLoading(false)
    }
  }, [rangeDays])

  useEffect(() => {
    fetchRuns()
  }, [fetchRuns])

  const totalRuns = runs.length
  const successCount = runs.filter((r) => r.status === 'success').length
  const successRate = totalRuns ? (successCount / totalRuns) * 100 : 0
  const totalTokens = runs.reduce(
    (sum, r) => sum + (r.input_tokens || 0) + (r.output_tokens || 0),
    0
  )
  const totalCostUSD = runs.reduce(
    (sum, r) => (r.estimated_cost_usd == null ? sum : sum + r.estimated_cost_usd),
    0
  )
  const unknownCostRuns = runs.filter((r) => r.estimated_cost_usd == null).length
  const avgDurationMs = totalRuns
    ? runs.reduce((sum, r) => sum + (r.duration_ms || 0), 0) / totalRuns
    : 0
  return {
    runs,
    loading,
    error,
    errorMessage: error?.message || '',
    isEmpty: !loading && !error && totalRuns === 0,
    totalRuns,
    successRate,
    totalTokens,
    totalCostUSD,
    unknownCostRuns,
    avgDurationMs,
    refetch: fetchRuns,
  }
}
