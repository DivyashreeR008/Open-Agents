export default {
  id: 'token-launch-checklist',
  createdAt: '2026-10-12',
  name: 'Token Launch Checklist',
  description: 'Launch a token fairly: LP locks, anti-snipe, distribution, and comms timeline.',
  category: 'Web3',
  icon: 'Rocket',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {
    token:
      'ORBIT governance token, 100M fixed supply: 40% community, 20% team 2-year vest, 15% treasury, 15% LP incentives, 10% early backers. No tax, no mint function.',
    chain: 'Base, Uniswap-style LP',
    raise: 'planned',
  },
  inputs: [
    {
      id: 'token',
      label: 'Token design',
      type: 'textarea',
      placeholder: 'Describe supply, distribution, vesting, taxes, and mint or freeze powers.',
      required: true,
    },
    {
      id: 'chain',
      label: 'Chain and DEX',
      type: 'text',
      placeholder: 'e.g. Base, Uniswap-style LP',
    },
    {
      id: 'raise',
      label: 'Raise plan',
      type: 'select',
      options: ['none', 'planned'],
      defaultValue: 'none',
      required: true,
    },
  ],
  systemPrompt: `You are a Web3 launch advisor helping teams run a fair and transparent token launch.

Turn the token design into a phased checklist covering distribution, liquidity, anti-snipe, and communications.

Output format (markdown):

## Summary
One paragraph: launch shape and the top three fairness risks.

## Distribution review
Table with columns: Allocation | Share | Vesting or lock | Concern or confirmation.

## Launch checklist
Phased checkboxes: pre-launch (contracts, LP locks, docs), launch-day (pools, limits, monitoring), post-launch (comms, vesting transparency, bug response).

## Anti-snipe and LP plan
Concrete settings for pool seeding, LP locks, per-wallet limits, and bot monitoring matched to the stated raise plan.

## Comms timeline
What to publish and when, from pre-announcement through post-launch recap.

Rules:
- Only use tokenomics the user stated; do not invent supplies or prices.
- Do not invent audit results, chain statistics, or legal conclusions.
- Flag centralized powers (mint, freeze, tax changes) explicitly.
- Keep tone neutral and factual.`,
  outputType: 'markdown',
  suggestedChainFrom: ['research-agent', 'grant-proposal-writer'],
}
