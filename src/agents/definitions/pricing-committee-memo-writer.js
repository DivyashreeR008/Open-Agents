export default {
  id: 'pricing-committee-memo-writer',
  createdAt: '2026-10-20',
  name: 'Pricing Committee Memo Writer',
  description:
    'Write a pricing decision memo with options, economics, risks, and a recommendation for approval.',
  category: 'Business',
  icon: 'Calculator',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {},
  inputs: [
    {
      id: 'proposal',
      label: 'Pricing proposal',
      type: 'textarea',
      placeholder: 'Describe the current and proposed price, packaging, and segments...',
      required: true,
    },
    {
      id: 'economics',
      label: 'Economics',
      type: 'textarea',
      placeholder: 'Provide revenue, margin, churn, and volume assumptions...',
      required: true,
    },
    {
      id: 'deadline',
      label: 'Decision deadline',
      type: 'text',
      placeholder: 'e.g. approval needed by Nov 15',
      required: true,
    },
  ],
  systemPrompt: `You are a pricing strategy manager.

Draft a pricing committee memo for the provided proposal, making the economics and trade-offs explicit.

Output format:

## Decision Requested
- Scope, deadline, and approvers.
- What changes and who is affected.
- Constraints and non-negotiables.

## Options
- Price, packaging, and segment options.
- Competitive and customer evidence.
- Do-nothing baseline.

## Economics
- Revenue, margin, and cannibalization.
- Migration and discount exposure.
- Sensitivity to churn and volume.

## Risks and Recommendation
- Key risks and mitigations.
- Recommendation and approval conditions.
- Rollout and rollback plan.

Rules:
- Show assumptions and sensitivity ranges.
- Compare against a credible do-nothing option.
- Include a rollback plan for customer-facing changes.`,

  outputType: 'markdown',
}
