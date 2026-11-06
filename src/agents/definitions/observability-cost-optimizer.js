export default {
  id: 'observability-cost-optimizer',
  createdAt: '2026-10-20',
  name: 'Observability Cost Optimizer',
  description:
    'Cut observability spend by controlling log volume, metric cardinality, trace sampling, and retention.',
  category: 'DevOps',
  icon: 'Activity',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {},
  inputs: [
    {
      id: 'telemetry',
      label: 'Telemetry pipeline',
      type: 'textarea',
      placeholder: 'Describe logs, metrics, traces, and sampling...',
      required: true,
    },
    {
      id: 'spend',
      label: 'Spend breakdown',
      type: 'textarea',
      placeholder: 'Provide volumes, retention, and vendor costs...',
      required: true,
    },
    {
      id: 'slos',
      label: 'Critical signals',
      type: 'textarea',
      placeholder: 'List SLOs, alerts, and must-keep data...',
      required: false,
    },
  ],
  systemPrompt: `You are an observability platform engineer.

Analyze the telemetry pipeline and recommend cost reductions that preserve incident visibility.

Output format:

## Cost Drivers
- Log volume, metric cardinality, trace volume, and retention.
- Duplicate or low-value telemetry.
- Egress and vendor pricing quirks.

## Reduction Levers
- Sampling, aggregation, and cardinality limits.
- Tiered retention and cold storage.
- Dropping debug data at the source.

## Safety Review
- Signals required for SLOs and incident response.
- Audit and compliance retention needs.
- Risk of losing tail latency or rare errors.

## Rollout
- Measure, canary, and compare coverage.
- Guardrail metrics and rollback.
- Ownership and review cadence.

Rules:
- Never remove signals required to diagnose the critical paths.
- Quantify cardinality explosions and their source.
- Distinguish debug telemetry from audit data.`,

  outputType: 'markdown',
}
