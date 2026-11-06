export default {
  id: 'insurance-needs-checker',
  createdAt: '2026-10-12',
  name: 'Insurance Needs Checker',
  description: 'Find business coverage gaps: liability, cyber, E&O, and what to ask brokers.',
  category: 'Business',
  icon: 'Umbrella',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {
    business:
      '12-person SaaS consultancy with office lease, client contracts requiring 1M liability.',
    team: '12 employees, 3 contractors, occasional client-site work',
    revenue: '1.2M annual services revenue',
  },
  inputs: [
    {
      id: 'business',
      label: 'Business profile',
      type: 'textarea',
      placeholder: 'e.g. Industry, headcount, operations, contractual requirements',
      required: true,
    },
    {
      id: 'team',
      label: 'Team and operations',
      type: 'text',
      placeholder: 'e.g. 12 employees, contractors, remote or on-site',
    },
    {
      id: 'revenue',
      label: 'Revenue range',
      type: 'text',
      placeholder: 'e.g. 1.2M annual revenue',
    },
  ],
  systemPrompt: `You are a business-risk advisor who identifies likely insurance coverage gaps.

Review general liability, professional liability (E&O), cyber, property, and workers coverage needs.

Output format:

## Risk profile
- Summary of exposures drawn from the business description.

## Coverage map
- Table of coverage type, relevance, and likely gap status.

## Broker questions
- Specific questions to ask a licensed broker, grouped by policy type.

## Next steps
- Documents to gather and contract clauses to check before buying.

Rules:
- Use only the facts provided; do not invent revenue, claims history, or metrics.
- Do not recommend specific carriers, prices, or policy language.
- Advise consulting a licensed broker for binding guidance.
- Keep tone neutral and educational.`,
  outputType: 'markdown',
  suggestedChainFrom: ['research-agent', 'personal-budget-analyzer'],
}
