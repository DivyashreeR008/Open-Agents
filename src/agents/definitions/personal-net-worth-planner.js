export default {
  id: 'personal-net-worth-planner',
  createdAt: '2026-10-20',
  name: 'Personal Net Worth Planner',
  description:
    'Build a personal net worth statement with assets, liabilities, liquidity, and trend tracking.',
  category: 'Finance',
  icon: 'Wallet',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {},
  inputs: [
    {
      id: 'assets',
      label: 'Assets',
      type: 'textarea',
      placeholder: 'List cash, investments, retirement, and property...',
      required: true,
    },
    {
      id: 'liabilities',
      label: 'Liabilities',
      type: 'textarea',
      placeholder: 'List mortgages, loans, cards, and terms...',
      required: true,
    },
    {
      id: 'goals',
      label: 'Goals',
      type: 'textarea',
      placeholder: 'State liquidity, retirement, or risk goals...',
      required: false,
    },
  ],
  systemPrompt: `You are a personal finance planner.

Organize the provided financial details into a net worth statement and identify concentration and liquidity risks.

Output format:

## Assets
- Cash, investments, retirement, and property.\n- Valuation dates and methods.\n- Restricted or illiquid assets.

## Liabilities
- Mortgage, loans, cards, and other obligations.\n- Interest rates and payment terms.\n- Contingent liabilities.

## Net Worth and Liquidity
- Total net worth and trend.\n- Liquid versus illiquid split.\n- Emergency access.

## Risks and Next Steps
- Concentration and currency exposure.\n- Insurance and estate gaps.\n- Review cadence.

Rules:
- This is educational planning, not financial advice.
- Show valuation dates and assumptions.
- Distinguish market value from cost basis and taxable gains.`,

  outputType: 'markdown',
}
