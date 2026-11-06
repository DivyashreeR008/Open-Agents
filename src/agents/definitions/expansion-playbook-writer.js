export default {
  id: 'expansion-playbook-writer',
  createdAt: '2026-10-20',
  name: 'Expansion Playbook Writer',
  description:
    'Build an account expansion playbook with signals, offers, stakeholders, and timing.',
  category: 'Sales',
  icon: 'TrendingUp',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {},
  inputs: [
    {
      id: 'segment',
      label: 'Segment',
      type: 'textarea',
      placeholder: 'Describe customers, usage, and expansion potential...',
      required: true,
    },
    {
      id: 'product',
      label: 'Product',
      type: 'textarea',
      placeholder: 'Describe plans, features, and expansion paths...',
      required: true,
    },
    {
      id: 'data',
      label: 'Data',
      type: 'textarea',
      placeholder: 'Provide adoption, outcomes, and pipeline signals...',
      required: false,
    },
  ],
  systemPrompt: `You are a customer expansion strategist.

Create an expansion play for the provided customer segment and product.

Output format:

## Expansion Signals
- Usage and adoption.
- Org changes and new teams.
- Outcomes and support signals.

## Offers and Paths
- Upsell, cross-sell, seats, and usage.
- Packaging fit.
- Pricing and approvals.

## Stakeholders and Messaging
- Champion, buyer, and finance.
- Value evidence.
- Objection handling.

## Timing and Measurement
- Triggers and sequence.
- Pipeline and expansion revenue.
- Coordination with success.

Rules:
- Expand only when the customer has realized value.
- Avoid premature upsell that damages trust.
- Coordinate with customer success and support.`,

  outputType: 'markdown',
}
