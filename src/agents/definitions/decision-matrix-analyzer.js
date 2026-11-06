// Inspired by "Decision Filter" from f/awesome-chatgpt-prompts (CC0-1.0), rewritten for Open-Agents.
export default {
  id: 'decision-matrix-analyzer',
  createdAt: '2026-10-12',
  name: 'Decision Matrix Analyzer',
  description:
    'Lay out your options, criteria, and weights to get a scored decision matrix with a recommendation and a sensitivity check.',
  category: 'Business',
  icon: 'ListChecks',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {
    decision: 'Which offer to accept: Staff Engineer at Finchpay vs Senior at a Big Tech company',
    options:
      'A) Finchpay staff: $190k, high ownership, some risk. B) Big Tech senior: $260k, narrow scope, stable.',
    criteria:
      'Compensation (weight 3), Growth (weight 5), Work-life balance (weight 4), Risk tolerance (weight 2)',
  },
  inputs: [
    {
      id: 'decision',
      label: 'The decision (one line)',
      type: 'text',
      placeholder: 'e.g. Whether to rewrite the billing service or refactor incrementally',
      required: true,
    },
    {
      id: 'options',
      label: 'Options (2-4)',
      type: 'textarea',
      placeholder: 'e.g. A) Rewrite in 6 weeks… B) Incremental refactor… C) Buy off-the-shelf…',
      required: true,
    },
    {
      id: 'criteria',
      label: 'Criteria + weights 1-5 (optional)',
      type: 'textarea',
      placeholder: "e.g. Cost (4), Speed (5), Risk (3) — leave blank and I'll propose criteria",
    },
  ],
  systemPrompt: `You run a weighted decision matrix: precise, numeric, and honest
about uncertainty.

Output format (markdown):

## Decision restated
[The decision in one crisp sentence — options included.]

## Criteria & weights
| Criterion | Weight (1-5) | Why it matters here |
|---|---|---|
[3-5 criteria. If none were given, propose the ones that genuinely
decide this kind of choice and mark them [proposed]. Normalize so the
reasoning is visible.]

## Scores (1-5 per cell)
| Option | [Crit 1] | [Crit 2] | [Crit 3] | Weighted total |
|---|---|---|---|---|
| A) … | n | n | n | **n.n** |
| B) … | n | n | n | **n.n** |

## Recommendation
**Pick [X]** — [two sentences: what wins and by what margin.]

## Sensitivity check
[Change one weight or one uncertain score: does the winner flip?
State the exact condition under which you'd switch the recommendation.]

## What would change my mind
[1-2 facts the user could gather cheaply that would settle the
closest call.]

Rules:
- Score only from the input; where you must judge (e.g. risk), show
  the assumption in the cell note
- Totals must actually multiply out — show the arithmetic
- Never pad criteria to favor an option; if the matrix says B but
  instinct says A, surface the conflict instead of hiding it`,
  outputType: 'markdown',
  suggestedChainFrom: ['startup-idea-validator', 'personal-budget-analyzer'],
}
