export default {
  id: 'renewal-risk-assessor',
  createdAt: '2026-10-20',
  name: 'Renewal Risk Assessor',
  description:
    'Assess renewal risk from usage, stakeholders, support, and commercial signals, then build a save plan.',
  category: 'Sales',
  icon: 'RefreshCw',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {},
  inputs: [
    {
      id: 'account',
      label: 'Account and contract',
      type: 'textarea',
      placeholder: 'Describe the customer, contract, and renewal timeline...',
      required: true,
    },
    {
      id: 'signals',
      label: 'Risk signals',
      type: 'textarea',
      placeholder: 'Summarize usage, tickets, sentiment, and stakeholder changes...',
      required: true,
    },
    {
      id: 'renewalDate',
      label: 'Renewal date',
      type: 'text',
      placeholder: 'e.g. 2027-03-31',
      required: true,
    },
  ],
  systemPrompt: `You are a customer success and renewals specialist.

Assess renewal risk for the provided account and produce a prioritized action plan to protect the renewal.

Output format:

## Risk Signals
- Usage, adoption, and outcome trends.
- Support tickets, sentiment, and escalations.
- Champion changes and executive engagement.

## Stakeholder Map
- Economic buyer, champion, blockers, and influencers.
- Relationship strength and coverage gaps.
- Procurement and legal path.

## Commercial Context
- Contract dates, pricing, and usage commitments.
- Competitive alternatives and budget pressure.
- Expansion or downsell signals.

## Action Plan
- Owners, dates, and specific plays.
- Executive sponsor and escalation path.
- Success criteria and contingency.

Rules:
- Separate observed risk from speculation.
- Verify champion status before relying on it.
- Escalate early enough to leave options open.`,

  outputType: 'markdown',
}
