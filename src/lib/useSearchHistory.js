import { useCallback, useEffect, useState } from 'react'

const STORAGE_KEY = 'oa_search_history_v1'
const UPDATE_EVENT = 'oa_search_history_update'
const MAX_SEARCHES = 10
const MAX_QUERY = 300

function normalize(value) {
  if (!value || !['catalogue', 'palette'].includes(value.surface)) return null
  if (typeof value.query !== 'string') return null
  const query = value.query.trim()
  if (!query || query.length > MAX_QUERY) return null
  const params = new URLSearchParams()
  if (value.surface === 'catalogue') {
    const input = new URLSearchParams(typeof value.scope === 'string' ? value.scope : '')
    for (const field of ['category', 'provider', 'collection', 'ready']) {
      const text = input.get(field)
      if (text && text.length <= 200) params.set(field, text)
    }
    params.set('q', query)
    params.sort()
  }
  const scope = params.toString()
  const view = value.surface === 'catalogue' && value.view === 'grid' ? 'grid' : 'index'
  // Scope identity is independent of URL parameter order and query letter case.
  const identity = new URLSearchParams(scope)
  if (value.surface === 'catalogue') identity.set('q', query.toLowerCase())
  const id = JSON.stringify([value.surface, query.toLowerCase(), identity.toString(), view])
  return { id, surface: value.surface, query, scope, view }
}

function readHistory() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return { entries: [], error: '' }
    const value = JSON.parse(raw)
    if (!Array.isArray(value)) throw new Error('Invalid history')
    const seen = new Set()
    const entries = value
      .map(normalize)
      .filter((entry) => entry && !seen.has(entry.id) && seen.add(entry.id))
      .slice(0, MAX_SEARCHES)
    return { entries, error: '' }
  } catch {
    return { entries: [], error: 'Search history could not be read. Clear it to start again.' }
  }
}

export function useSearchHistory() {
  const [state, setState] = useState(readHistory)
  useEffect(() => {
    const sync = () => setState(readHistory())
    const storage = (event) => {
      if (event.key === STORAGE_KEY || event.key === null) sync()
    }
    window.addEventListener(UPDATE_EVENT, sync)
    window.addEventListener('storage', storage)
    return () => {
      window.removeEventListener(UPDATE_EVENT, sync)
      window.removeEventListener('storage', storage)
    }
  }, [])

  const change = useCallback((transform) => {
    const current = readHistory()
    if (current.error) {
      setState(current)
      return false
    }
    const entries = transform(current.entries)
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(entries))
      setState({ entries, error: '' })
      window.dispatchEvent(new Event(UPDATE_EVENT))
      return true
    } catch {
      setState({ entries: current.entries, error: 'Changes to search history could not be saved.' })
      return false
    }
  }, [])

  const remember = useCallback(
    (value) => {
      const entry = normalize(value)
      if (!entry) {
        setState((current) => ({
          ...current,
          error: 'Enter a search of 1–300 characters to remember it.',
        }))
        return false
      }
      return change((entries) =>
        [entry, ...entries.filter((e) => e.id !== entry.id)].slice(0, MAX_SEARCHES)
      )
    },
    [change]
  )

  const remove = useCallback(
    (id) => change((entries) => entries.filter((e) => e.id !== id)),
    [change]
  )
  const clear = useCallback(() => {
    try {
      localStorage.removeItem(STORAGE_KEY)
      setState({ entries: [], error: '' })
      window.dispatchEvent(new Event(UPDATE_EVENT))
      return true
    } catch {
      setState((current) => ({ ...current, error: 'Search history could not be cleared.' }))
      return false
    }
  }, [])
  return { ...state, remember, remove, clear }
}
