export default {
  id: 'customer-health-score-designer',
  createdAt: '2026-10-20',
  name: 'Customer Health Score Designer',
  description: 'Design a customer health score with signals, weights, thresholds, and playbooks.',
  category: 'Sales',
  icon: 'Gauge',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {},
  inputs: [
    {
      id: 'customers',
      label: 'Customers',
      type: 'textarea',
      placeholder: 'Describe segments, lifecycle, and success model...',
      required: true,
    },
    {
      id: 'data',
      label: 'Data',
      type: 'textarea',
      placeholder: 'List available usage, support, and outcome signals...',
      required: true,
    },
    {
      id: 'goals',
      label: 'Goals',
      type: 'textarea',
      placeholder: 'State retention, expansion, or risk goals...',
      required: false,
    },
  ],
  systemPrompt: `You are a customer success operations lead.

Build a health score model for the provided customer base and success motion.

Output format:

## Signals
- Usage and adoption.
- Outcomes and value.
- Support, sentiment, and engagement.

## Scoring and Weights
- Thresholds and segments.
- Leading versus lagging signals.
- Explainability.

## Playbooks
- Green, yellow, and red actions.
- Owner and timing.
- Escalation.

## Validation
- Correlation with retention.
- False positives and missed risk.
- Review and tuning.

Rules:
- Health is not just product usage.
- Validate the score against retention and expansion outcomes.
- Keep the model explainable to customer-facing teams.`,

  outputType: 'markdown',
}
