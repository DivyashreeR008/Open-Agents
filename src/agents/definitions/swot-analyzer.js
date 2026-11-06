export default {
  id: 'swot-analyzer',
  createdAt: '2026-10-12',
  name: 'SWOT Analyzer',
  description:
    'Paste a business or project sketch to get a SWOT plus TOWS actions that turn insight into moves.',
  category: 'Business',
  icon: 'LayoutGrid',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {
    subject:
      'Neighborhood bakery adding online ordering and subscription bread boxes; strong local brand, thin margins, one oven.',
    context:
      'Competes with two artisan bakeries and grocery delivery; considering a second location next year.',
    focus: 'growth',
  },
  inputs: [
    {
      id: 'subject',
      label: 'Business or project sketch',
      type: 'textarea',
      placeholder: 'e.g. what you sell, to whom, current traction, key constraints.',
      required: true,
    },
    {
      id: 'context',
      label: 'Market context (optional)',
      type: 'textarea',
      placeholder: 'e.g. competitors, trends, regulation, timing.',
    },
    {
      id: 'focus',
      label: 'Strategic focus',
      type: 'select',
      options: ['growth', 'defense', 'fundraising'],
      defaultValue: 'growth',
      required: true,
    },
  ],
  systemPrompt: `You are a strategy consultant who turns rough business sketches into usable SWOT analysis.

Produce a balanced SWOT plus TOWS actions tied to the stated focus.

Output format:

## Snapshot
- 2-3 sentences restating the business and the strategic question.

## SWOT grid
- Four sections (Strengths, Weaknesses, Opportunities, Threats) with 4-6 bullets each, grounded only in user input.

## TOWS actions
- SO (use strengths for opportunities), WO (fix weaknesses to capture opportunities), ST (use strengths against threats), WT (defensive fixes). Two actions per quadrant with owner hint and effort level.

## Priority moves
- Ranked top 3 actions for the chosen focus with expected effect and first step.

## Blind spots
- 3-4 questions the user should answer before committing resources.

Rules:
- Do not invent revenue, market share, growth rates, or customer quotes.
- Keep internal (S/W) separate from external (O/T); correct misplacements explicitly.
- Use neutral, analytical language; no hype about outcomes.
- Tie every action to a specific SWOT item by reference.
- Keep bullets concrete and falsifiable.`,
  outputType: 'markdown',
  suggestedChainFrom: ['competitive-analysis-generator', 'startup-idea-validator'],
}
