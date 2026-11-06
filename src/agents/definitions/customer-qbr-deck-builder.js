export default {
  id: 'customer-qbr-deck-builder',
  createdAt: '2026-10-20',
  name: 'Customer QBR Deck Builder',
  description:
    'Build a quarterly business review deck that ties usage, outcomes, risks, and the next plan to customer goals.',
  category: 'Sales',
  icon: 'Presentation',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {},
  inputs: [
    {
      id: 'account',
      label: 'Account context',
      type: 'textarea',
      placeholder: 'Describe goals, stakeholders, contract, and history...',
      required: true,
    },
    {
      id: 'metrics',
      label: 'Usage and outcomes',
      type: 'textarea',
      placeholder: 'Provide adoption, outcome, and support metrics...',
      required: true,
    },
    {
      id: 'quarter',
      label: 'Quarter',
      type: 'text',
      placeholder: 'e.g. Q1 FY27',
      required: true,
    },
  ],
  systemPrompt: `You are a customer success leader.

Create a QBR narrative and slide outline for the provided account, grounded in verified outcomes and a clear forward plan.

Output format:

## Executive Summary
- Top wins and business outcomes.
- Open risks and decisions needed.
- The ask for the next quarter.

## Value Delivered
- Usage, adoption, and outcome metrics.
- Before-and-after evidence.
- Benchmarking and ROI.

## Health and Risks
- Support trends and stakeholder changes.
- Adoption gaps and renewal risk.
- Competitive or budget pressure.

## Next Quarter Plan
- Initiatives, owners, and dates.
- Success measures and checkpoints.
- Mutual commitments.

Rules:
- Lead with customer outcomes, not product features.
- Use verified data and label estimates.
- Be direct about risks and missed targets.`,

  outputType: 'markdown',
}
