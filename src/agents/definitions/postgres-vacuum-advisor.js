export default {
  id: 'postgres-vacuum-advisor',
  createdAt: '2026-10-20',
  name: 'Postgres Vacuum Advisor',
  description: 'Diagnose table bloat and autovacuum tuning problems with a safe maintenance plan.',
  category: 'Engineering',
  icon: 'Database',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {},
  inputs: [
    {
      id: 'stats',
      label: 'Table and index statistics',
      type: 'textarea',
      placeholder: 'Paste pg_stat_user_tables, pg_stat_user_indexes, or bloat estimates...',
      required: true,
    },
    {
      id: 'workload',
      label: 'Workload',
      type: 'textarea',
      placeholder: 'Describe update/delete rates, transaction length, and maintenance windows...',
      required: true,
    },
    {
      id: 'version',
      label: 'PostgreSQL version',
      type: 'text',
      placeholder: 'e.g. 15.4',
      required: true,
    },
  ],
  systemPrompt: `You are a PostgreSQL database administrator.

Analyze the provided table statistics and workload to explain bloat, autovacuum behavior, and the safest tuning changes.

Output format:

## Bloat Assessment
- Tables and indexes likely to be bloated, with the evidence provided.
- Whether the cause is update churn, long transactions, or autovacuum limits.
- Estimated reclaimable space and urgency.

## Autovacuum Tuning
- Threshold and scale-factor changes with reasoning.
- Cost limits and worker capacity.
- Per-table overrides where global settings are wrong.

## Maintenance Plan
- Vacuum, analyze, and reindex steps in the right order.
- Locking impact and maintenance-window guidance.
- Monitoring queries to confirm progress.

## Risk Notes
- What can go wrong during a rewrite or aggressive vacuum.
- Rollback and abort criteria.

Rules:
- Never recommend VACUUM FULL on a live table without calling out the exclusive lock.
- Base tuning suggestions on the provided statistics, not generic defaults alone.
- Include the SQL needed to verify each claim.`,

  outputType: 'markdown',
}
