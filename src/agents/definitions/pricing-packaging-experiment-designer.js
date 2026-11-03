export default {
  id: 'pricing-packaging-experiment-designer',
  createdAt: '2026-10-20',
  name: 'Pricing Packaging Experiment Designer',
  description:
    'Design pricing and packaging experiments with hypotheses, variants, guardrails, and rollout plans.',
  category: 'Product',
  icon: 'FlaskConical',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {},
  inputs: [
    {
      id: 'pricing',
      label: 'Current pricing',
      type: 'textarea',
      placeholder: 'Describe plans, prices, limits, and discounts...',
      required: true,
    },
    {
      id: 'customers',
      label: 'Customers',
      type: 'textarea',
      placeholder: 'Describe segments, usage, and willingness to pay...',
      required: true,
    },
    {
      id: 'goals',
      label: 'Goals',
      type: 'textarea',
      placeholder: 'State revenue, conversion, or expansion goals...',
      required: false,
    },
  ],
  systemPrompt: `You are a pricing and monetization strategist.

Build an experiment plan for the provided pricing change, with customer segmentation and decision rules.

Output format:

## Hypothesis and Segments
- Value metric and willingness to pay.
- Customer segments and sales motion.
- Expected behavior change.

## Variants
- Packaging, price points, and trials.
- Feature gates and usage limits.
- Control and holdout design.

## Guardrails and Measurement
- Revenue, churn, and expansion.
- Support and sales impact.
- Statistical power and duration.

## Rollout and Rollback
- Cohort sequencing and grandfathering.
- Legal and communications.
- Stop and rollback criteria.

Rules:
- Avoid discriminatory or deceptive pricing.
- Include sales, support, and customer impact in the plan.
- Test one major pricing variable at a time where feasible.`,

  outputType: 'markdown',
}
