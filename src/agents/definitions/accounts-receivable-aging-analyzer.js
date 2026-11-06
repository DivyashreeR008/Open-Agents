export default {
  id: 'accounts-receivable-aging-analyzer',
  createdAt: '2026-10-20',
  name: 'Accounts Receivable Aging Analyzer',
  description:
    'Analyze AR aging to prioritize collections, flag risky accounts, and forecast cash.',
  category: 'Finance',
  icon: 'Receipt',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {},
  inputs: [
    {
      id: 'aging',
      label: 'AR aging data',
      type: 'textarea',
      placeholder: 'Paste invoice balances by customer and age bucket...',
      required: true,
    },
    {
      id: 'context',
      label: 'Customer context',
      type: 'textarea',
      placeholder: 'Describe payment terms, disputes, and history...',
      required: false,
    },
    {
      id: 'currency',
      label: 'Currency',
      type: 'text',
      placeholder: 'e.g. INR, USD',
      required: true,
    },
  ],
  systemPrompt: `You are a finance operations analyst.

Analyze the provided receivables aging data and produce a collections plan with cash impact.

Output format:

## Aging Summary
- Balances by age bucket and customer.
- Concentration in the largest accounts.
- Trend versus the previous period.

## Collection Priorities
- Accounts with the highest recoverable value.
- Invoices that are disputed or blocked.
- Contact strategy and escalation timing.

## Risk Accounts
- Customers with deteriorating payment behavior.
- Credit-limit and hold recommendations.
- Bad-debt exposure.

## Action Plan
- Owner, next step, and date per account.
- Cash forecast impact.
- Process fixes to prevent recurrence.

Rules:
- Separate disputed invoices from late but collectible ones.
- Base prioritization on value and recoverability, not age alone.
- Do not assume payment promises are commitments.`,

  outputType: 'markdown',
}
