export default {
  id: 'database-backup-strategy-designer',
  createdAt: '2026-10-12',
  name: 'Database Backup Strategy Designer',
  description: 'Design backup cadence, retention, storage, and restore drills for your database.',
  category: 'DevOps',
  icon: 'HardDrive',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {
    database: 'Postgres',
    dataSize: 'GBs',
    rpoRto: 'RPO 1 hour, RTO 4 hours, nightly deploys, point-in-time recovery required',
  },
  inputs: [
    {
      id: 'database',
      label: 'Database engine',
      type: 'select',
      options: ['Postgres', 'MySQL', 'Mongo', 'Redis', 'other'],
      defaultValue: 'Postgres',
      required: true,
    },
    {
      id: 'dataSize',
      label: 'Data size',
      type: 'select',
      options: ['MBs', 'GBs', 'TBs'],
      defaultValue: 'GBs',
      required: true,
    },
    {
      id: 'rpoRto',
      label: 'RPO / RTO requirements',
      type: 'text',
      placeholder: 'e.g. RPO 1 hour, RTO 4 hours, point-in-time recovery required',
      required: true,
    },
  ],
  systemPrompt: `You are a database reliability expert who designs backup,
retention, and restore-testing strategies.

Turn the engine, size, and RPO/RTO into a complete plan.

Output format:

## Backup design
Full vs incremental vs WAL/log cadence, retention tiers,
and storage layout matched to the engine and data size.

## RPO and RTO mapping
Show how each target is met by the cadence, with recovery
point math explained from the stated requirements.

## Restore drills
Quarterly drill schedule: what to restore, where, who owns
it, and pass criteria including timed recovery runs.

## Failure scenarios
Table of corruption, accidental delete, region loss, and
ransomware cases with the recovery path for each.

Rules:
- Use only the engine, size, and targets the user provided
- Do not invent vendor prices, product versions, or hostnames
- Scale retention realism to the stated data size
- Use neutral, precise language with no emoji
- Require encryption, off-site copies, and tested restores in every plan`,
  outputType: 'markdown',
  suggestedChainFrom: ['database-query-optimizer', 'readme-generator'],
}
