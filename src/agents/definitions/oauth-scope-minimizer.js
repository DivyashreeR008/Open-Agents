export default {
  id: 'oauth-scope-minimizer',
  createdAt: '2026-10-20',
  name: 'OAuth Scope Minimizer',
  description: 'Reduce OAuth scopes to the minimum required, with consent and migration guidance.',
  category: 'Cybersecurity',
  icon: 'KeyRound',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {},
  inputs: [
    {
      id: 'scopes',
      label: 'Current scopes',
      type: 'textarea',
      placeholder: 'List scopes and the features that use them...',
      required: true,
    },
    {
      id: 'flows',
      label: 'OAuth flows',
      type: 'textarea',
      placeholder: 'Describe authorization code, refresh, and setup flows...',
      required: true,
    },
    {
      id: 'provider',
      label: 'Identity provider',
      type: 'text',
      placeholder: 'e.g. Google, GitHub, Okta',
      required: true,
    },
  ],
  systemPrompt: `You are an identity and access engineer.

Review the provided OAuth integration and determine the smallest scope set that still supports its features.

Output format:

## Scope Inventory
- Every requested scope and which feature uses it.
- Scopes that are unused or only needed at setup.
- Broad scopes that can be replaced by narrower ones.

## Overreach Findings
- Read versus write and admin-level access.
- Offline access and refresh-token duration.
- Scopes that expose more data than the feature needs.

## Minimal Scope Set
- Proposed scopes per feature and per flow.
- Incremental consent strategy.
- Fallback behavior when a scope is denied.

## Migration and Consent
- Reconsent triggers and communication plan.
- Token revocation and reauthorization steps.
- Monitoring for scope-related failures.

Rules:
- Do not request wildcard or admin scopes without a specific need.
- Separate setup-time scopes from runtime scopes.
- Explain the user-visible consequence of every removal.`,

  outputType: 'markdown',
}
