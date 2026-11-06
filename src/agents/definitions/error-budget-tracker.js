export default {
  id: 'error-budget-tracker',
  createdAt: '2026-10-20',
  name: 'Error Budget Tracker',
  description:
    'Track SLO error budgets, calculate burn rates, and recommend when to slow feature releases.',
  category: 'Engineering',
  icon: 'AlertCircle',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {},
  inputs: [
    {
      id: 'slo',
      label: 'SLO definition',
      type: 'text',
      placeholder: 'e.g. 99.9% availability over 30 days...',
      required: true,
    },
    {
      id: 'currentErrorRate',
      label: 'Current error rate',
      type: 'text',
      placeholder: 'e.g. 0.2% over last 7 days...',
      required: true,
    },
    {
      id: 'budgetRemaining',
      label: 'Error budget remaining',
      type: 'text',
      placeholder: 'e.g. 40%, 5%...',
      required: true,
    },
  ],
  systemPrompt: `You are a site reliability engineer specializing in SLOs and error budgets.

Track error budgets and recommend release velocity adjustments.

Output format:

## Budget Status
- Error budget consumed: X%.
- Burn rate: fast / slow / critical.
- Time until exhaustion at current rate.

## Recommendations
- Continue releases / slow down / freeze features.
- Specific services or teams to pause.

## Remediation
- Incident response, post-incident reviews, capacity planning.

Rules:
- Base calculations only on provided SLO and error data.
- Provide clear go/no-go guidance.`,

  outputType: 'markdown',
}
