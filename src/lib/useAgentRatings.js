import { useState, useEffect } from 'react'

const STORAGE_KEY = 'oa_ratings'
const VOTES_KEY = 'oa_rating_votes'
const RUN_VOTES_KEY = 'oa_run_rating_votes'
const listeners = new Set()

function isPlainObject(value) {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value)
}

function sanitizeCount(value) {
  return Number.isFinite(value) && value > 0 ? Math.floor(value) : 0
}

function sanitizeRatings(value) {
  if (!isPlainObject(value)) return {}
  return Object.fromEntries(
    Object.entries(value)
      .filter(([agentId, counts]) => agentId && isPlainObject(counts))
      .map(([agentId, counts]) => [
        agentId,
        { up: sanitizeCount(counts.up), down: sanitizeCount(counts.down) },
      ])
  )
}

function sanitizeVotes(value) {
  if (!isPlainObject(value)) return {}
  return Object.fromEntries(
    Object.entries(value).filter(([agentId, vote]) => agentId && (vote === 'up' || vote === 'down'))
  )
}

function sanitizeRunVotes(value) {
  if (!isPlainObject(value)) return {}
  return Object.fromEntries(
    Object.entries(value).filter(
      ([runId, record]) =>
        runId &&
        isPlainObject(record) &&
        typeof record.agentId === 'string' &&
        record.agentId &&
        (record.value === 'up' || record.value === 'down')
    )
  )
}

const getStoredRatings = () => {
  if (typeof window === 'undefined') return {}
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    return saved ? sanitizeRatings(JSON.parse(saved)) : {}
  } catch (error) {
    console.error('Error parsing ratings from localStorage:', error)
    return {}
  }
}

const getStoredVotes = () => {
  if (typeof window === 'undefined') return {}
  try {
    const saved = localStorage.getItem(VOTES_KEY)
    return saved ? sanitizeVotes(JSON.parse(saved)) : {}
  } catch {
    return {}
  }
}

const getStoredRunVotes = () => {
  if (typeof window === 'undefined') return {}
  try {
    const saved = localStorage.getItem(RUN_VOTES_KEY)
    return saved ? sanitizeRunVotes(JSON.parse(saved)) : {}
  } catch {
    return {}
  }
}

const saveVotes = (votes) => {
  try {
    localStorage.setItem(VOTES_KEY, JSON.stringify(votes))
    return true
  } catch (error) {
    console.error('Error saving rating votes to localStorage:', error)
    return false
  }
}

const saveRunVotes = (votes) => {
  try {
    localStorage.setItem(RUN_VOTES_KEY, JSON.stringify(votes))
    return true
  } catch (error) {
    console.error('Error saving run rating votes to localStorage:', error)
    return false
  }
}

export function useAgentRatings() {
  const [ratings, setRatings] = useState(() => getStoredRatings())

  useEffect(() => {
    const handleChange = () => {
      setRatings(getStoredRatings())
    }

    listeners.add(handleChange)
    window.addEventListener('storage', handleChange)

    return () => {
      listeners.delete(handleChange)
      window.removeEventListener('storage', handleChange)
    }
  }, [])

  const applyVote = (agentId, value, previous, runId) => {
    const currentRatings = getStoredRatings()
    const votes = getStoredVotes()
    const runVotes = getStoredRunVotes()
    const agentData = currentRatings[agentId] || { up: 0, down: 0 }

    // Repeating the same choice confirms it. It must not remove a vote or add
    // a second point for a run the user already rated.
    if (previous === value) {
      return { ok: true, value, unchanged: true }
    }

    if (previous) {
      agentData[previous] = Math.max(0, agentData[previous] - 1)
    }
    agentData[value] += 1
    currentRatings[agentId] = agentData
    votes[agentId] = value

    if (runId) {
      runVotes[runId] = { agentId, value }
    }

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(currentRatings))
    } catch (error) {
      console.error('Error saving ratings to localStorage:', error)
      return { ok: false, value, error: 'Ratings could not be saved.' }
    }

    if (!saveVotes(votes) || (runId && !saveRunVotes(runVotes))) {
      listeners.forEach((listener) => listener())
      return { ok: false, value, error: 'Rating votes could not be saved.' }
    }

    listeners.forEach((listener) => listener())
    return { ok: true, value, unchanged: false }
  }

  const rateAgent = (agentId, value, runId = null) => {
    if (!agentId) return { ok: false, error: 'An agent is required.' }
    if (value !== 'up' && value !== 'down') {
      return { ok: false, error: 'Choose a valid rating.' }
    }

    if (runId) {
      const previousRunVote = getStoredRunVotes()[runId]?.value || null
      return applyVote(agentId, value, previousRunVote, runId)
    }

    return applyVote(agentId, value, getStoredVotes()[agentId] || null, null)
  }

  const getUserVote = (agentId) => getStoredVotes()[agentId] || null

  const getRunVote = (runId) => {
    if (!runId) return null
    return getStoredRunVotes()[runId]?.value || null
  }

  const getAgentRatingInfo = (agentId) => {
    const agentData = ratings[agentId] || { up: 0, down: 0 }
    const total = agentData.up + agentData.down
    const percentage = total > 0 ? Math.round((agentData.up / total) * 100) : 0

    return {
      up: agentData.up,
      down: agentData.down,
      total,
      percentage,
    }
  }

  return { rateAgent, getAgentRatingInfo, getUserVote, getRunVote, ratings }
}
