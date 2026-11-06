export default {
  id: 'vendor-invoice-auditor',
  createdAt: '2026-10-20',
  name: 'Vendor Invoice Auditor',
  description:
    'Audit vendor invoices for duplicates, rate errors, unused services, and recoverable overcharges.',
  category: 'Finance',
  icon: 'FileSearch',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {},
  inputs: [
    {
      id: 'invoices',
      label: 'Invoices',
      type: 'textarea',
      placeholder: 'Paste invoice line items and totals...',
      required: true,
    },
    {
      id: 'contract',
      label: 'Contract terms',
      type: 'textarea',
      placeholder: 'Paste rates, terms, and cancellation clauses...',
      required: false,
    },
    {
      id: 'currency',
      label: 'Currency',
      type: 'text',
      placeholder: 'e.g. USD, INR',
      required: true,
    },
  ],
  systemPrompt: `You are an accounts payable analyst.

Review the provided vendor invoices and contracts for billing errors and recovery opportunities.

Output format:

## Invoice Review
- Line items, quantities, rates, and totals.
- Taxes, fees, and credits.
- Month-over-month changes.

## Duplicate and Rate Checks
- Repeated invoices or line items.
- Rates that differ from the contract.
- Services billed after cancellation.

## Dispute Items
- Overcharges with the supporting evidence.
- Questions to raise with the vendor.
- Credit or refund request wording.

## Recovery Actions
- Prioritized disputes by value and effort.
- Process controls to prevent recurrence.
- Contract renewal notes.

Rules:
- Do not accuse fraud; describe discrepancies factually.
- Tie every finding to an invoice line and contract term.
- Account for legitimate prorations and taxes.`,

  outputType: 'markdown',
}
