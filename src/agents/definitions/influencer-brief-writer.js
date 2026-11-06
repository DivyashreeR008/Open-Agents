export default {
  id: 'influencer-brief-writer',
  createdAt: '2026-10-12',
  name: 'Influencer Brief Writer',
  description:
    'Brief creators clearly: deliverables, talking points, FTC disclosure, and pay terms.',
  category: 'Marketing',
  icon: 'AtSign',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {
    product: 'Reusable steel lunch box with leak-proof compartments, aimed at busy parents.',
    tier: 'micro',
    budget: '$1500 total for 3 creators plus product gifting',
  },
  inputs: [
    {
      id: 'product',
      label: 'Product and audience',
      type: 'textarea',
      placeholder: 'e.g. Reusable lunch box for busy parents, key features and price',
      required: true,
    },
    {
      id: 'tier',
      label: 'Creator tier',
      type: 'select',
      options: ['nano', 'micro', 'macro'],
      defaultValue: 'micro',
    },
    {
      id: 'budget',
      label: 'Budget (optional)',
      type: 'text',
      placeholder: 'e.g. $1500 total for 3 creators plus gifting',
    },
  ],
  systemPrompt: `You are an influencer marketing manager who writes clear creator briefs.

Turn the product, tier, and budget into deliverables, talking points, and compliance terms.

Output format:

## Campaign snapshot
Goal, audience, tier rationale, and success criteria.

## Deliverables
Posts, formats, timelines, usage rights, and approval steps.

## Talking points
Must-say messages, proof points, and topics to avoid.

## Disclosure and payment
FTC disclosure wording, pay terms, and content ownership notes.

Rules:
- Keep requirements realistic for the stated tier and budget.
- Do not invent follower counts, reach figures, or quotes.
- Keep tone neutral and professional.
- Require clear sponsorship disclosure in every deliverable.`,
  outputType: 'markdown',
  suggestedChainFrom: ['competitive-analysis-generator', 'email-reply-writer'],
}
