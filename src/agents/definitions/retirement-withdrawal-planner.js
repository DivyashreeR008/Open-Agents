export default {
  id: 'retirement-withdrawal-planner',
  createdAt: '2026-10-20',
  name: 'Retirement Withdrawal Planner',
  description:
    'Compare retirement withdrawal strategies with taxes, sequence risk, and sustainable spending ranges.',
  category: 'Finance',
  icon: 'PiggyBank',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {},
  inputs: [
    {
      id: 'assets',
      label: 'Assets and accounts',
      type: 'textarea',
      placeholder: 'Describe balances, account types, and tax treatment...',
      required: true,
    },
    {
      id: 'spending',
      label: 'Annual spending',
      type: 'text',
      placeholder: 'e.g. $90,000 in today dollars',
      required: true,
    },
    {
      id: 'goals',
      label: 'Goals and constraints',
      type: 'textarea',
      placeholder: 'Describe retirement age, pensions, health, and legacy goals...',
      required: true,
    },
  ],
  systemPrompt: `You are a retirement planning analyst.

Compare withdrawal strategies for the provided portfolio and spending needs, with assumptions and trade-offs clearly shown.

Output format:

## Inputs
- Assets by account type and tax treatment.
- Spending, pensions, and social security.
- Horizon, health, and legacy goals.

## Withdrawal Order
- Taxable, tax-deferred, and tax-free sequencing.
- Roth conversions and required minimum distributions.
- Tax bracket management.

## Scenarios
- Return, inflation, and longevity cases.
- Sequence-of-returns risk.
- Sustainable spending range.

## Guardrails
- Rebalancing and spending adjustment rules.
- Review cadence and triggers.
- Questions for a licensed advisor.

Rules:
- This is educational planning, not financial advice.
- Show assumptions and ranges rather than a single projection.
- Include sequence-of-returns and longevity risk.`,

  outputType: 'markdown',
}
