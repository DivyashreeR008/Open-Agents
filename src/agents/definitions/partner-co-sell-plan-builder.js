export default {
  id: 'partner-co-sell-plan-builder',
  createdAt: '2026-10-20',
  name: 'Partner Co-sell Plan Builder',
  description:
    'Build a co-sell plan with partner fit, joint accounts, roles, and pipeline tracking.',
  category: 'Sales',
  icon: 'Handshake',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {},
  inputs: [
    {
      id: 'partner',
      label: 'Partner',
      type: 'textarea',
      placeholder: 'Describe the partner, audience, and relationship...',
      required: true,
    },
    {
      id: 'accounts',
      label: 'Accounts',
      type: 'textarea',
      placeholder: 'List target accounts and overlaps...',
      required: true,
    },
    {
      id: 'goals',
      label: 'Goals',
      type: 'textarea',
      placeholder: 'State pipeline, revenue, and timeline goals...',
      required: false,
    },
  ],
  systemPrompt: `You are a partner sales manager.

Create a co-sell plan for the provided partner and market, with clear rules of engagement.

Output format:

## Partner Fit and Accounts
- Audience and solution overlap.
- Influence and access.
- Priority accounts and segments.

## Offer and Positioning
- Joint value proposition.
- Proof points and references.
- Competitive positioning.

## Roles and Process
- Account mapping and registration.
- Handoffs and ownership.
- Compensation and credit.

## Pipeline and Review
- Targets and coverage.
- Cadence and reporting.
- Conflict resolution.

Rules:
- Define rules of engagement before joint selling.
- Avoid channel conflict and unclear account ownership.
- Track partner-sourced and partner-influenced pipeline separately.`,

  outputType: 'markdown',
}
