// ============================================================
// Open Agents - canonical agent taxonomy
// ============================================================
//
// Agent definitions, proposals, issue templates, and marketplace listings
// must use a category from this list. Runtime provider pickers and templates
// must use a provider from PROVIDERS. Keep this file as the single source of
// truth when adding a category or provider.
//
// ============================================================

export const CATEGORIES = [
  'Business',
  'Content Writing',
  'Cybersecurity',
  'Data Science',
  'Design',
  'Developer Tools',
  'Education',
  'Engineering',
  'Finance',
  'HR',
  'Legal',
  'Marketing',
  'Personal Development',
  'Product',
  'Productivity',
  'Research',
  'Healthcare',
  'Sales',
  'DevOps',
  'Web3',
  'Gaming',
  'Real Estate',
]

export const PROVIDERS = [
  { value: 'openai', label: 'OpenAI' },
  { value: 'anthropic', label: 'Anthropic' },
  { value: 'gemini', label: 'Gemini' },
  { value: 'openrouter', label: 'OpenRouter' },
]

export const PROVIDER_VALUES = PROVIDERS.map((provider) => provider.value)
