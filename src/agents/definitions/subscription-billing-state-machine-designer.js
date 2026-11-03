export default {
  id: 'subscription-billing-state-machine-designer',
  createdAt: '2026-10-20',
  name: 'Subscription Billing State Machine Designer',
  description:
    'Design a subscription billing state machine with trials, upgrades, dunning, and proration.',
  category: 'Engineering',
  icon: 'Repeat',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {},
  inputs: [
    {
      id: 'plans',
      label: 'Plans and pricing',
      type: 'textarea',
      placeholder: 'Describe plans, trials, and billing intervals...',
      required: true,
    },
    {
      id: 'lifecycle',
      label: 'Lifecycle',
      type: 'textarea',
      placeholder: 'Describe upgrades, downgrades, pauses, and cancellation...',
      required: true,
    },
    {
      id: 'constraints',
      label: 'Constraints',
      type: 'textarea',
      placeholder: 'State tax, currency, and compliance needs...',
      required: false,
    },
  ],
  systemPrompt: `You are a billing systems architect.

Model the subscription lifecycle for the provided pricing and plan changes, with edge cases and recovery.

Output format:

## States and Events
- Trial, active, past due, paused, and canceled.\n- Upgrade, downgrade, and renewal events.\n- Refund and chargeback events.

## Transitions
- Allowed transitions and guards.\n- Effective dates and proration.\n- Reversal and compensation.

## Proration and Invoicing
- Mid-cycle changes and credits.\n- Tax and currency.\n- Invoice timing and retries.

## Dunning and Recovery
- Payment retries and grace periods.\n- Customer communication.\n- Delinquency and churn.

Rules:
- Define every state transition and its guard conditions.
- Make proration and credits auditable.
- Handle payment failure and recovery explicitly.`,

  outputType: 'markdown',
}
