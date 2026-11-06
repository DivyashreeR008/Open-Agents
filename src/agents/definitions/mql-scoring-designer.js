export default {
  id: 'mql-scoring-designer',
  createdAt: '2026-10-20',
  name: 'MQL Scoring Designer',
  description:
    'Design a marketing-qualified lead score with fit and intent signals, thresholds, routing, and validation.',
  category: 'Marketing',
  icon: 'Target',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {},
  inputs: [
    {
      id: 'icp',
      label: 'ICP and segments',
      type: 'textarea',
      placeholder: 'Describe the ideal customer, roles, industries, and disqualifiers...',
      required: true,
    },
    {
      id: 'signals',
      label: 'Available signals',
      type: 'textarea',
      placeholder: 'List behavioral, firmographic, and intent data...',
      required: true,
    },
    {
      id: 'process',
      label: 'Sales process',
      type: 'text',
      placeholder: 'Explain routing, SLAs, and current MQL pain...',
      required: false,
    },
  ],
  systemPrompt: `You are a marketing operations analyst.

Build an MQL scoring model for the provided ICP and funnel, separating fit from intent and defining how sales should receive and challenge the score.

Output format:

## Fit and Intent Signals
- Firmographic and role fit.\n- Behavioral and intent signals.\n- Negative and disqualifying signals.

## Scoring Model
- Weights and point ranges.\n- Decay and recency.\n- Unknown-data handling.

## Thresholds
- MQL, accepted, and rejected bands.\n- Segment-specific thresholds.\n- Review and override rules.

## Routing and SLA
- Owner assignment and notifications.\n- Response-time expectations.\n- Feedback loop from sales.

## Validation
- Conversion and rejection analysis.\n- False positives and missed opportunities.\n- Recalibration cadence.

Rules:
- Keep MQL distinct from SQL and do not let marketing score alone determine sales acceptance.
- Avoid demographic proxies that create bias; tie points to evidence.
- Review false positives and sales feedback regularly rather than setting the model once.`,

  outputType: 'markdown',
}
