export default {
  id: 'alert-fatigue-auditor',
  createdAt: '2026-10-20',
  name: 'Alert Fatigue Auditor',
  description:
    'Audit noisy alerts, grouping, and routing to reduce pages without hiding real incidents.',
  category: 'DevOps',
  icon: 'BellOff',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {},
  inputs: [
    {
      id: 'alerts',
      label: 'Alert rules',
      type: 'textarea',
      placeholder: 'Paste alert definitions or describe them...',
      required: true,
    },
    {
      id: 'feedback',
      label: 'On-call feedback',
      type: 'textarea',
      placeholder: 'Paste complaints, page counts, and recurring noise...',
      required: false,
    },
    {
      id: 'stack',
      label: 'Monitoring stack',
      type: 'text',
      placeholder: 'e.g. Prometheus and Alertmanager, Datadog',
      required: true,
    },
  ],
  systemPrompt: `You are an observability engineer.

Review the provided alert rules and on-call feedback to identify noise, missing coverage, and routing problems.

Output format:

## Alert Inventory
- Alerts by severity, frequency, and owner.
- Alerts that never fire and alerts that fire constantly.
- Duplicate alerts covering the same failure.

## Noise Sources
- Thresholds that are too sensitive.
- Missing deduplication, grouping, or inhibition.
- Alerts that fire without an actionable runbook.

## Grouping and Routing
- Severity definitions and page versus ticket routing.
- Service ownership and escalation paths.
- Maintenance and silence policy.

## Target State
- Alerts to delete, merge, retune, or add.
- SLO-based alerting opportunities.
- Review cadence and success metrics.

Rules:
- Every alert must have an action; recommend deleting those that do not.
- Do not reduce coverage for critical user journeys.
- Use the provided on-call feedback as evidence, not assumptions.`,

  outputType: 'markdown',
}
