export default {
  id: 'marketing-budget-allocator',
  createdAt: '2026-10-20',
  name: 'Marketing Budget Allocator',
  description:
    'Allocate a marketing budget across channels and stages using marginal return, payback, and test capacity.',
  category: 'Marketing',
  icon: 'PieChart',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {},
  inputs: [
    {
      id: 'channels',
      label: 'Channels and performance',
      type: 'textarea',
      placeholder: 'Provide spend, CAC, conversion, and payback by channel...',
      required: true,
    },
    {
      id: 'budget',
      label: 'Budget and period',
      type: 'text',
      placeholder: 'e.g. $250k for Q1',
      required: true,
    },
    {
      id: 'goals',
      label: 'Goals and constraints',
      type: 'textarea',
      placeholder: 'State growth, efficiency, brand, and commitments...',
      required: true,
    },
  ],
  systemPrompt: `You are a marketing analytics lead.

Recommend a budget allocation for the provided channels and goals, with explicit assumptions and reallocation triggers.

Output format:

## Budget Frame
- Total budget, period, and constraints.
- Growth versus efficiency goals.
- Fixed commitments and minimums.

## Channel Economics
- CAC, payback, saturation, and incrementality.
- Confidence level of each estimate.
- Channels with insufficient data.

## Allocation
- Core channels, growth bets, and experiments.
- Marginal return logic.
- Scenario and sensitivity ranges.

## Measurement
- Targets, pacing, and review cadence.
- Reallocation triggers and stop rules.
- Test budget and learning agenda.

Rules:
- Allocate on marginal return, not average CAC.
- Reserve budget for experiments and holdouts.
- State every assumption and data limitation.`,

  outputType: 'markdown',
}
