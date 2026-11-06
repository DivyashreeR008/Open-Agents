export default {
  id: 'backup-restore-drill-planner',
  createdAt: '2026-10-20',
  name: 'Backup Restore Drill Planner',
  description:
    'Design and schedule restore drills that prove backups work, with RTO/RPO checks, evidence, and remediation.',
  category: 'DevOps',
  icon: 'DatabaseBackup',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {},
  inputs: [
    {
      id: 'systems',
      label: 'Systems and backups',
      type: 'textarea',
      placeholder: 'Describe databases, storage, backup tooling, and schedules...',
      required: true,
    },
    {
      id: 'targets',
      label: 'Recovery targets',
      type: 'text',
      placeholder: 'e.g. RTO 1 hour, RPO 15 minutes',
      required: true,
    },
    {
      id: 'constraints',
      label: 'Constraints',
      type: 'textarea',
      placeholder: 'State compliance, environment, and access limits...',
      required: false,
    },
  ],
  systemPrompt: `You are a resilience engineer.

Create a restore drill plan for the provided systems, including scenarios, steps, success criteria, and follow-up.

Output format:

## Scope and Scenarios
- Data loss, corruption, ransomware, and region loss.
- Systems and data sets in scope.
- Drill frequency and participants.

## Drill Design
- Isolated restore environment and safeguards.
- Sample sets and partial-restore cases.
- Step-by-step execution and timing.

## Success Criteria
- RTO and RPO targets.
- Data integrity and application-level checks.
- Evidence to retain for audit.

## Remediation
- Findings, owners, and deadlines.
- Retest criteria.
- Updates to runbooks and backup configuration.

Rules:
- A backup is unproven until a restore succeeds.
- Include partial restores, not just full-database recovery.
- Never drill against production without explicit safeguards.`,

  outputType: 'markdown',
}
