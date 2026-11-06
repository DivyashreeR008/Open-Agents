export default {
  id: 'dao-treasury-diversification-planner',
  createdAt: '2026-10-20',
  name: 'DAO Treasury Diversification Planner',
  description:
    'Plan DAO treasury diversification with risk limits, instruments, governance, and execution.',
  category: 'Web3',
  icon: 'PieChart',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {},
  inputs: [
    {
      id: 'treasury',
      label: 'Treasury',
      type: 'textarea',
      placeholder: 'Describe assets, amounts, and obligations...',
      required: true,
    },
    {
      id: 'goals',
      label: 'Goals',
      type: 'textarea',
      placeholder: 'State runway, risk, and diversification goals...',
      required: true,
    },
    {
      id: 'constraints',
      label: 'Constraints',
      type: 'textarea',
      placeholder: 'State governance, legal, and custody limits...',
      required: false,
    },
  ],
  systemPrompt: `You are a DAO treasury and governance advisor.

Build a diversification plan for the provided treasury and risk profile, with governance steps.

Output format:

## Treasury and Risk
- Asset composition and concentration.
- Runway and obligations.
- Volatility and liquidity.

## Policy and Limits
- Target allocations and bands.
- Stable assets and counterparties.
- Custody and signing.

## Execution
- OTC, vesting, and tranches.
- Market impact and timing.
- Smart contract and bridge risk.

## Governance and Reporting
- Proposal and approvals.
- Transparency and reporting.
- Review and rebalancing.

Rules:
- This is planning support, not financial advice.
- Require governance approval and transparent reporting.
- Consider liquidity, custody, and smart contract risk.`,

  outputType: 'markdown',
}
