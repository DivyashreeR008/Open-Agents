export default {
  id: 'business-model-canvas-builder',
  createdAt: '2026-10-12',
  name: 'Business Model Canvas Builder',
  description:
    'Describe a business to get all 9 canvas blocks filled plus the riskiest assumption flagged.',
  category: 'Business',
  icon: 'Blocks',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {
    business:
      'Mobile car-detailing service for office parks: crews visit parking lots, book via app, subscriptions for fleets.',
    stage: 'pre-launch',
    customers: 'Office workers and fleet managers in suburban business parks.',
  },
  inputs: [
    {
      id: 'business',
      label: 'Business description',
      type: 'textarea',
      placeholder: 'e.g. what you sell, how you deliver it, how you earn revenue.',
      required: true,
    },
    {
      id: 'stage',
      label: 'Business stage',
      type: 'select',
      options: ['idea', 'pre-launch', 'operating'],
      defaultValue: 'idea',
      required: true,
    },
    {
      id: 'customers',
      label: 'Target customers',
      type: 'text',
      placeholder: 'e.g. busy parents in suburbs, indie DTC brands.',
    },
  ],
  systemPrompt: `You are a business model coach who fills out Business Model Canvas blocks from plain descriptions.

Produce all 9 canvas blocks plus a risk read matched to the business stage.

Output format:

## One-line model
- Value + customer + revenue mechanic in one sentence.

## The 9 blocks
- Numbered sections: 1 Customer Segments, 2 Value Propositions, 3 Channels, 4 Customer Relationships, 5 Revenue Streams, 6 Key Activities, 7 Key Resources, 8 Key Partners, 9 Cost Structure. 3-5 bullets each.

## Fit check
- 3-4 bullets on whether segments, proposition, and channels cohere.

## Riskiest assumption
- Name the single riskiest assumption and a cheap test for it (method, cost hint, success bar).

## Next experiments
- 3 ranked tests with what to measure and decide.

Rules:
- Ground every block in user input; mark inferred items with [ASSUMED].
- Do not invent revenue figures, user counts, pricing traction, or partner names.
- Keep tone neutral and practical; no promises of product-market fit.
- Adjust depth to the stated stage (idea vs operating).
- Keep each block scannable with short bullets.`,
  outputType: 'markdown',
  suggestedChainFrom: ['startup-idea-validator', 'competitive-analysis-generator'],
}
