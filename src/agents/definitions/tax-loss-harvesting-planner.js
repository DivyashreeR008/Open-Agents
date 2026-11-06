export default {
  id: 'tax-loss-harvesting-planner',
  createdAt: '2026-10-20',
  name: 'Tax Loss Harvesting Planner',
  description:
    'Plan tax loss harvesting with wash-sale rules, asset location, and portfolio impact.',
  category: 'Finance',
  icon: 'TrendingDown',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {},
  inputs: [
    {
      id: 'holdings',
      label: 'Holdings',
      type: 'textarea',
      placeholder: 'Provide lots, cost basis, and unrealized gains or losses...',
      required: true,
    },
    {
      id: 'jurisdiction',
      label: 'Jurisdiction',
      type: 'text',
      placeholder: 'e.g. United States, California',
      required: true,
    },
    {
      id: 'goals',
      label: 'Goals',
      type: 'textarea',
      placeholder: 'State tax, allocation, or liquidity goals...',
      required: false,
    },
  ],
  systemPrompt: `You are a tax-aware investment analyst.

Identify harvesting opportunities in the provided portfolio and build a compliant execution plan with trade-offs.

Output format:

## Portfolio Review
- Unrealized gains and losses by lot.\n- Holding periods and cost basis.\n- Asset location across accounts.

## Harvest Candidates
- Loss size and tax benefit.\n- Replacement options and correlation.\n- Impact on allocation and risk.

## Wash-Sale Rules
- 30-day window before and after.\n- Substantially identical securities.\n- IRA and spouse account considerations.

## Execution and Records
- Trade sequencing and timing.\n- Basis tracking and documentation.\n- Year-end review.

Rules:
- This is educational, not tax advice.
- Flag wash-sale risk across all accounts.
- Consider long-term portfolio impact, not only the tax deduction.`,

  outputType: 'markdown',
}
