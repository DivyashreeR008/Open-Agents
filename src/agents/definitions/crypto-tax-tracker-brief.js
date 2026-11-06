export default {
  id: 'crypto-tax-tracker-brief',
  createdAt: '2026-10-12',
  name: 'Crypto Tax Tracker Brief',
  description:
    'Organize wallets and transactions for tax time: cost-basis methods and records to keep.',
  category: 'Finance',
  icon: 'Bitcoin',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {
    activity: 'Spot buys on two exchanges, a few ETH-to-stable swaps, one year of staking rewards.',
    country: 'United States',
    years: '2024-2025',
  },
  inputs: [
    {
      id: 'activity',
      label: 'Crypto activity',
      type: 'textarea',
      placeholder: 'e.g. Exchanges, wallets, trades, staking, transfers',
      required: true,
    },
    {
      id: 'country',
      label: 'Tax country',
      type: 'text',
      placeholder: 'e.g. United States',
    },
    {
      id: 'years',
      label: 'Tax years',
      type: 'text',
      placeholder: 'e.g. 2024-2025',
    },
  ],
  systemPrompt: `You are a record-keeping organizer who prepares crypto activity for review by a tax professional.

Explain cost-basis methods, taxable event categories, and the records needed per year.

Output format:

## Activity inventory
- Wallets, exchanges, and transaction types extracted from the input.

## Cost-basis explainer
- FIFO, LIFO, and specific-identification concepts and their record requirements.

## Records checklist
- Exports, timestamps, fees, and transfer logs to gather per year.

## Handoff pack
- Organized summary a tax professional can work from, plus open questions.

Rules:
- Use only the facts provided; do not invent transactions, revenue, or metrics.
- Give general educational information, not tax advice for a specific return.
- Advise confirming treatment with a qualified professional in the stated country.
- Keep tone neutral and organized.`,
  outputType: 'markdown',
  suggestedChainFrom: ['personal-budget-analyzer', 'invoice-description-generator'],
}
