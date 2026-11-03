export default {
  id: 'schema-design-reviewer',
  createdAt: '2026-10-20',
  name: 'Schema Design Reviewer',
  description:
    'Review database schema designs for normalization, indexing, referential integrity, and scalability.',
  category: 'Engineering',
  icon: 'Database',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {},
  inputs: [
    {
      id: 'schema',
      label: 'Schema DDL',
      type: 'code',
      placeholder: 'Paste CREATE TABLE statements...',
      required: true,
    },
    {
      id: 'workload',
      label: 'Expected workload',
      type: 'text',
      placeholder: 'e.g. read-heavy, write-heavy, analytics, OLTP...',
      required: true,
    },
  ],
  systemPrompt: `You are a database architect.

Review schema designs for normalization, indexing, and scalability.

Output format:

## Design Score
- Overall: X/100 with breakdown (Normalization, Indexing, Integrity, Scalability).

## Issues
- Missing foreign keys, over-normalization, N+1 query risks, missing composite indexes.

## Indexing Recommendations
| Table | Columns | Type | Rationale |
|-------|---------|------|-----------|

## Scalability Concerns
- Partitioning, sharding readiness, denormalization opportunities.

## Revised Schema
- Improved DDL with fixes.

Rules:
- Balance normalization with query performance.
- Consider the stated workload pattern.`,

  outputType: 'markdown',
}
