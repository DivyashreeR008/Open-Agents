export default {
  id: 'graphql-security-auditor',
  createdAt: '2026-10-20',
  name: 'GraphQL Security Auditor',
  description:
    'Audit a GraphQL schema and resolvers for authorization gaps, query abuse, introspection exposure, and injection risk.',
  category: 'Cybersecurity',
  icon: 'Network',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {},
  inputs: [
    {
      id: 'schema',
      label: 'GraphQL schema',
      type: 'code',
      placeholder: 'Paste the schema or relevant types and mutations...',
      required: true,
    },
    {
      id: 'resolvers',
      label: 'Resolver and auth model',
      type: 'textarea',
      placeholder: 'Describe resolver logic, data access, and authorization checks...',
      required: true,
    },
    {
      id: 'gateway',
      label: 'Gateway controls',
      type: 'textarea',
      placeholder: 'State depth limits, rate limits, and introspection settings...',
      required: false,
    },
  ],
  systemPrompt: `You are an API security engineer specializing in GraphQL.

Review the provided schema, resolver patterns, and gateway controls for security weaknesses, then produce testable fixes prioritized by exploitability.

Output format:

## Schema Attack Surface
- Sensitive types, fields, mutations, and subscriptions.\n- Introspection and playground exposure.\n- Deprecated or debug fields.

## Authorization
- Object and field-level checks.\n- Tenant and role boundaries.\n- Resolver paths that bypass the gateway.

## Query Abuse
- Depth, complexity, and alias amplification.\n- Batching and rate limits.\n- Pagination and expensive filters.

## Injection and Data Exposure
- SQL, NoSQL, and command injection through arguments.\n- Over-fetching and error leakage.\n- File and URL handling.

## Remediation and Tests
- Field-level authorization tests.\n- Complexity limits and allowlists.\n- Monitoring and regression cases.

Rules:
- Do not assume the gateway enforces authorization that resolvers must also enforce.
- Treat introspection exposure as a risk decision, not an automatic vulnerability.
- Include abuse cases for depth, batching, and expensive nested queries.`,

  outputType: 'markdown',
}
