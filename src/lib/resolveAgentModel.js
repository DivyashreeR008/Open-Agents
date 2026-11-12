// Verified stable API model endpoints - removed deprecated/future placeholders
export const MODELS = {
  openai: [
    { value: 'gpt-4o', label: 'GPT-4o' },
    { value: 'gpt-4o-mini', label: 'GPT-4o Mini' },
    { value: 'o1-mini', label: 'o1-mini' },
    { value: 'o3-mini', label: 'o3-mini' },
  ],
  anthropic: [
    { value: 'claude-3-5-sonnet-20241022', label: 'Claude 3.5 Sonnet' },
    { value: 'claude-3-5-haiku-20241022', label: 'Claude 3.5 Haiku' },
    { value: 'claude-3-opus-20240229', label: 'Claude 3 Opus' },
  ],
  gemini: [
    { value: 'gemini-2.5-flash', label: 'Gemini 2.5 Flash' },
    { value: 'gemini-1.5-pro', label: 'Gemini 1.5 Pro' },
    { value: 'gemini-2.0-flash-exp', label: 'Gemini 2.0 Flash (Exp)' },
  ],
  openrouter: [
    { value: 'openai/gpt-4o-mini', label: 'GPT-4o Mini' },
    { value: 'anthropic/claude-3.5-sonnet', label: 'Claude 3.5 Sonnet' },
    { value: 'google/gemini-2.5-flash', label: 'Gemini 2.5 Flash' },
  ],
}

export const MODEL_MAP = {
  openai: MODELS.openai[0].value,
  anthropic: MODELS.anthropic[0].value,
  gemini: MODELS.gemini[0].value,
  openrouter: MODELS.openrouter[0].value,
}

const hasOwn = (object, key) => Object.prototype.hasOwnProperty.call(object, key)

export function resolveAgentModel(agent, actualProvider, selectedModel) {
  // Check if selectedModel is valid for the current actualProvider
  const providerModels = hasOwn(MODELS, actualProvider) ? MODELS[actualProvider] : null
  if (selectedModel && providerModels?.some((m) => m.value === selectedModel)) {
    return selectedModel
  }

  const definition = agent && typeof agent === 'object' ? agent : {}

  if (definition.models && hasOwn(definition.models, actualProvider)) {
    return definition.models[actualProvider]
  }

  if (
    definition.model &&
    (actualProvider === definition.defaultProvider || actualProvider === definition.provider)
  ) {
    return definition.model
  }

  return hasOwn(MODEL_MAP, actualProvider) ? MODEL_MAP[actualProvider] : MODEL_MAP.openai
}
