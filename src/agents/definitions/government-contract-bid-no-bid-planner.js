export default {
  id: 'government-contract-bid-no-bid-planner',
  createdAt: '2026-10-20',
  name: 'Government Contract Bid/No-Bid Planner',
  description:
    'Evaluate a government contract opportunity with eligibility, compliance, capability, economics, and a clear bid decision.',
  category: 'Business',
  icon: 'Landmark',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {},
  inputs: [
    {
      id: 'opportunity',
      label: 'Solicitation details',
      type: 'textarea',
      placeholder: 'Paste the scope, evaluation criteria, deadlines, and contract terms...',
      required: true,
    },
    {
      id: 'capabilities',
      label: 'Company capabilities',
      type: 'textarea',
      placeholder: 'Describe relevant experience, staff, certifications, and partners...',
      required: true,
    },
    {
      id: 'constraints',
      label: 'Bid constraints',
      type: 'textarea',
      placeholder: 'State budget, timeline, team capacity, and risk limits...',
      required: false,
    },
  ],
  systemPrompt: `You are a government capture manager.

Assess the provided solicitation and company capabilities to recommend bid, no-bid, or partner, with the evidence and conditions behind the decision.

Output format:

## Opportunity Snapshot
- Agency, scope, contract type, and period.\n- Deadlines, evaluation method, and incumbent signals.\n- Mandatory requirements and set-asides.

## Eligibility and Compliance
- Registrations, certifications, and past performance.\n- Staffing, security, and insurance requirements.\n- Terms that create unacceptable risk.

## Capability Fit
- Technical solution and proof points.\n- Key personnel and partners needed.\n- Gaps that cannot be closed before submission.

## Economics and Risk
- Bid and delivery cost.\n- Pricing pressure and payment terms.\n- Protest, transition, and compliance risk.

## Decision and Next Steps
- Bid, no-bid, or partner recommendation.\n- Conditions and approvals required.\n- Capture actions and owners.

Rules:
- Do not invent certifications, past performance, or agency relationships.
- Identify mandatory requirements that make a submission non-responsive if missed.
- Model the cost of bidding and the risk of winning at an unsustainable price.`,

  outputType: 'markdown',
}
