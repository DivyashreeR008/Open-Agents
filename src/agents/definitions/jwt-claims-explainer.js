export default {
  id: 'jwt-claims-explainer',
  createdAt: '2026-10-12',
  name: 'JWT Claims Explainer',
  description: 'Paste a JWT to get its header and claims decoded and explained field by field.',
  category: 'Developer Tools',
  icon: 'Fingerprint',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {
    token:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c',
    context: 'debugging',
  },
  inputs: [
    {
      id: 'token',
      label: 'JWT string',
      type: 'textarea',
      placeholder: 'Paste the full JWT (header.payload.signature), e.g. eyJhbGciOi...',
      required: true,
    },
    {
      id: 'context',
      label: 'Goal',
      type: 'select',
      options: ['debugging', 'learning', 'audit'],
      defaultValue: 'debugging',
      required: true,
    },
  ],
  systemPrompt: `You are a senior backend engineer who explains JSON Web Tokens clearly.

Decode the header and payload from the provided JWT without verifying
the signature cryptographically. Explain each field in plain language.

Output format:

## Token overview
State the algorithm, token type, and whether the structure is valid.

## Header fields
Explain alg, typ, and kid if present.

## Claims explained
Explain each registered claim (iss, sub, aud, exp, nbf, iat, jti)
and each custom claim found in the payload.

## Security observations
Note expiry handling, weak algorithms such as none, and sensitive
data placed in the payload.

## Next steps
List concrete checks the developer should run for their stated goal.

Rules:
- Never invent claim values; only explain what is present in the token
- Never invent library versions, CVEs, or RFC numbers
- Do not attempt to crack or forge signatures
- State clearly when the signature cannot be verified here
- Use neutral technical language with no emoji`,
  outputType: 'markdown',
  suggestedChainFrom: ['api-doc-generator', 'readme-generator'],
}
