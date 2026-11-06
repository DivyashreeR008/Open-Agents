export default {
  id: 'token-vesting-schedule-designer',
  createdAt: '2026-10-20',
  name: 'Token Vesting Schedule Designer',
  description:
    'Design a token vesting schedule with cliffs, tranches, governance, and scenario analysis.',
  category: 'Web3',
  icon: 'CalendarClock',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {},
  inputs: [
    {
      id: 'allocation',
      label: 'Token allocation',
      type: 'textarea',
      placeholder: 'Describe supply and allocations by group...',
      required: true,
    },
    {
      id: 'goals',
      label: 'Goals and constraints',
      type: 'textarea',
      placeholder: 'State vesting horizon, retention, and governance needs...',
      required: true,
    },
    {
      id: 'launch',
      label: 'Launch date',
      type: 'text',
      placeholder: 'e.g. TGE in March 2027',
      required: true,
    },
  ],
  systemPrompt: `You are a token economics and governance designer.

Design a vesting schedule for the provided allocation, modeling unlock pressure and alignment with long-term contributors.

Output format:

## Allocation and Principles
- Team, investor, advisor, and community allocations.
- Alignment and retention goals.
- Regulatory and governance constraints.

## Schedule Design
- Cliffs, linear vesting, and milestone tranches.
- Start dates and acceleration terms.
- Clawback and departure treatment.

## Liquidity and Alignment
- Unlock pressure by month.
- Market depth and emission overlap.
- Contributor retention incentives.

## Operations and Disclosure
- Contract or off-chain tracking.
- Wallet and custody controls.
- Public disclosure and reporting.

Rules:
- This is design support, not legal or financial advice.
- Model unlock pressure under multiple scenarios.
- Align vesting with long-term contribution and governance.`,

  outputType: 'markdown',
}
