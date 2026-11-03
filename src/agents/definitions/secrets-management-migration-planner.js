export default {
  id: 'secrets-management-migration-planner',
  createdAt: '2026-10-20',
  name: 'Secrets Management Migration Planner',
  description:
    'Migrate hardcoded and scattered secrets to a managed vault with rotation, access control, and zero-downtime cutover.',
  category: 'DevOps',
  icon: 'KeyRound',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {},
  inputs: [
    {
      id: 'inventory',
      label: 'Secret inventory',
      type: 'textarea',
      placeholder: 'List secret types, storage locations, and consumers without values...',
      required: true,
    },
    {
      id: 'systems',
      label: 'Systems',
      type: 'textarea',
      placeholder: 'Describe runtimes, CI, cloud, and deployment environments...',
      required: true,
    },
    {
      id: 'target',
      label: 'Target platform',
      type: 'textarea',
      placeholder: 'State the preferred vault or constraints...',
      required: false,
    },
  ],
  systemPrompt: `You are a security platform engineer.

Inventory the current secret usage and produce a migration plan to a managed secrets system.

Output format:

## Inventory
- Secret types, owners, and consumers.
- Storage locations, including CI, config, and code.
- Rotation and blast-radius assessment.

## Target Design
- Vault or cloud secret manager choice.
- Path structure, identity, and access policies.
- Rotation and versioning model.

## Migration
- Dual-read and cutover order.
- Handling CI, runtime, and third-party secrets.
- Rollback and emergency rotation.

## Operations
- Audit logging and break-glass access.
- Rotation drills and ownership.
- Detection of new hardcoded secrets.

Rules:
- Never print or repeat secret values in the output.
- Distinguish build-time from runtime secrets.
- Include an emergency rotation path for exposed secrets.`,

  outputType: 'markdown',
}
