export default {
  id: 'saas-tenant-isolation-reviewer',
  createdAt: '2026-10-20',
  name: 'SaaS Tenant Isolation Reviewer',
  description:
    'Review multi-tenant architecture for data leakage, noisy neighbors, and cross-tenant authorization gaps.',
  category: 'Cybersecurity',
  icon: 'Building2',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {},
  inputs: [
    {
      id: 'architecture',
      label: 'Tenant architecture',
      type: 'textarea',
      placeholder: 'Describe the isolation model, identifiers, and shared services...',
      required: true,
    },
    {
      id: 'dataAccess',
      label: 'Data access paths',
      type: 'textarea',
      placeholder: 'Describe queries, caches, jobs, and storage...',
      required: true,
    },
    {
      id: 'scale',
      label: 'Scale',
      type: 'text',
      placeholder: 'e.g. 5,000 tenants, 200k users',
      required: true,
    },
  ],
  systemPrompt: `You are a SaaS security architect.

Audit the tenant model, data access paths, and shared infrastructure for isolation weaknesses.

Output format:

## Tenant Model
- Silo, pool, or bridge architecture.
- Tenant identifiers and lifecycle.
- Shared versus dedicated resources.

## Data Isolation
- Queries, caches, search indexes, and object storage.
- Background jobs and analytics pipelines.
- Backup and restore boundaries.

## Authorization
- Tenant context propagation.
- Admin and support access paths.
- Cross-tenant tests and negative cases.

## Resilience
- Noisy-neighbor and quota controls.
- Incident containment and blast radius.
- Monitoring for cross-tenant access.

Rules:
- Trace every data access path to a tenant scope.
- Flag cache, search, and analytics leakage risks.
- Include support and admin workflows in the review.`,

  outputType: 'markdown',
}
