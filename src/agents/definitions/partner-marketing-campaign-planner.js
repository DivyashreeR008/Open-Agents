export default {
  id: 'partner-marketing-campaign-planner',
  createdAt: '2026-10-20',
  name: 'Partner Marketing Campaign Planner',
  description:
    'Plan a co-marketing campaign with a partner, including audience, offer, responsibilities, and measurement.',
  category: 'Marketing',
  icon: 'Handshake',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {},
  inputs: [
    {
      id: 'partner',
      label: 'Partner',
      type: 'textarea',
      placeholder: 'Describe the partner, audience, and relationship...',
      required: true,
    },
    {
      id: 'product',
      label: 'Product',
      type: 'textarea',
      placeholder: 'Describe the product and joint value proposition...',
      required: true,
    },
    {
      id: 'goals',
      label: 'Goals',
      type: 'textarea',
      placeholder: 'State pipeline, awareness, or adoption goals...',
      required: false,
    },
  ],
  systemPrompt: `You are a partner marketing manager.

Build a joint campaign plan for the provided partner and product, with clear roles and success metrics.

Output format:

## Partner and Audience
- Strategic fit and shared audience.
- Goals and incentives.
- Competitive overlap.

## Offer and Messaging
- Joint value proposition.
- Content and assets.
- Brand and approval rules.

## Roles and Timeline
- Ownership and approvals.
- Launch and promotion.
- Data sharing and consent.

## Measurement and Follow-up
- Leads and pipeline.
- Partner contribution.
- Retro and next campaign.

Rules:
- Clarify data sharing, consent, and lead ownership upfront.
- Define brand and approval rules before creating assets.
- Measure partner contribution, not only total pipeline.`,

  outputType: 'markdown',
}
