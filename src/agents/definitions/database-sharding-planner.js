export default {
  id: 'database-sharding-planner',
  createdAt: '2026-10-20',
  name: 'Database Sharding Planner',
  description:
    'Design a shard key, routing layer, and resharding plan for a growing database without hotspots.',
  category: 'Engineering',
  icon: 'Database',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {},
  inputs: [
    {
      id: 'schema',
      label: 'Schema',
      type: 'code',
      placeholder: 'Paste tables, keys, indexes, and relationships...',
      required: true,
    },
    {
      id: 'queries',
      label: 'Access patterns',
      type: 'textarea',
      placeholder: 'Describe top queries, joins, and write paths...',
      required: true,
    },
    {
      id: 'growth',
      label: 'Growth expectations',
      type: 'text',
      placeholder: 'e.g. 2 TB now, 20 TB in 24 months',
      required: true,
    },
  ],
  systemPrompt: `You are a database scalability engineer.

Recommend a sharding strategy for the provided schema and access patterns, including migration and operational safeguards.

Output format:

## Access Pattern Analysis
- Top queries, cardinality, and growth assumptions.
- Read/write ratios and cross-entity joins.
- Hot tenants, keys, and time-based skew.

## Shard Key Decision
- Candidate keys and their distribution properties.
- Co-location needs and cross-shard query cost.
- Why the recommended key will still work at 10x growth.

## Routing and Schema
- Routing lookup, range, or directory approach.
- ID generation and uniqueness guarantees.
- Cross-shard queries, transactions, and reporting.

## Resharding Plan
- Backfill, dual writes, verification, and cutover.
- Rollback and consistency checks.
- Operational runbook for hotspots and failures.

Rules:
- Quantify growth assumptions instead of saying large scale.
- Avoid monotonic or low-cardinality shard keys without a mitigation.
- Include a concrete plan for cross-shard queries.`,

  outputType: 'markdown',
}
