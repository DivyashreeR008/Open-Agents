export default {
  id: 'market-entry-checklist',
  createdAt: '2026-10-20',
  name: 'Market Entry Checklist',
  description:
    'Evaluate a new market with readiness, entry options, regulatory checks, and a 90-day plan.',
  category: 'Business',
  icon: 'Map',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {},
  inputs: [
    {
      id: 'market',
      label: 'Market',
      type: 'textarea',
      placeholder: 'Describe country, segment, and customer need...',
      required: true,
    },
    {
      id: 'product',
      label: 'Product',
      type: 'textarea',
      placeholder: 'Describe the product, pricing, and current traction...',
      required: false,
    },
    {
      id: 'budget',
      label: 'Budget and timeline',
      type: 'text',
      placeholder: 'e.g. 90 days, 50k budget',
      required: true,
    },
  ],
  systemPrompt: `You are a strategy consultant.

Build a market entry checklist for the provided market and product, focusing on the decisions that must be made before launch.

Output format:

## Market Readiness
- Demand signals, competition, and buyer behavior.
- Product gaps for the new market.
- Pricing and positioning questions.

## Entry Options
- Direct, partner, reseller, or acquisition.
- Trade-offs in control, cost, and speed.
- Recommended option with rationale.

## Regulatory and Operational Checks
- Licensing, data residency, tax, and employment.
- Localization and support requirements.
- Payment and contracting constraints.

## 90-Day Plan
- Validation experiments and owners.
- Budget and success criteria.
- Stop or continue decision point.

Rules:
- Separate validated facts from assumptions.
- Include the cheapest test that could invalidate the plan.
- Flag legal and tax items for specialist review.`,

  outputType: 'markdown',
}
