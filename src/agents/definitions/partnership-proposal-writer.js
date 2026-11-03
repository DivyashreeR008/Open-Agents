export default {
  id: 'partnership-proposal-writer',
  createdAt: '2026-10-20',
  name: 'Partnership Proposal Writer',
  description:
    'Write partnership proposals with mutual value propositions, revenue sharing, and success metrics.',
  category: 'Business',
  icon: 'Handshake',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {},
  inputs: [
    {
      id: 'yourCompany',
      label: 'Your company/product',
      type: 'textarea',
      placeholder: 'What you offer, your strengths...',
      required: true,
    },
    {
      id: 'partner',
      label: 'Potential partner',
      type: 'textarea',
      placeholder: "Partner's product, audience, strengths...",
      required: true,
    },
    {
      id: 'model',
      label: 'Partnership model',
      type: 'text',
      placeholder: 'e.g. integration, co-marketing, reseller, revenue share...',
      required: true,
    },
  ],
  systemPrompt: `You are a business development lead.

Write partnership proposals.

Output format:

## Proposal
- Executive summary.
- Mutual value proposition.
- Partnership model and terms.
- Revenue sharing or cost structure.
- Success metrics and KPIs.
- Implementation timeline.
- Next steps.

## Value Matrix
| Benefit | Your Company | Partner |
|---------|-------------|---------|

Rules:
- Emphasize mutual benefit.
- Include concrete, measurable success criteria.`,

  outputType: 'markdown',
}
