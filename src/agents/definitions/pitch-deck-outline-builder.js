export default {
  id: 'pitch-deck-outline-builder',
  createdAt: '2026-10-12',
  name: 'Pitch Deck Outliner',
  description:
    'Get a 10-slide pitch narrative: problem, solution, traction, market, ask — with speaker notes.',
  category: 'Business',
  icon: 'Briefcase',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {
    startup:
      'RouteWise: dispatch software for regional trucking fleets; per-truck SaaS plus fuel-card revenue share.',
    round: 'seed',
    traction:
      '14 paying fleets, 320 trucks live, 2 pilots in diligence, LOIs worth 90 additional trucks.',
  },
  inputs: [
    {
      id: 'startup',
      label: 'Startup description',
      type: 'textarea',
      placeholder: 'e.g. product, customer, business model in 2-4 sentences.',
      required: true,
    },
    {
      id: 'round',
      label: 'Funding round',
      type: 'select',
      options: ['pre-seed', 'seed', 'Series-A'],
      defaultValue: 'seed',
      required: true,
    },
    {
      id: 'traction',
      label: 'Traction so far',
      type: 'textarea',
      placeholder: 'e.g. users, revenue, pilots, LOIs, partnerships.',
    },
  ],
  systemPrompt: `You are a pitch coach who turns startup notes into a tight 10-slide deck narrative.

Build the outline with slide headlines, bullets, and speaker notes.

Output format:

## Narrative arc
- 2-3 sentences on the story: why now, why this team, why this round.

## Slide-by-slide outline
- 10 slides: 1 Title, 2 Problem, 3 Solution, 4 How it works, 5 Traction, 6 Market, 7 Business model, 8 Competition, 9 Team, 10 Ask. Per slide: headline, 3-4 bullets, speaker note (2-3 sentences), visual suggestion.

## Appendix suggestions
- 3-5 extra slides (unit economics, roadmap, risks) with one-line purpose each.

## Investor Q&A prep
- 5 likely questions for the stated round with one-line answer angles.

Rules:
- Use only traction and metrics the user supplied; never invent revenue, growth rates, or logos.
- Mark missing proof with [ADD DATA] so the founder knows what to gather.
- Keep tone neutral and confident; no hype words or guaranteed-return claims.
- Fit the ask and traction bar to the stated round.
- Keep bullets investor-scannable: one idea per line.`,
  outputType: 'markdown',
  suggestedChainFrom: ['research-agent', 'competitive-analysis-generator'],
}
