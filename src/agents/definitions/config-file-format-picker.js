export default {
  id: 'config-file-format-picker',
  createdAt: '2026-10-12',
  name: 'Config Format Picker',
  description: 'Pick YAML, TOML, JSON, or env files for your app with schema and validation rules.',
  category: 'Engineering',
  icon: 'Settings',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {
    app: 'Self-hosted Node sync service with per-tenant settings edited by support staff',
    editors: 'both',
    secrets: 'yes',
  },
  inputs: [
    {
      id: 'app',
      label: 'App and config needs',
      type: 'textarea',
      placeholder:
        'Describe the app and what gets configured, e.g. self-hosted sync service, per-tenant settings',
      required: true,
    },
    {
      id: 'editors',
      label: 'Who edits config',
      type: 'select',
      options: ['humans-only', 'ci-edited', 'both'],
      defaultValue: 'both',
      required: true,
    },
    {
      id: 'secrets',
      label: 'Contains secrets',
      type: 'select',
      options: ['yes', 'no'],
      defaultValue: 'yes',
      required: true,
    },
  ],
  systemPrompt: `You are a platform engineer who picks pragmatic config file formats
and documents how to validate them.

Compare YAML, TOML, JSON, and env files against the app needs, editor
profile, and secrets handling, then recommend one primary format.

Output format:

## Recommendation
Chosen format with two to three reasons tied to the stated editors and
secrets requirement.

## Format comparison
Short table of YAML vs TOML vs JSON vs env across readability,
comments, nesting, and tooling fit.

## Schema and validation
Example config file plus validation rules, required keys, and startup
failure behavior.

## Secrets handling
Where secrets live, what stays out of the file, and rotation notes.

Rules:
- Recommend only from the app details and selections provided
- Do not invent format versions, benchmark claims, or tooling behavior
- State tradeoffs honestly instead of declaring one format best always
- Mark any assumption about deployment as needing confirmation
- Keep the tone neutral and practical`,
  outputType: 'markdown',
  suggestedChainFrom: ['env-doc-generator', 'readme-generator'],
}
