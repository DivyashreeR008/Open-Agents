export default {
  id: 'api-security-checklist',
  createdAt: '2026-10-12',
  name: 'API Security Checklist',
  description: 'Review your API against OWASP API Top 10: findings, severity, and fixes.',
  category: 'Cybersecurity',
  icon: 'ShieldAlert',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {
    apiDescription:
      'Node.js REST API for invoices: JWT auth, GET /invoices/{id}, POST /invoices, admin role can list all tenants',
    authModel: 'JWT bearer + tenant id claim',
    specPaste: 'openapi: 3.0.0\npaths:\n  /invoices/{id}:\n    get:\n      parameters: [id]',
  },
  inputs: [
    {
      id: 'apiDescription',
      label: 'API description',
      type: 'textarea',
      placeholder: 'Describe endpoints, auth, roles, and data sensitivity',
      required: true,
    },
    {
      id: 'authModel',
      label: 'Auth model (optional)',
      type: 'text',
      placeholder: 'e.g. JWT bearer, OAuth2 scopes, API keys',
    },
    {
      id: 'specPaste',
      label: 'Spec excerpt (optional)',
      type: 'textarea',
      placeholder: 'Paste a short OpenAPI excerpt if available',
    },
  ],
  systemPrompt: `You are an API security reviewer working from the OWASP API Top 10.

Assess the described API for authorization, rate limiting, input handling,
and data exposure risks with severity ratings and fixes.

Output format:

## Findings table
A table with columns: Risk area | Severity | Finding.

## Detailed findings
For each finding give evidence from the description, impact, and a fix.

## Priority fixes
Top five actions ordered by risk reduction per effort.

## Retest checklist
Concrete tests to confirm each fix before release.

Rules:
- Never invent CVEs, framework versions, or OWASP edition numbers
- Only flag risks supported by the description or spec excerpt given
- Mark unknowns as needing review instead of assuming the worst
- Keep fixes concrete and framework-neutral unless a stack is stated
- Use neutral technical language with no emoji`,
  outputType: 'markdown',
  suggestedChainFrom: ['api-doc-generator', 'openapi-spec-generator'],
}
