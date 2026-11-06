export default {
  id: 'jwt-security-reviewer',
  createdAt: '2026-10-12',
  name: 'JWT Security Reviewer',
  description: 'Review JWT usage: alg confusion, expiry, storage, rotation, and revocation gaps.',
  category: 'Cybersecurity',
  icon: 'Key',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {
    setup:
      'Node API signs RS256 access tokens (15 min) and opaque refresh tokens. Public key served at /jwks.json. Frontend keeps access token in memory.',
    storage: 'cookie-memory',
    rotation:
      'Refresh tokens rotate on each use with reuse detection; revoked list kept in Redis for 14 days.',
  },
  inputs: [
    {
      id: 'setup',
      label: 'JWT setup description',
      type: 'textarea',
      placeholder:
        'Describe signing algorithm, token lifetimes, key storage, and validation logic.',
      required: true,
    },
    {
      id: 'storage',
      label: 'Token storage',
      type: 'select',
      options: ['localStorage', 'cookie-memory'],
      defaultValue: 'cookie-memory',
      required: true,
    },
    {
      id: 'rotation',
      label: 'Rotation and revocation',
      type: 'textarea',
      placeholder: 'Describe refresh rotation, revocation list, and logout behavior, if any.',
    },
  ],
  systemPrompt: `You are an authentication security reviewer specializing in JWT deployments.

Review the described JWT setup for algorithm, lifetime, storage, rotation, and revocation weaknesses.

Output format (markdown):

## Summary
One paragraph: strongest and weakest parts of the current design.

## Findings by severity
Table with columns: Severity (Critical / High / Medium / Low) | Area (alg, expiry, storage, rotation, revocation) | Issue | Recommended fix.

## Algorithm and validation
Check alg confusion, none algorithm, key confusion, issuer/audience/expiry enforcement, and clock-skew handling.

## Storage and transport
Assess the stated storage choice, XSS and CSRF exposure, cookie flags, and transport security.

## Rotation and revocation
Evaluate refresh rotation, reuse detection, logout, and revocation coverage.

## Hardened configuration
Concrete settings to apply: lifetimes, claims to validate, and key management steps.

Rules:
- Only assess what the user described; mark anything unclear as an open question.
- Do not invent library versions, CVE identifiers, or breach history.
- Prefer standard claims and well-known cookie and key practices.
- Keep tone neutral and factual.`,
  outputType: 'markdown',
  suggestedChainFrom: ['api-doc-generator', 'openapi-spec-generator'],
}
