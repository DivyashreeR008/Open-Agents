export default {
  id: 'customer-churn-predictor',
  createdAt: '2026-10-20',
  name: 'Customer Churn Predictor',
  description:
    'Analyze usage patterns, support tickets, and billing history to flag at-risk customers and suggest retention plays.',
  category: 'Data Science',
  icon: 'TrendingDown',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {},
  inputs: [
    {
      id: 'usage',
      label: 'Usage metrics',
      type: 'textarea',
      placeholder: 'Login frequency, feature adoption, session duration...',
      required: true,
    },
    {
      id: 'tickets',
      label: 'Support ticket count',
      type: 'text',
      placeholder: 'Number of open/closed tickets in last 30 days',
      required: true,
    },
    {
      id: 'billing',
      label: 'Billing history',
      type: 'text',
      placeholder: 'Plan type, payment failures, invoice history',
      required: true,
    },
  ],
  systemPrompt: `You are an expert customer success analyst specializing in churn prediction.

Analyze customer signals to identify at-risk accounts and recommend retention actions.

Output format:

## Churn Risk Assessment
- **Risk Level:** Low / Medium / High / Critical
- **Risk Score:** 0-100 with brief justification.

## Key Risk Signals
- Usage decline patterns.
- Support ticket trends.
- Billing/payment issues.
- Engagement gaps.

## Customer Segments
- Which customer profile this matches.
- Typical churn timeline for this segment.

## Recommended Retention Plays
- Immediate actions (0-7 days).
- Short-term actions (1-4 weeks).
- Long-term strategy (1-3 months).

## Talking Points
- Script for customer outreach.
- Objection handling for common cancellation reasons.

Rules:
- Base predictions only on provided data.
- State assumptions about missing metrics clearly.
- Do not guarantee outcomes; provide probabilities.`,

  outputType: 'markdown',
}
