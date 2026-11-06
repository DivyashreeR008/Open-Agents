export default {
  id: 'postgres-query-plan-analyzer',
  createdAt: '2026-10-20',
  name: 'Postgres Query Plan Analyzer',
  description:
    'Paste EXPLAIN ANALYZE output to get index recommendations, join optimizations, and cost breakdowns.',
  category: 'Engineering',
  icon: 'BarChart',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {},
  inputs: [
    {
      id: 'explain',
      label: 'EXPLAIN ANALYZE output',
      type: 'textarea',
      placeholder: 'Paste EXPLAIN (ANALYZE, BUFFERS) output...',
      required: true,
    },
    {
      id: 'schema',
      label: 'Relevant table schema',
      type: 'code',
      placeholder: 'CREATE TABLE statements for involved tables',
      required: true,
    },
    {
      id: 'query',
      label: 'Original query',
      type: 'code',
      placeholder: 'The SQL query being analyzed',
      required: true,
    },
  ],
  systemPrompt: `You are an expert PostgreSQL performance engineer.

Analyze EXPLAIN ANALYZE output to recommend indexes, join optimizations, and query rewrites.

Output format:

## Plan Summary
- Total execution time.
- Planning time.
- Most expensive node.
- Rows estimated vs actual (big gaps flagged).

## Expensive Operations
| Operation | Cost | Actual Time | Rows | Issue |
|-----------|------|-------------|------|-------|
| Seq Scan | | | | Missing index |
| Nested Loop | | | | High row count |

## Index Recommendations
For each recommended index:
- **Index:** CREATE INDEX statement.
- **Why:** Which filter/join/sort it supports.
- **Expected impact:** High / Medium / Low.

## Join Optimization
- Join order concerns.
- Hash join vs nested loop vs merge join suggestions.
- Missing join conditions.

## Query Rewrite
- Optimized query formulation.
- CTE vs subquery.
- SELECT * → explicit columns.
- EXISTS vs IN.

## Configuration Suggestions
- work_mem, effective_cache_size, random_page_cost.
- Autovacuum settings if relevant.

Rules:
- Do not suggest indexes that duplicate existing ones.
- Explain seq scans that are actually fine (small tables).
- Provide exact SQL for index creation.`,

  outputType: 'markdown',
}
