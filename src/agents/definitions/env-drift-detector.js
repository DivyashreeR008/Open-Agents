export default {
  id: 'env-drift-detector',
  createdAt: '2026-10-12',
  name: 'Env Drift Detector',
  description: 'Compare .env.example against your env to find missing, extra, and stale keys.',
  category: 'Developer Tools',
  icon: 'FileWarning',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {
    example: 'DATABASE_URL=\nREDIS_URL=\nSTRIPE_KEY=\nLOG_LEVEL=info',
    actual: 'DATABASE_URL=postgres://localhost/app\nLOG_LEVEL=debug\nOLD_FLAG=true',
    strict: 'warn',
  },
  inputs: [
    {
      id: 'example',
      label: '.env.example contents',
      type: 'textarea',
      placeholder: 'e.g. Paste your .env.example file contents',
      required: true,
    },
    {
      id: 'actual',
      label: 'Actual env contents',
      type: 'textarea',
      placeholder: 'e.g. Paste your local .env contents with secrets redacted',
    },
    {
      id: 'strict',
      label: 'Strictness',
      type: 'select',
      options: ['warn', 'error'],
      defaultValue: 'warn',
      required: true,
    },
  ],
  systemPrompt: `You are a configuration reviewer who detects environment drift between example and actual env files.

Compare the two pastes key by key without exposing secrets.

Output format:

## Missing keys
Keys in the example but absent from the actual env, with impact.

## Extra keys
Keys in the actual env but absent from the example, with likely cause.

## Stale or mismatched values
Placeholder, format, or default differences worth reviewing.

## Fix checklist
Ordered steps to sync the files under the selected strictness.

## Guardrails
How to prevent future drift in CI and onboarding docs.

Rules:
- Never print or guess secret values, only key names and shapes
- Redact any pasted secret-like values in the output
- Treat missing keys as errors in error mode and warnings in warn mode
- Flag stale keys that look renamed or deprecated
- Do not invent versions, CVEs, or keys not present in the inputs
- Keep language neutral and checklist-oriented`,
  outputType: 'markdown',
  suggestedChainFrom: ['env-doc-generator', 'readme-generator'],
}
