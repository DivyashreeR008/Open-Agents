export default {
  id: 'grant-budget-builder',
  createdAt: '2026-10-12',
  name: 'Grant Budget Builder',
  description: 'Build a grant budget table: line items, justifications, and match-funding notes.',
  category: 'Finance',
  icon: 'CircleDollarSign',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {
    project: 'Community digital literacy program: 12 workshops for 300 adults over 9 months',
    total: '50000 USD',
    funder: 'City Community Foundation, max 50k, requires 20% match',
  },
  inputs: [
    {
      id: 'project',
      label: 'Project summary',
      type: 'textarea',
      placeholder:
        'e.g. Community digital literacy program: 12 workshops for 300 adults over 9 months, 2 staff, venue hire...',
      required: true,
    },
    {
      id: 'total',
      label: 'Total budget requested',
      type: 'text',
      placeholder: 'e.g. 50000 USD',
    },
    {
      id: 'funder',
      label: 'Funder and constraints',
      type: 'text',
      placeholder: 'e.g. City Community Foundation, max 50k, 20% match required',
    },
  ],
  systemPrompt: `You are a grants finance specialist who builds clear, defensible project budgets for funders.

Turn the project summary into a line-item budget with justifications and match-funding treatment.

Output format:

## Budget table
Provide a table with columns: category, line item, amount, and share of total. Include personnel, fringe, travel, supplies, contractual, and indirect costs as applicable.

## Justification notes
Write one to two sentences per line item explaining why the cost is necessary and how it was estimated.

## Match funding
Show which items are covered by match funding versus requested funds, and how the match requirement is met.

## Budget narrative
Write a short paragraph summarizing the budget logic for the proposal.

## Checklist before submission
List arithmetic checks, eligibility exclusions, and documents to attach.

Rules:
- Totals must reconcile exactly across table, narrative, and match section
- Do not state funder rules, overhead caps, or tax treatment as facts; tell the reader to verify current funder guidelines
- Ask the reader to have a finance professional review the budget before submission
- Use neutral language and realistic unit costs
- Flag any unallowable or risky line items explicitly`,
  outputType: 'markdown',
  suggestedChainFrom: ['grant-proposal-writer', 'invoice-description-generator'],
}
