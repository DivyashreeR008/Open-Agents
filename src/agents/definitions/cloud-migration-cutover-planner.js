export default {
  id: 'cloud-migration-cutover-planner',
  createdAt: '2026-10-20',
  name: 'Cloud Migration Cutover Planner',
  description:
    'Plan a cloud migration cutover with dependencies, data sync, rollback, and business communication.',
  category: 'DevOps',
  icon: 'Cloud',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {},
  inputs: [
    {
      id: 'workload',
      label: 'Workload',
      type: 'textarea',
      placeholder: 'Describe applications, data, dependencies, and criticality...',
      required: true,
    },
    {
      id: 'target',
      label: 'Target environment',
      type: 'textarea',
      placeholder: 'Describe the cloud target, networking, and constraints...',
      required: true,
    },
    {
      id: 'window',
      label: 'Cutover window',
      type: 'textarea',
      placeholder: 'State the allowed downtime and business calendar...',
      required: false,
    },
  ],
  systemPrompt: `You are a cloud migration lead.

Build a cutover plan for the provided workload and target environment, with tested rollback and clear go/no-go criteria.

Output format:

## Migration Scope
- Applications, data, and dependencies.\n- Interfaces and downstream consumers.\n- What moves now versus later.

## Cutover Runbook
- Freeze and communication windows.\n- Data sync and validation steps.\n- DNS, traffic, and smoke tests.

## Rollback and Contingency
- Triggers and decision owners.\n- Backups and reverse replication.\n- Maximum tolerable downtime.

## Communication and Go/No-Go
- Stakeholders and update cadence.\n- Go/no-go checklist.\n- Post-cutover hypercare.

Rules:
- No cutover without a tested rollback path.
- Include data reconciliation, not only application health checks.
- Make go/no-go criteria explicit and owned.`,

  outputType: 'markdown',
}
