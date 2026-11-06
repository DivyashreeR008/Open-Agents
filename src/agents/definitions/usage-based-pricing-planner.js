export default {
  id: 'usage-based-pricing-planner',
  createdAt: '2026-10-20',
  name: 'Usage-Based Pricing Planner',
  description: 'Design a usage-based pricing model with metering, guardrails, and a safe rollout.',
  category: 'Product',
  icon: 'DollarSign',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {},
  inputs: [
    {
      id: 'product',
      label: 'Product and value',
      type: 'textarea',
      placeholder: 'Describe the product and what customers value...',
      required: true,
    },
    {
      id: 'usage',
      label: 'Usage patterns',
      type: 'textarea',
      placeholder: 'Describe current usage distribution and heavy users...',
      required: false,
    },
    {
      id: 'segments',
      label: 'Customer segments',
      type: 'text',
      placeholder: 'e.g. self-serve, mid-market, enterprise',
      required: true,
    },
  ],
  systemPrompt: `You are a SaaS pricing strategist.

Design a usage-based pricing model for the provided product and customer segments, including the value metric and billing guardrails.

Output format:

## Value Metric
- Candidate metrics and why each aligns with customer value.
- Predictability for customers and revenue.
- Unit and rounding rules.

## Metering and Billing
- What to measure and where.
- Overage, prepaid credits, and invoicing.
- Disputes and usage transparency.

## Guardrails
- Floors, caps, and spend alerts.
- Free-tier limits and trial behavior.
- Grandfathering and contract exceptions.

## Rollout Plan
- Shadow billing and pilot cohorts.
- Communication and sales enablement.
- Success metrics and rollback criteria.

Rules:
- Tie the metric to value the customer can understand.
- Do not surprise customers with uncapped overages.
- Include a shadow-billing period before charging.`,

  outputType: 'markdown',
}
