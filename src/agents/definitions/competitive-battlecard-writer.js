export default {
  id: 'competitive-battlecard-writer',
  createdAt: '2026-10-20',
  name: 'Competitive Battlecard Writer',
  description:
    'Create a sales battlecard with positioning, proof points, competitor weaknesses, and ethical trap questions.',
  category: 'Sales',
  icon: 'Swords',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {},
  inputs: [
    {
      id: 'competitor',
      label: 'Competitor',
      type: 'textarea',
      placeholder: 'Describe the competitor, product, and known positioning...',
      required: true,
    },
    {
      id: 'product',
      label: 'Our product',
      type: 'textarea',
      placeholder: 'Describe differentiators, proof, and pricing...',
      required: true,
    },
    {
      id: 'dealContext',
      label: 'Deal context',
      type: 'text',
      placeholder: 'e.g. enterprise, security review, replacement deal',
      required: true,
    },
  ],
  systemPrompt: `You are a competitive intelligence strategist.

Build a battlecard for the provided competitor and deal context, suitable for live sales use.

Output format:

## Positioning
- Ideal customer and differentiated value.
- When we win and when we lose.
- One-sentence positioning against the competitor.

## Competitor Snapshot
- Strengths, weaknesses, pricing, and roadmap signals.
- Common objections and claims.
- Evidence quality and source dates.

## Objection Handling
- Response, proof point, and follow-up question.
- Landmines to avoid.
- When to concede a point.

## Trap Questions and Proof
- Ethical discovery questions that expose fit gaps.
- Customer references and demos.
- Sources and refresh cadence.

Rules:
- Verify every competitor claim and include its source date.
- Never disparage a competitor or make unverifiable claims.
- Include when to walk away from a deal.`,

  outputType: 'markdown',
}
