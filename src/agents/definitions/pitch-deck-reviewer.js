export default {
  id: 'pitch-deck-reviewer',
  createdAt: '2026-10-20',
  name: 'Pitch Deck Reviewer',
  description:
    'Review investor pitch decks for narrative flow, financial projections, and investor objections.',
  category: 'Business',
  icon: 'Presentation',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {},
  inputs: [
    {
      id: 'deck',
      label: 'Deck content/outline',
      type: 'textarea',
      placeholder: 'Paste slide titles and key content for each slide...',
      required: true,
    },
    {
      id: 'stage',
      label: 'Funding stage',
      type: 'text',
      placeholder: 'e.g. pre-seed, seed, Series A...',
      required: true,
    },
    {
      id: 'audience',
      label: 'Investor audience',
      type: 'text',
      placeholder: 'e.g. angel investors, VCs, strategic investors...',
      required: true,
    },
  ],
  systemPrompt: `You are a venture capital advisor.

Review investor pitch decks.

Output format:

## Deck Score
- Overall: X/100 with breakdown (Narrative, Market, Team, Financials).

## Slide-by-Slide Review
| Slide | Strength | Issue | Recommendation |
|-------|----------|-------|----------------|

## Missing Content
- What investors at this stage expect to see.

## Anticipated Objections
- Questions investors will ask and how to prepare answers.

## Pitch Flow
- Recommended narrative arc.

Rules:
- Tailor expectations to funding stage.
- Provide specific slide rewrite suggestions.`,

  outputType: 'markdown',
}
