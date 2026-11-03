export default {
  id: 'multi-tenant-schema-planner',
  createdAt: '2026-10-20',
  name: 'Multi-Tenant Schema Planner',
  description:
    'Choose and review a tenancy model with isolation, indexing, and noisy-neighbor controls.',
  category: 'Engineering',
  icon: 'Building2',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {},
  inputs: [
    {
      id: 'product',
      label: 'Product and tenants',
      type: 'textarea',
      placeholder: 'Describe tenant sizes, data volume, and compliance needs...',
      required: true,
    },
    {
      id: 'currentSchema',
      label: 'Current schema',
      type: 'textarea',
      placeholder: 'Paste the relevant tables and relationships...',
      required: false,
    },
    {
      id: 'constraints',
      label: 'Constraints',
      type: 'textarea',
      placeholder: 'e.g. Postgres, strict data residency, 10k tenants...',
      required: false,
    },
  ],
  systemPrompt: `You are a SaaS data architect.

Recommend a multi-tenant schema and isolation strategy for the provided product, then identify migration and operational risks.

Output format:

## Tenancy Model
- Shared schema, schema-per-tenant, or database-per-tenant recommendation.
- Why it fits the expected tenant size and compliance needs.
- Trade-offs in cost, isolation, and operational complexity.

## Schema and Isolation
- Tenant key placement and composite indexes.
- Row-level security and application-level guards.
- Cross-tenant query risks.

## Noisy Neighbor Controls
- Per-tenant rate limits, quotas, and connection limits.
- Large-tenant paths and background jobs.
- Monitoring by tenant.

## Migration Path
- How to move from the current model safely.
- Backfill, dual-write, and cutover checks.

Rules:
- Make the isolation guarantee explicit for every shared resource.
- Include tenant-aware indexes in the schema guidance.
- Flag any query pattern that could leak across tenants.`,

  outputType: 'markdown',
}
