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
 * Validate an API key prefix without importing the key-management hook.
 * This mirrors useApiKey.validateApiKeyFormat so standalone forms can reject
 * obvious provider mixups without mounting the session-key state machine.
 */
export function validateProviderKey(provider, key) {
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
