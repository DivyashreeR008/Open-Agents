import { useState, useEffect } from 'react'

const STORAGE_KEY = 'oa_ratings'
const VOTES_KEY = 'oa_rating_votes'
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

const saveVotes = (votes) => {
  try {
    localStorage.setItem(VOTES_KEY, JSON.stringify(votes))
  } catch (error) {
    console.error('Error saving rating votes to localStorage:', error)
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

  const rateAgent = (agentId, value) => {
    if (!agentId) return
    if (value !== 'up' && value !== 'down') return

    const currentRatings = getStoredRatings()
    const votes = getStoredVotes()
    const previous = votes[agentId] || null
    const agentData = currentRatings[agentId] || { up: 0, down: 0 }

    if (previous === value) {
      agentData[value] = Math.max(0, agentData[value] - 1)
      delete votes[agentId]
    } else {
      if (previous) {
        agentData[previous] = Math.max(0, agentData[previous] - 1)
      }
      agentData[value] += 1
      votes[agentId] = value
    }

    currentRatings[agentId] = agentData
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(currentRatings))
    } catch (error) {
      console.error('Error saving ratings to localStorage:', error)
      return
    }
    saveVotes(votes)

    listeners.forEach((listener) => listener())
  }

  const getUserVote = (agentId) => getStoredVotes()[agentId] || null

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

  return { rateAgent, getAgentRatingInfo, getUserVote, ratings }
}
