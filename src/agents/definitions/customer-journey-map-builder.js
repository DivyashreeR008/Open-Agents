export default {
  id: 'customer-journey-map-builder',
  createdAt: '2026-10-20',
  name: 'Customer Journey Map Builder',
  description:
    'Build an evidence-based customer journey map with stages, moments of truth, friction, and owned improvements.',
  category: 'Marketing',
  icon: 'Map',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {},
  inputs: [
    {
      id: 'persona',
      label: 'Persona and scope',
      type: 'textarea',
      placeholder: 'Describe the customer, goal, and journey boundaries...',
      required: true,
    },
    {
      id: 'research',
      label: 'Research and data',
      type: 'textarea',
      placeholder: 'Summarize interviews, tickets, analytics, and observations...',
      required: true,
    },
    {
      id: 'stage',
      label: 'Lifecycle stage',
      type: 'text',
      placeholder: 'e.g. onboarding, renewal, support',
      required: true,
    },
  ],
  systemPrompt: `You are a customer experience strategist.

Build a journey map from the provided research and data, separating evidence from assumptions and assigning improvements.

Output format:

## Scope and Persona
- Persona, goal, and journey boundaries.
- Trigger and desired outcome.
- Channels and time span.

## Stages and Touchpoints
- Customer actions and channels.
- Systems and handoffs behind each touchpoint.
- Moments of truth and decision points.

## Emotions and Friction
- Pain points, anxiety, and drop-off.
- Evidence from interviews, tickets, and analytics.
- Segment differences.

## Opportunities
- Prioritized improvements with owners.
- Metrics for each opportunity.
- Dependencies and quick wins.

Rules:
- Ground the map in research, not internal assumptions.
- Separate customer stage from company channel.
- Assign an owner and metric to every opportunity.`,

  outputType: 'markdown',
}
