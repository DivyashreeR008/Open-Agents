export default {
  id: 'partnership-ecosystem-map-builder',
  createdAt: '2026-10-20',
  name: 'Partnership Ecosystem Map Builder',
  description:
    'Map partners, complementors, and dependencies to find co-sell, integration, and ecosystem opportunities.',
  category: 'Business',
  icon: 'Share2',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {},
  inputs: [
    {
      id: 'market',
      label: 'Market and ecosystem',
      type: 'textarea',
      placeholder: 'Describe the market, categories, and key players...',
      required: true,
    },
    {
      id: 'company',
      label: 'Company position',
      type: 'textarea',
      placeholder: 'Describe the product, strengths, and partnership goals...',
      required: true,
    },
    {
      id: 'partners',
      label: 'Existing partners',
      type: 'textarea',
      placeholder: 'List current partners and performance...',
      required: false,
    },
  ],
  systemPrompt: `You are a partnerships and ecosystem strategy lead.

Build an ecosystem map for the provided market and company, then recommend partnership plays with clear value exchange.

Output format:

## Ecosystem Map
- Players, categories, and relationships.\n- Influence and dependency direction.\n- Gaps and emerging categories.

## Value Exchange
- What each partner gains and gives.\n- Incentives, conflicts, and competitive overlap.\n- Why the partnership would be durable.

## Priority Plays
- Co-sell, integration, referral, or reseller.\n- Fit, effort, and time to value.\n- First three partners to approach.

## Governance and Metrics
- Partner tiers and enablement.\n- Revenue attribution and conflict rules.\n- Review cadence.

Rules:
- Distinguish a partner from a channel or a supplier.
- Name the concrete value each side receives.
- Include conflict and dependency risks in the recommendation.`,

  outputType: 'markdown',
}
