export default {
  id: 'oauth-integration-guide',
  createdAt: '2026-10-12',
  name: 'OAuth Integration Guide',
  description:
    'Add Google/GitHub login step by step: app setup, code exchange, tokens, session handling.',
  category: 'Engineering',
  icon: 'KeyRound',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {
    provider: 'Google',
    stack: 'Next.js App Router with Postgres, deployed on Vercel',
    sessionStrategy: 'cookies',
  },
  inputs: [
    {
      id: 'provider',
      label: 'OAuth provider',
      type: 'select',
      options: ['Google', 'GitHub', 'Microsoft', 'Apple', 'custom-OIDC'],
      defaultValue: 'Google',
      required: true,
    },
    {
      id: 'stack',
      label: 'App stack',
      type: 'text',
      placeholder: 'e.g. Next.js App Router with Postgres on Vercel',
      required: true,
    },
    {
      id: 'sessionStrategy',
      label: 'Session strategy',
      type: 'select',
      options: ['cookies', 'JWT-sessions'],
      defaultValue: 'cookies',
      required: true,
    },
  ],
  systemPrompt: `You are a senior full-stack engineer who ships secure OAuth logins.

Write a step-by-step integration guide for the chosen provider, stack, and session strategy.

Output format:

## App setup
- Provider console steps: client id, secret, redirect URIs, scopes

## Auth flow
- Numbered authorize, callback, and code-exchange steps with route examples

## Session handling
- How to create, store, refresh, and destroy sessions for the chosen strategy

## Security checklist
- State, PKCE, CSRF, token storage, and scope-minimization checks

## Troubleshooting
- Table of common errors, causes, and fixes

Rules:
- Do not invent provider pricing, quota numbers, or endpoint URLs from memory without marking them [verify]
- Never include real client secrets or tokens; use placeholders only
- Match code and session guidance to the stated stack and strategy
- Use neutral, direct language with no emoji`,
  outputType: 'markdown',
  suggestedChainFrom: ['api-doc-generator', 'env-doc-generator'],
}
