/**
 * globalKeys.js — manages saved API keys for the current browser session.
 *
 * API keys are secrets, so they live in sessionStorage (cleared when the tab
 * closes) wrapped with an 8-hour expiry — matching the policy already used in
 * useApiKey.js. They are NOT written to localStorage, which would persist them
 * indefinitely in plaintext and defeat that policy. The non-sensitive
 * default-provider preference stays in localStorage.
 *
 * Note: sessionStorage is still readable by injected scripts, so it does not by
 * itself protect keys from XSS — the 8-hour expiry only bounds the exposure
 * window. Stronger protection would require a server-side session or an
 * HttpOnly cookie for the secret material.
 *
 * Session key names:
 *   OpenAgents_openai_key
 *   OpenAgents_anthropic_key
 *   OpenAgents_gemini_key
 *   OpenAgents_openrouter_key
 * Preference name (localStorage):
 *   OpenAgents_default_provider
 */

const KEYS = {
  openai: 'OpenAgents_openai_key',
  anthropic: 'OpenAgents_anthropic_key',
  gemini: 'OpenAgents_gemini_key',
  openrouter: 'OpenAgents_openrouter_key',
}
const DEFAULT_PROVIDER_KEY = 'OpenAgents_default_provider'
const EXPIRY_MS = 8 * 60 * 60 * 1000 // 8 hours, matching useApiKey.js

/**
 * Read a secret from sessionStorage, honoring its expiry. Also removes any
 * legacy plaintext key an older version may have left in localStorage.
 */
function readSecret(storageKey) {
  // Migrate a legacy plaintext key an older version left in localStorage:
  // move its value into sessionStorage (with a fresh expiry) so the user does
  // not lose it, then remove the insecure localStorage copy.
  const legacy = localStorage.getItem(storageKey)
  if (legacy !== null) {
    localStorage.removeItem(storageKey)
    if (legacy !== '' && sessionStorage.getItem(storageKey) === null) {
      writeSecret(storageKey, legacy)
    }
  }

  const raw = sessionStorage.getItem(storageKey)
  if (!raw) return ''
  try {
    const { key, expiresAt } = JSON.parse(raw)
    if (Date.now() > expiresAt) {
      sessionStorage.removeItem(storageKey)
      return ''
    }
    return key || ''
  } catch {
    return raw // tolerate a legacy plaintext session value
  }
}

/**
 * Store a secret in sessionStorage with a fresh 8-hour expiry.
 */
function writeSecret(storageKey, value) {
  sessionStorage.setItem(
    storageKey,
    JSON.stringify({
      key: value,
      expiresAt: Date.now() + EXPIRY_MS,
    })
  )
}

/**
 * Read all globally saved keys.
 * @returns {{ openai: string, anthropic: string, gemini: string, openrouter: string, defaultProvider: string }}
 */
export function getGlobalKeys() {
  const keys = {
    openai: readSecret(KEYS.openai),
    anthropic: readSecret(KEYS.anthropic),
    gemini: readSecret(KEYS.gemini),
    openrouter: readSecret(KEYS.openrouter),
  }

  let defaultProvider = localStorage.getItem(DEFAULT_PROVIDER_KEY) || ''
  // A default is only meaningful while its provider still has a live key.
  // Expired or manually removed keys must not leave a preference that points
  // at a credential no run can use.
  if (defaultProvider && !keys[defaultProvider]?.trim()) {
    localStorage.removeItem(DEFAULT_PROVIDER_KEY)
    defaultProvider = ''
  }

  return { ...keys, defaultProvider }
}

/**
 * Save keys. Only saves non-empty values — passing an empty string does NOT
 * overwrite an existing saved key. To explicitly clear a key use clearGlobalKey(provider).
 *
 * An empty `defaultProvider` clears the preference instead of being ignored,
 * which is what the empty option in Settings asks for. The return value lets
 * the caller report what actually happened instead of assuming every field
 * was stored.
 *
 * @param {{ openai?: string, anthropic?: string, gemini?: string, openrouter?: string, defaultProvider?: string }} keys
 * @returns {{ stored: string[], skipped: string[], defaultProvider: string | undefined }}
 */
export function saveGlobalKeys({ openai, anthropic, gemini, openrouter, defaultProvider } = {}) {
  const edits = { openai, anthropic, gemini, openrouter }
  const stored = []
  const skipped = []

  Object.entries(edits).forEach(([provider, value]) => {
    if (value === undefined) return
    const trimmed = value.trim()
    if (trimmed === '') {
      skipped.push(provider)
      return
    }
    writeSecret(KEYS[provider], trimmed)
    stored.push(provider)
  })

  let savedDefault
  if (defaultProvider !== undefined) {
    savedDefault = defaultProvider.trim()
    if (savedDefault === '') {
      localStorage.removeItem(DEFAULT_PROVIDER_KEY)
    } else {
      localStorage.setItem(DEFAULT_PROVIDER_KEY, savedDefault)
    }
  }

  return { stored, skipped, defaultProvider: savedDefault }
}

/**
 * Remove a single provider's saved key.
 *
 * Clearing the provider that is currently the default also removes the
 * preference. Callers should not have to remember the second step, and a
 * default that survives its key is guaranteed to break the next run.
 *
 * @param {'openai' | 'anthropic' | 'gemini' | 'openrouter' | 'defaultProvider'} provider
 */
export function clearGlobalKey(provider) {
  if (provider === 'defaultProvider') {
    localStorage.removeItem(DEFAULT_PROVIDER_KEY)
    return
  }

  const storageKey = KEYS[provider]
  if (storageKey) {
    sessionStorage.removeItem(storageKey)
    localStorage.removeItem(storageKey) // clear any legacy leak too
  }

  if (localStorage.getItem(DEFAULT_PROVIDER_KEY) === provider) {
    localStorage.removeItem(DEFAULT_PROVIDER_KEY)
  }
}

/**
 * Remove all key entries managed by this module (both current and legacy).
 */
export function clearAllGlobalKeys() {
  Object.values(KEYS).forEach((k) => {
    sessionStorage.removeItem(k)
    localStorage.removeItem(k)
  })
  localStorage.removeItem(DEFAULT_PROVIDER_KEY)
}

/**
 * Return an array of provider objects only for providers that have a saved key.
 * @returns {Array<{ id: string, label: string }>}
 */
export function getAvailableProviders() {
  const PROVIDER_LABELS = {
    openai: 'OpenAI',
    anthropic: 'Anthropic',
    gemini: 'Google Gemini',
    openrouter: 'OpenRouter',
  }

  const keys = getGlobalKeys()
  return Object.entries(PROVIDER_LABELS)
    .filter(([id]) => keys[id] && keys[id].trim() !== '')
    .map(([id, label]) => ({ id, label }))
}
