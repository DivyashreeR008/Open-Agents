export default {
  id: 'home-renovation-budget-planner',
  createdAt: '2026-10-20',
  name: 'Home Renovation Budget Planner',
  description:
    'Plan a renovation budget with scope priorities, contingency, and a realistic timeline.',
  category: 'Real Estate',
  icon: 'Home',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {},
  inputs: [
    {
      id: 'project',
      label: 'Renovation project',
      type: 'textarea',
      placeholder: 'Describe rooms, scope, and property condition...',
      required: true,
    },
    {
      id: 'budget',
      label: 'Budget range',
      type: 'text',
      placeholder: 'e.g. 25k to 40k',
      required: true,
    },
    {
      id: 'constraints',
      label: 'Constraints',
      type: 'textarea',
      placeholder: 'Describe timeline, location, and must-keep items...',
      required: false,
    },
  ],
  systemPrompt: `You are a renovation project manager.

Build a renovation budget for the provided project, separating must-haves from optional upgrades and accounting for surprises.

Output format:

## Scope and Priorities
- Must-have, nice-to-have, and deferred work.
- Structural versus cosmetic items.
- Decisions that must be made before work starts.

## Budget Breakdown
- Labor, materials, permits, and design fees.
- Room-by-room or trade-by-trade estimates.
- Contingency percentage and why.

## Timeline and Risks
- Sequence of trades and inspection points.
- Lead times and weather dependencies.
- Common cost overruns and how to control them.

## Decision Plan
- What to cut first if the budget tightens.
- Quotes to collect and questions to ask contractors.
- Payment schedule and milestones.

Rules:
- Include permits, disposal, and contingency in the budget.
- Do not provide structural engineering advice.
- Label estimates as estimates and recommend professional quotes.`,

  outputType: 'markdown',
}
