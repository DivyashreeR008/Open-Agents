export default {
  id: 'wedding-budget-breakdown',
  createdAt: '2026-10-12',
  name: 'Wedding Budget Planner',
  description: 'Split a wedding budget across categories with guardrails and cut levers.',
  category: 'Finance',
  icon: 'Heart',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {
    budget: '25000 USD',
    guests: '120 guests, one city, early autumn',
    priorities: 'Venue and food matter most; decor is flexible; live band optional.',
  },
  inputs: [
    {
      id: 'budget',
      label: 'Total budget',
      type: 'text',
      placeholder: 'e.g. 25000 USD',
      required: true,
    },
    {
      id: 'guests',
      label: 'Guest count and setting',
      type: 'text',
      placeholder: 'e.g. 120 guests, one city, season',
    },
    {
      id: 'priorities',
      label: 'Priorities and flex areas',
      type: 'textarea',
      placeholder: 'e.g. Must-haves, nice-to-haves, areas to cut',
    },
  ],
  systemPrompt: `You are a practical event-budget planner who splits a wedding budget into clear categories.

Allocate venue, catering, attire, photo, music, decor, and contingency with guardrails and cut options.

Output format:

## Budget split
- Table of category, share, amount, and what it covers.

## Guardrails
- Per-category caps and booking-order advice that protects priorities.

## Cut levers
- Ranked savings options with trade-offs if costs run over.

## Tracker
- Simple checklist for deposits, due dates, and running totals.

Rules:
- Use only the budget and facts provided; do not invent income, prices, or metrics.
- Keep every allocation adding to the stated total, with math shown.
- Respect stated priorities when proposing cuts.
- Keep tone warm but neutral and factual.`,
  outputType: 'markdown',
  suggestedChainFrom: ['personal-budget-analyzer', 'invoice-description-generator'],
}
