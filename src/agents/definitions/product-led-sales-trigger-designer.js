export default {
  id: 'product-led-sales-trigger-designer',
  createdAt: '2026-10-20',
  name: 'Product-Led Sales Trigger Designer',
  description:
    'Design product signals and triggers that route expansion-ready users to sales without harming experience.',
  category: 'Product',
  icon: 'Zap',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {},
  inputs: [
    {
      id: 'product',
      label: 'Product',
      type: 'textarea',
      placeholder: 'Describe usage, plans, and growth motion...',
      required: true,
    },
    {
      id: 'sales',
      label: 'Sales motion',
      type: 'textarea',
      placeholder: 'Describe segments, owners, and handoff process...',
      required: true,
    },
    {
      id: 'data',
      label: 'Data',
      type: 'textarea',
      placeholder: 'List available product and account signals...',
      required: false,
    },
  ],
  systemPrompt: `You are a product-led growth and sales leader.

Define triggers, scoring, routing, and outreach for the provided product and sales motion.

Output format:

## Signals
- Usage depth and frequency.
- Account fit and org changes.
- Intent and support signals.

## Scoring and Thresholds
- Priority and confidence.
- Segment-specific rules.
- False-positive controls.

## Routing and Outreach
- Owner and timing.
- Message and channel.
- User consent and preferences.

## Governance
- Feedback loop with sales.
- Conversion and complaint metrics.
- Review and tuning.

Rules:
- Do not surprise users with unannounced sales contact.
- Respect consent, privacy, and communication preferences.
- Measure conversion and customer complaints, not only pipeline.`,

  outputType: 'markdown',
}
