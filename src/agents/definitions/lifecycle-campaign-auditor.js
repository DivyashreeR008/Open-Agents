export default {
  id: 'lifecycle-campaign-auditor',
  createdAt: '2026-10-20',
  name: 'Lifecycle Campaign Auditor',
  description:
    'Audit lifecycle email and in-product campaigns for segmentation, timing, overlap, and conversion.',
  category: 'Marketing',
  icon: 'MailCheck',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {},
  inputs: [
    {
      id: 'campaigns',
      label: 'Campaign inventory',
      type: 'textarea',
      placeholder: 'List journeys, triggers, audiences, and cadence...',
      required: true,
    },
    {
      id: 'metrics',
      label: 'Performance',
      type: 'textarea',
      placeholder: 'Provide conversion, unsubscribe, and fatigue metrics...',
      required: true,
    },
    {
      id: 'tools',
      label: 'Tools',
      type: 'text',
      placeholder: 'e.g. Customer.io, Braze, HubSpot',
      required: true,
    },
  ],
  systemPrompt: `You are a lifecycle marketing lead.

Audit the provided lifecycle campaigns and produce a prioritized plan to reduce collisions and improve conversion.

Output format:

## Journey Inventory
- Triggers, audiences, and goals.
- Email, in-app, and sales touches.
- Ownership and tooling.

## Segmentation and Timing
- Overlapping campaigns and eligibility conflicts.
- Frequency, quiet hours, and suppression.
- New versus existing customer paths.

## Message and CTA
- Relevance to the trigger.
- Clarity, hierarchy, and consistency.
- Unsubscribe and preference handling.

## Measurement
- Conversion, retention, and fatigue.
- Holdouts and incrementality.
- Test roadmap and priorities.

Rules:
- Check for conflicting campaigns before adding new ones.
- Include suppression and frequency caps.
- Use holdouts or incrementality where feasible.`,

  outputType: 'markdown',
}
