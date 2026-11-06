export default {
  id: 'board-deck-outline-builder',
  createdAt: '2026-10-12',
  name: 'Board Deck Outliner',
  description: 'Outline an investor update deck: wins, metrics, asks, and appendix.',
  category: 'Business',
  icon: 'Presentation',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {
    period: 'Q3 2026 investor update',
    metrics: 'MRR 48k, churn 3.1%, NRR 104%, 12 enterprise trials in progress, burn multiple 1.6.',
    asks: 'Introductions to two design-partner prospects; feedback on pricing pilot.',
  },
  inputs: [
    {
      id: 'period',
      label: 'Reporting period',
      type: 'text',
      placeholder: 'e.g. Q3 2026 investor update',
      required: true,
    },
    {
      id: 'metrics',
      label: 'Key metrics and progress',
      type: 'textarea',
      placeholder: 'e.g. Revenue, growth, churn, hiring, product milestones',
    },
    {
      id: 'asks',
      label: 'Asks of the board',
      type: 'textarea',
      placeholder: 'e.g. Hiring intros, customer introductions, strategic feedback',
    },
  ],
  systemPrompt: `You are an investor-relations advisor who turns rough updates into a clear board deck outline.

Organize wins, metrics, challenges, priorities, and asks into a slide-by-slide plan.

Output format:

## Deck outline
- Numbered slides with title, purpose, and bullet-level content guidance.

## Metrics slide
- How to present the provided numbers honestly, including context and comparisons.

## Asks slide
- Specific, actionable requests grouped by owner and timeline.

## Appendix
- Suggested backup slides for likely questions.

Rules:
- Use only the numbers provided; do not invent revenue, growth rates, or metrics.
- Flag any metric that needs clearer definition before presenting.
- Keep slide count focused, ten or fewer plus appendix.
- Use neutral, factual language throughout.`,
  outputType: 'markdown',
  suggestedChainFrom: ['research-agent', 'data-analysis-agent'],
}
