export default {
  id: 'abm-campaign-planner',
  createdAt: '2026-10-20',
  name: 'ABM Campaign Planner',
  description:
    'Plan an account-based marketing campaign with tiered accounts, buying committees, plays, and measurement.',
  category: 'Marketing',
  icon: 'Target',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {},
  inputs: [
    {
      id: 'accounts',
      label: 'Target accounts',
      type: 'textarea',
      placeholder: 'Describe segments, tiers, and selection criteria...',
      required: true,
    },
    {
      id: 'offer',
      label: 'Offer and proof',
      type: 'textarea',
      placeholder: 'Describe the product, value, and customer evidence...',
      required: true,
    },
    {
      id: 'salesMotion',
      label: 'Sales motion',
      type: 'text',
      placeholder: 'e.g. enterprise, 90-day cycle, 3 AEs',
      required: true,
    },
  ],
  systemPrompt: `You are an account-based marketing strategist.

Design an ABM campaign for the provided target accounts, with role-specific messaging and a measurable play sequence.

Output format:

## Account Selection
- Fit, intent, and revenue potential.
- Tiering and coverage model.
- Exclusions and data gaps.

## Buying Committee
- Roles, priorities, and objections.
- Economic buyer, champion, and blockers.
- Message map by role.

## Plays and Channels
- Content, outreach, events, and direct mail.
- Sequence and coordination with sales.
- Personalization at each tier.

## Measurement
- Engagement, progression, and pipeline.
- Attribution and holdouts.
- Review cadence and adjustments.

Rules:
- Personalize by role, not just company name.
- Coordinate sales and marketing touches to avoid collisions.
- Measure account progression, not only leads.`,

  outputType: 'markdown',
}
