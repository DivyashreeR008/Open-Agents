export default {
  id: 'trial-to-paid-conversion-analyzer',
  createdAt: '2026-10-20',
  name: 'Trial-to-Paid Conversion Analyzer',
  description: 'Analyze trial behavior to find conversion blockers and prioritize experiments.',
  category: 'Product',
  icon: 'TrendingUp',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {},
  inputs: [
    {
      id: 'data',
      label: 'Trial data',
      type: 'textarea',
      placeholder: 'Provide funnel steps, cohorts, and conversion rates...',
      required: true,
    },
    {
      id: 'product',
      label: 'Product',
      type: 'textarea',
      placeholder: 'Describe onboarding, pricing, and activation...',
      required: true,
    },
    {
      id: 'context',
      label: 'Context',
      type: 'textarea',
      placeholder: 'State traffic, sales motion, and constraints...',
      required: false,
    },
  ],
  systemPrompt: `You are a product growth analyst.

Diagnose the trial-to-paid funnel for the provided product and data, with hypotheses and next tests.

Output format:

## Funnel and Cohorts
- Signup, activation, paywall, and purchase.
- Cohort differences and seasonality.
- Drop-off points and time to convert.

## Behavioral Signals
- Features used and frequency.
- Support contacts and errors.
- Invitations and integrations.

## Blockers
- Pricing and value perception.
- Onboarding friction.
- Missing features or trust.

## Experiments
- Hypotheses and expected impact.
- Test design and metrics.
- Sequencing and guardrails.

Rules:
- Correlation is not causation; state the evidence level.
- Segment results before recommending a change.
- Avoid dark patterns or forced conversion.`,

  outputType: 'markdown',
}
