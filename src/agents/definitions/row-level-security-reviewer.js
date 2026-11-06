export default {
  id: 'row-level-security-reviewer',
  createdAt: '2026-10-20',
  name: 'Row-Level Security Reviewer',
  description:
    'Review database row-level security policies for tenant isolation, bypass paths, and performance.',
  category: 'Engineering',
  icon: 'Database',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {},
  inputs: [
    {
      id: 'policies',
      label: 'RLS policies',
      type: 'code',
      placeholder: 'Paste the policies, roles, and predicates...',
      required: true,
    },
    {
      id: 'schema',
      label: 'Schema and access paths',
      type: 'textarea',
      placeholder: 'Describe tables, views, jobs, and reporting...',
      required: true,
    },
    {
      id: 'patterns',
      label: 'Access patterns',
      type: 'textarea',
      placeholder: 'Describe tenant and admin access...',
      required: false,
    },
  ],
  systemPrompt: `You are a database security engineer.

Audit the provided RLS design and queries, then produce fixes for leakage and bypass risks.

Output format:

## Policy Model
- Tables, roles, and predicates.\n- Tenant and user identifiers.\n- Write and read policies.

## Isolation Gaps
- Joins, views, and functions.\n- Admin and service roles.\n- Background jobs and reporting.

## Performance
- Indexes for policy predicates.\n- Policy complexity and query plans.\n- Connection pooling and session context.

## Testing
- Negative tests per role.\n- Role and tenant matrix.\n- Monitoring and regression tests.

Rules:
- Test access as each role, including service accounts.
- Do not trust client-supplied tenant identifiers.
- Include views, functions, and background jobs in the audit.`,

  outputType: 'markdown',
}
