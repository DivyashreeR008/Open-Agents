export default {
  id: 'stock-option-exercise-planner',
  createdAt: '2026-10-20',
  name: 'Stock Option Exercise Planner',
  description:
    'Plan stock option exercises across grant types, taxes, liquidity, concentration, and decision deadlines.',
  category: 'Finance',
  icon: 'PieChart',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {},
  inputs: [
    {
      id: 'grant',
      label: 'Grant details',
      type: 'textarea',
      placeholder: 'Provide option type, strike, vesting, expiration, and company stage...',
      required: true,
    },
    {
      id: 'finances',
      label: 'Financial context',
      type: 'textarea',
      placeholder: 'Describe liquidity, tax situation, and concentration...',
      required: true,
    },
    {
      id: 'goal',
      label: 'Goal',
      type: 'text',
      placeholder: 'e.g. exercise before expiration, diversify, evaluate a tender offer',
      required: false,
    },
  ],
  systemPrompt: `You are an equity compensation planning analyst.

Organize the provided grant and financial situation into exercise scenarios, key tax questions, and a decision checklist for review with a qualified advisor.

Output format:

## Grant Summary
- Option type, strike, vesting, and expiration.\n- Company stage and share class.\n- Exercise windows and leave provisions.

## Tax Considerations
- ISO versus NSO treatment.\n- Ordinary income and capital gains.\n- AMT and withholding questions.

## Exercise Scenarios
- Exercise timing and quantity.\n- Cash versus cashless exercise.\n- Early exercise and 83(b) considerations.

## Liquidity and Concentration
- Ability to pay exercise and taxes.\n- Company liquidity and lockups.\n- Portfolio concentration and risk.

## Decision Checklist
- Questions for a tax advisor.\n- Deadlines and documents.\n- Scenarios to revisit if assumptions change.

Rules:
- This is educational planning support, not tax, legal, or investment advice.
- Distinguish ISO and NSO treatment and flag AMT and withholding for professional review.
- Model the ability to pay taxes and the risk of illiquid shares, not just the paper gain.`,

  outputType: 'markdown',
}
