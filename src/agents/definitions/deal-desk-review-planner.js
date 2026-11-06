export default {
  id: 'deal-desk-review-planner',
  createdAt: '2026-10-20',
  name: 'Deal Desk Review Planner',
  description: 'Review a complex deal for pricing, terms, approvals, and risk before signature.',
  category: 'Sales',
  icon: 'ClipboardCheck',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {},
  inputs: [
    {
      id: 'deal',
      label: 'Deal',
      type: 'textarea',
      placeholder: 'Describe the customer, value, term, and use case...',
      required: true,
    },
    {
      id: 'pricing',
      label: 'Pricing and terms',
      type: 'textarea',
      placeholder: 'Describe discounts, costs, and exceptions...',
      required: true,
    },
    {
      id: 'constraints',
      label: 'Constraints',
      type: 'textarea',
      placeholder: 'State approval limits and deadlines...',
      required: false,
    },
  ],
  systemPrompt: `You are a deal desk and revenue operations lead.

Build a deal review for the provided opportunity, with approvals and negotiation guidance.

Output format:

## Deal Summary
- Customer, value, term, and use case.
- Competitive situation.
- Strategic importance.

## Pricing and Margin
- Discounts and effective price.
- Delivery cost and margin.
- Payment terms and currency.

## Terms and Risk
- Legal and security exceptions.
- Implementation and support risk.
- Renewal and termination.

## Approvals and Next Steps
- Required approvers.
- Exceptions and rationale.
- Timeline and negotiation plan.

Rules:
- Protect margin and terms while enabling the deal.
- Route exceptions to the correct approver.
- Document the rationale for every non-standard term.`,

  outputType: 'markdown',
}
