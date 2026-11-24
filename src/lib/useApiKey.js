import { useState, useEffect, useCallback } from 'react'
import { getGlobalKeys } from './globalKeys'
const STORAGE_PREFIX = 'oa_apikey_'
const EXPIRY_MS = 8 * 60 * 60 * 1000 // 8 hours
const PROVIDERS = ['openai', 'anthropic', 'gemini', 'openrouter']

/**
 * Safely retrieve an API key if it exists and hasn't expired.
 * Keys are wrapped with expiry timestamps to prevent indefinite persistence
 * even if storage backend is changed to localStorage.
 */
function getSafeApiKey(provider) {
  let raw
  try {
    raw = sessionStorage.getItem(STORAGE_PREFIX + provider)
  } catch {
    // Blocked storage must not prevent the key form from rendering.
    return null
  }
  if (!raw) return null
  try {
    const parsed = JSON.parse(raw)
    if (!parsed || typeof parsed !== 'object' || typeof parsed.key !== 'string' || !parsed.key) {
      try {
        sessionStorage.removeItem(STORAGE_PREFIX + provider)
      } catch {
        // Storage exceptions during cleanup must not bubble or alter fallback
      }
      return null
    }
    const expiresAt = Number(parsed.expiresAt)
    if (!Number.isFinite(expiresAt) || Date.now() > expiresAt) {
      try {
        sessionStorage.removeItem(STORAGE_PREFIX + provider)
      } catch {
        // Storage exceptions during cleanup must not bubble or alter fallback
      }
      return null
    }
    return parsed.key
  } catch {
    // Migrate legacy plaintext keys (no expiry)
    return raw
  }
}

/**
 * Store an API key with an expiry timestamp.
 */
function setSafeApiKey(provider, key) {
  try {
    if (key) {
      sessionStorage.setItem(
        STORAGE_PREFIX + provider,
        JSON.stringify({
          key,
          expiresAt: Date.now() + EXPIRY_MS,
        })
      )
    } else {
      sessionStorage.removeItem(STORAGE_PREFIX + provider)
    }
  } catch {
    // A blocked or full storage backend must not break typing or clearing a key.
  }
}

/**
 * Custom hook for managing API key state with optional sessionStorage persistence.
 */
export function useApiKey() {
  const [provider, setProvider] = useState('openai')
  const [apiKey, setApiKey] = useState('')
  const [saveForSession, setSaveForSession] = useState(false)

  // Load saved key on mount and provider change
  useEffect(() => {
    // 1. First check if a session key exists
    const sessionKey = getSafeApiKey(provider)

    if (sessionKey) {
      setApiKey(sessionKey)
      setSaveForSession(true)
    } else {
      // 2. Fall back to global keys only if no session key exists
      const globalKeys = getGlobalKeys()
      const savedGlobalKey = globalKeys[provider]

      if (savedGlobalKey) {
        setApiKey(savedGlobalKey)
        setSaveForSession(false) // Do NOT auto-check session box for global keys
      } else {
        setApiKey('')
        setSaveForSession(false)
      }
    }
  }, [provider])
  // Persist or clear from sessionStorage when saveForSession changes
  const updateApiKey = useCallback(
    (key) => {
      setApiKey(key)
      if (saveForSession && key) {
        setSafeApiKey(provider, key)
      } else if (!key) {
        setSafeApiKey(provider, null) // Ensures purging when input is cleared
      }
    },
    [provider, saveForSession]
  )

  const updateSaveForSession = useCallback(
    (save) => {
      setSaveForSession(save)
      if (save && apiKey) {
        setSafeApiKey(provider, apiKey)
      } else {
        setSafeApiKey(provider, null)
      }
    },
    [provider, apiKey]
  )

  return {
    provider,
    setProvider,
    apiKey,
    setApiKey: updateApiKey,
    saveForSession,
    setSaveForSession: updateSaveForSession,
  }
}

// Expose provider IDs, never secret values, to catalogue consumers.
export function getSavedProviders() {
  const globalKeys = getGlobalKeys()
  return PROVIDERS.filter((provider) =>
    (getSafeApiKey(provider) || globalKeys[provider] || '').trim()
  )
}

export function canRunWithSavedKeys(agent, providers) {
  return !agent.provider || agent.provider === 'any'
    ? providers.length > 0
    : providers.includes(agent.provider)
}

export function useSavedProviders() {
  const [providers, setProviders] = useState(getSavedProviders)
  useEffect(() => {
    const refresh = () => {
      const next = getSavedProviders()
      setProviders((previous) => (previous.join() === next.join() ? previous : next))
    }
    // Storage events do not fire for same-tab writes or key expiry.
    const timer = window.setInterval(refresh, 1000)
    window.addEventListener('focus', refresh)
    window.addEventListener('storage', refresh)
    return () => {
      window.clearInterval(timer)
      window.removeEventListener('focus', refresh)
      window.removeEventListener('storage', refresh)
    }
  }, [])
  return providers
}
