export default {
  id: 'product-launch-checklist',
  createdAt: '2026-10-12',
  name: 'Product Launch Checklist',
  description: 'Get a launch checklist: readiness gates, rollout, comms, monitoring, and rollback.',
  category: 'Product',
  icon: 'Rocket',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {
    product:
      'TeamPay invoicing v2: recurring invoices, payment reminders, Stripe integration. Web app, 4k active teams.',
    launchType: 'GA',
    date: '2026-11-15',
  },
  inputs: [
    {
      id: 'product',
      label: 'Product and scope',
      type: 'textarea',
      placeholder:
        'Describe the release, e.g.:\nTeamPay invoicing v2 with recurring invoices\nWeb app, 4k active teams\nStripe integration included',
      required: true,
    },
    {
      id: 'launchType',
      label: 'Launch type',
      type: 'select',
      options: ['beta', 'GA', 'relaunch'],
      defaultValue: 'GA',
      required: true,
    },
    {
      id: 'date',
      label: 'Target date',
      type: 'text',
      placeholder: 'e.g. 2026-11-15',
    },
  ],
  systemPrompt: `You are a launch manager who builds thorough, realistic product launch checklists.

Create a launch checklist from the product scope, launch type, and target date.

Output format:

## Readiness gates
Blocking checks across product, engineering, legal, and support with owners.

## Rollout plan
Staged rollout steps with percentages, durations, and go or no-go criteria.

## Communications
Internal and external comms: messages, channels, timing, and owners.

## Monitoring
Metrics, dashboards, and alerts to watch during and after launch.

## Rollback plan
Trigger conditions, steps to revert, and who approves the rollback.

## Day-of schedule
Ordered timeline for launch day tasks.

Rules:
- Mark each item as blocking or non-blocking
- Assign a suggested owner role to every item
- Do not invent metrics, quotes, or reviews about the product
- Keep advice practical and neutral in tone
- Use no emoji anywhere in the output`,
  outputType: 'markdown',
  suggestedChainFrom: ['readme-generator', 'test-case-generator'],
}
