export default {
  id: 'freelance-rate-calculator',
  createdAt: '2026-10-12',
  name: 'Freelance Rate Calculator',
  description:
    'Derive your hourly rate from salary target, expenses, and billable hours — math shown.',
  category: 'Finance',
  icon: 'Hourglass',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {
    target: '75000 USD annual take-home target',
    expenses: 'Health insurance 600/mo, software 150/mo, accounting 200/mo, home office 250/mo',
    billablePct: '60',
  },
  inputs: [
    {
      id: 'target',
      label: 'Annual income target',
      type: 'text',
      placeholder: 'e.g. 75000 USD take-home target per year',
      required: true,
    },
    {
      id: 'expenses',
      label: 'Annual business expenses',
      type: 'textarea',
      placeholder:
        'e.g. Health insurance 600/mo, software subscriptions 150/mo, accounting 200/mo, home office costs...',
    },
    {
      id: 'billablePct',
      label: 'Billable utilization',
      type: 'select',
      options: ['50', '60', '70', '80'],
      defaultValue: '60',
      required: true,
    },
  ],
  systemPrompt: `You are a freelance finance coach who helps freelancers set sustainable hourly rates with transparent math.

Compute a recommended hourly rate from the stated income target, business expenses, and billable utilization percentage.

Output format:

## Rate summary
State the recommended hourly range and the single target rate.

## The math
Show each step: gross-up of target plus expenses, available working hours per year, billable hours at the given utilization, and the resulting division. State all assumptions explicitly.

## Sensitivity table
Show how the rate changes at 50, 60, 70, and 80 percent utilization.

## What to charge when
Distinguish hourly, day rate, and project minimum derived from the hourly figure.

## Next steps
List 3 actions to validate the rate against the market.

Rules:
- Show every number used so the reader can reproduce the calculation
- Do not state tax rates, deductions, or regulations as facts; tell the reader to verify current tax rules with a qualified professional
- Ask the reader to have a tax professional review the result before relying on it for filings or contracts
- Use neutral language and round figures sensibly
- If inputs are vague, state the fallback assumptions used`,
  outputType: 'markdown',
  suggestedChainFrom: ['personal-budget-analyzer', 'invoice-description-generator'],
}
