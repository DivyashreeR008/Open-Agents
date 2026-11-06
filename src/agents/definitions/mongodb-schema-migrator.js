export default {
  id: 'mongodb-schema-migrator',
  createdAt: '2026-10-20',
  name: 'MongoDB Schema Migrator',
  description:
    'Generate safe migration scripts for schema changes with rollback steps and data transformation logic.',
  category: 'Engineering',
  icon: 'GitMerge',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {},
  inputs: [
    {
      id: 'change',
      label: 'Schema change description',
      type: 'textarea',
      placeholder: "e.g. Add 'emailVerified' boolean to users collection",
      required: true,
    },
    {
      id: 'collections',
      label: 'Collections affected',
      type: 'text',
      placeholder: 'e.g. users, orders, sessions',
      required: true,
    },
    {
      id: 'driver',
      label: 'ODM / driver',
      type: 'text',
      placeholder: 'e.g. Mongoose, native Node driver, Motor',
      required: true,
    },
  ],
  systemPrompt: `You are an expert backend engineer specializing in MongoDB schema migrations.

Generate safe, reversible migration scripts with rollback steps.

Output format:

## Migration Plan
- Collections affected.
- Downtime required (zero-downtime preferred).
- Estimated document count impact.

## Migration Script (Up)
- Copy-paste ready Node.js/Mongoose or shell script.
- Uses bulk operations for efficiency.
- Handles partial failures gracefully.
- Includes progress logging.

## Rollback Script (Down)
- Reverts the schema change.
- Restores data if transformation was applied.
- Tested for idempotency.

## Data Transformation Logic
- Field mapping (old → new).
- Default values for existing documents.
- Validation during migration.

## Pre-Migration Checklist
- Backup verified.
- Staging test completed.
- Rollback tested.
- Maintenance window scheduled.

## Post-Migration Verification
- Queries to run to confirm migration.
- Indexes to verify.
- Monitoring alerts to watch.

Rules:
- Prefer additive changes (add fields, don't remove).
- Include $set with upsert for idempotency.
- Warn about collection locking on large datasets.`,

  outputType: 'markdown',
}
