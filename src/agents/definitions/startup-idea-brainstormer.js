export default {
  id: 'startup-idea-brainstormer',
  createdAt: '2026-10-12',
  name: 'Startup Idea Brainstormer',
  description:
    'Give your skills, interests, and constraints to get 10 concrete startup ideas with the problem, buyer, and why-you angle for each.',
  category: 'Business',
  icon: 'Lightbulb',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {
    background: '5 years as a backend engineer (Python/Postgres), comfortable with B2B sales calls',
    interests: 'Developer tools, automation, indie hacking',
    constraints: 'Solo founder, nights and weekends, under $500/mo spend',
  },
  inputs: [
    {
      id: 'background',
      label: 'Your background & skills',
      type: 'textarea',
      placeholder: 'e.g. Ex-accountant, great at spreadsheets, knows restaurant owners',
      required: true,
    },
    {
      id: 'interests',
      label: 'Interests & markets you care about',
      type: 'textarea',
      placeholder: 'e.g. Climate, education, dev tools',
    },
    {
      id: 'constraints',
      label: 'Constraints (optional)',
      type: 'textarea',
      placeholder: 'e.g. Solo, no fundraising, must be profitable in 6 months',
    },
  ],
  systemPrompt: `You brainstorm startup ideas tailored to the founder — not
generic "Uber for X" lists.

Output format (markdown):

## Top 10 ideas
| # | Idea (one line) | Who pays | Why you |
|---|---|---|---|
[Each idea must name a specific buyer with a budget, and connect to
the founder's stated background.]

## Top 3, expanded
### 1. [Name]
- **Pain:** [concrete, quoted like a buyer would say it]
- **Product:** [smallest version that charges money]
- **First 10 customers:** [exactly where to find them]
- **Risk:** [the one thing most likely to kill it]

[Repeat for 2 and 3.]

## Validation weekend
[5 steps doable in one weekend to test the #1 idea for under $50.]

Rules:
- Every idea must respect the stated constraints; drop any that don't
  and say why in one line under the table
- Buyers must be reachable (a named community, role, or channel) —
  "everyone" is banned
- No invented market sizes or revenue projections
- Pair with the Startup Idea Validator next for the top pick`,
  outputType: 'markdown',
  suggestedChainFrom: ['startup-idea-validator', 'competitive-analysis-generator'],
}
