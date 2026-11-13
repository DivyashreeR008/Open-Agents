import { useState, useEffect, useCallback } from 'react'
import { getGlobalKeys } from './globalKeys'

const STORAGE_PREFIX = 'oa_apikey_'
const EXPIRY_NOTICE_PREFIX = 'oa_apikey_expiry_notice_'
const EXPIRY_MS = 8 * 60 * 60 * 1000 // 8 hours

const PROVIDER_LABELS = {
  openai: 'OpenAI',
  anthropic: 'Anthropic',
  gemini: 'Gemini',
  openrouter: 'OpenRouter',
}

const KEY_FORMAT_RULES = {
  openai: { pattern: /^sk-(?!ant-|or-)/i, hint: 'sk-' },
  anthropic: { pattern: /^sk-ant/i, hint: 'sk-ant-' },
  gemini: { pattern: /^AIza/i, hint: 'AIza' },
  openrouter: { pattern: /^sk-or/i, hint: 'sk-or-' },
}

/**
 * Flag an obvious provider mismatch before a key is saved or shown as valid.
 * The checks only cover published prefixes, so unusual but valid keys can
 * still be corrected or replaced by the user.
 */
export function validateApiKeyFormat(provider, key) {
  const trimmed = typeof key === 'string' ? key.trim() : ''
  if (!trimmed) return ''
  const rule = KEY_FORMAT_RULES[provider]
  if (!rule || rule.pattern.test(trimmed)) return ''

  const matchingProvider = Object.entries(KEY_FORMAT_RULES).find(
    ([candidate, candidateRule]) => candidate !== provider && candidateRule.pattern.test(trimmed)
  )

  if (matchingProvider) {
    const [candidate] = matchingProvider
    return `This looks like an ${PROVIDER_LABELS[candidate]} key. Select ${PROVIDER_LABELS[candidate]} or enter an ${PROVIDER_LABELS[provider]} key.`
  }

  return `This does not look like an ${PROVIDER_LABELS[provider]} key. Expected a key starting with ${rule.hint}.`
}

function removeItemSafe(key) {
  try {
    sessionStorage.removeItem(key)
  } catch {
    // Storage exceptions during cleanup must not alter the fallback path.
  }
}

function readRawSessionRecord(provider) {
  let raw
  try {
    raw = sessionStorage.getItem(STORAGE_PREFIX + provider)
  } catch {
    return null
  }
  if (!raw) return null

  try {
    const parsed = JSON.parse(raw)
    if (!parsed || typeof parsed !== 'object' || typeof parsed.key !== 'string' || !parsed.key) {
      removeItemSafe(STORAGE_PREFIX + provider)
      return null
    }
    const expiresAt = Number(parsed.expiresAt)
    if (!Number.isFinite(expiresAt) || expiresAt <= 0) {
      removeItemSafe(STORAGE_PREFIX + provider)
      return null
    }
    return { key: parsed.key, expiresAt }
  } catch {
    // Legacy plaintext keys are migrated on the next write.
    return { key: raw, expiresAt: null }
  }
}

function writeExpiryNotice(provider, expiresAt) {
  if (!Number.isFinite(expiresAt)) return
  try {
    sessionStorage.setItem(EXPIRY_NOTICE_PREFIX + provider, String(expiresAt))
  } catch {
    // A blocked storage backend must not break key loading.
  }
}

export function readSessionKeyExpiryInfo(provider) {
  const record = readRawSessionRecord(provider)
  if (record?.expiresAt) {
    return { expiresAt: record.expiresAt, expired: Date.now() > record.expiresAt }
  }

  try {
    const notice = Number(sessionStorage.getItem(EXPIRY_NOTICE_PREFIX + provider))
    if (Number.isFinite(notice) && notice > 0) {
      return { expiresAt: notice, expired: true }
    }
  } catch {
    // Ignore unavailable storage and fall through to no notice.
  }

  return null
}

/**
 * Safely retrieve a session key if it exists and has not expired. Expired
 * records are removed, but a non-secret expiry marker is retained so the
 * interface can explain why the saved key disappeared.
 */
function getSafeApiKey(provider) {
  const record = readRawSessionRecord(provider)
  if (!record) return null

  if (record.expiresAt && Date.now() > record.expiresAt) {
    removeItemSafe(STORAGE_PREFIX + provider)
    writeExpiryNotice(provider, record.expiresAt)
    return null
  }

  return record.key
}

/**
 * Store an API key with an expiry timestamp and return the expiry, or null
 * when storage is unavailable.
 */
function setSafeApiKey(provider, key) {
  try {
    removeItemSafe(EXPIRY_NOTICE_PREFIX + provider)
    if (key) {
      const expiresAt = Date.now() + EXPIRY_MS
      sessionStorage.setItem(STORAGE_PREFIX + provider, JSON.stringify({ key, expiresAt }))
      return expiresAt
    }
    sessionStorage.removeItem(STORAGE_PREFIX + provider)
    return null
  } catch {
    return null
  }
}

/**
 * Custom hook for managing API key state with optional sessionStorage persistence.
 */
export function useApiKey() {
  const [provider, setProvider] = useState('openai')
  const [apiKey, setApiKeyState] = useState('')
  const [saveForSession, setSaveForSessionState] = useState(false)
  const [sessionExpiresAt, setSessionExpiresAt] = useState(null)
  const [sessionExpired, setSessionExpired] = useState(false)

  // Load saved key on mount and provider change.
  useEffect(() => {
    const sessionKey = getSafeApiKey(provider)
    const expiryInfo = readSessionKeyExpiryInfo(provider)
    setSessionExpiresAt(expiryInfo?.expiresAt ?? null)
    setSessionExpired(Boolean(expiryInfo?.expired))

    if (sessionKey) {
      setApiKeyState(sessionKey)
      setSaveForSessionState(true)
    } else {
      const globalKeys = getGlobalKeys()
      const savedGlobalKey = globalKeys[provider]

      if (savedGlobalKey) {
        setApiKeyState(savedGlobalKey)
        setSaveForSessionState(false) // Do NOT auto-check session box for global keys
      } else {
        setApiKeyState('')
        setSaveForSessionState(false)
      }
    }
  }, [provider])

  const updateApiKey = useCallback(
    (key) => {
      setApiKeyState(key)
      setSessionExpired(false)

      if (validateApiKeyFormat(provider, key)) {
        setSafeApiKey(provider, null)
        setSessionExpiresAt(null)
        setSaveForSessionState(false)
        return
      }

      if (saveForSession && key) {
        setSessionExpiresAt(setSafeApiKey(provider, key))
      } else if (!key) {
        setSafeApiKey(provider, null)
        setSessionExpiresAt(null)
      }
    },
    [provider, saveForSession]
  )

  const updateSaveForSession = useCallback(
    (save) => {
      if (save && !validateApiKeyFormat(provider, apiKey)) {
        setSaveForSessionState(true)
        setSessionExpiresAt(apiKey ? setSafeApiKey(provider, apiKey) : null)
        setSessionExpired(false)
      } else {
        setSaveForSessionState(false)
        setSafeApiKey(provider, null)
        setSessionExpiresAt(null)
        setSessionExpired(false)
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
    sessionExpiresAt,
    sessionExpired,
    keyError: validateApiKeyFormat(provider, apiKey),
  }
}
