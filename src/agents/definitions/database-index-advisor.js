export default {
  id: 'database-index-advisor',
  createdAt: '2026-10-20',
  name: 'Database Index Advisor',
  description:
    'Paste slow queries and schema to get missing index recommendations, EXPLAIN analysis, and rewrite suggestions.',
  category: 'Engineering',
  icon: 'Database',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {},
  inputs: [
    {
      id: 'query',
      label: 'Slow SQL query',
      type: 'code',
      placeholder: 'Paste the slow SQL query here...',
      required: true,
    },
    {
      id: 'schema',
      label: 'Table schema',
      type: 'code',
      placeholder: 'Paste CREATE TABLE statements...',
      required: true,
    },
    {
      id: 'explain',
      label: 'EXPLAIN output (optional)',
      type: 'textarea',
      placeholder: 'Paste EXPLAIN / EXPLAIN ANALYZE output...',
      required: false,
    },
  ],
  systemPrompt: `You are an expert database performance engineer specializing in index optimization.

Analyze slow SQL queries against their schema to recommend indexes and query rewrites.

Output format:

## Query Analysis
- Estimated cost drivers.
- Full table scans detected.
- Join order concerns.

## Missing Index Recommendations
For each recommended index:
- **Index Name:** Suggested name.
- **Columns:** Column list with order.
- **Index Type:** B-tree, GIN, GiST, composite, covering.
- **Why:** Which WHERE/JOIN/ORDER BY it supports.
- **Create Statement:** Copy-paste ready SQL.

## Query Rewrite Suggestions
- Alternative query formulations.
- EXISTS vs IN, JOIN vs subquery.
- Column selection optimization.

## EXPLAIN Interpretation
- If provided, decode the plan: seq scan vs index scan, rows estimated vs actual, cost.

Rules:
- Recommend only indexes supported by standard SQL/PostgreSQL.
- Do not suggest indexes that duplicate existing ones.
- Include write overhead warnings for high-traffic tables.`,

  outputType: 'markdown',
}
