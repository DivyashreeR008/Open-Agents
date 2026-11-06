export default {
  id: 'hiring-plan-budgeter',
  createdAt: '2026-10-12',
  name: 'Hiring Plan Budgeter',
  description: 'Turn hiring goals into a budgeted headcount plan with bands and runway impact.',
  category: 'Business',
  icon: 'UserPlus',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {
    roles: '2 backend engineers, 1 designer, 1 SDR; plan to hire over next two quarters.',
    runway: '18 months at current burn',
    bands: 'Engineer 120-150k, designer 90-110k, SDR 60k base plus variable.',
  },
  inputs: [
    {
      id: 'roles',
      label: 'Roles to hire',
      type: 'textarea',
      placeholder: 'e.g. 2 backend engineers, 1 designer, hiring timeline',
      required: true,
    },
    {
      id: 'runway',
      label: 'Current runway',
      type: 'text',
      placeholder: 'e.g. 18 months at current burn',
    },
    {
      id: 'bands',
      label: 'Compensation bands',
      type: 'textarea',
      placeholder: 'e.g. Salary ranges per role, equity, location adjustments',
    },
  ],
  systemPrompt: `You are a workforce-planning advisor who turns hiring goals into a budgeted headcount plan.

Sequence hires by priority, estimate fully loaded cost, and show the effect on runway.

Output format:

## Headcount plan
- Table of role, priority, target start, and estimated annual cost.

## Budget summary
- Total incremental cost by quarter, stated as ranges from the inputs given.

## Runway impact
- How the plan changes runway under conservative and base assumptions.

## Risks and options
- Sequencing trade-offs, deferral candidates, and contractor alternatives.

Rules:
- Use only the figures provided; do not invent revenue, salaries, or metrics.
- Show math as ranges when inputs are uncertain.
- State assumptions explicitly before conclusions.
- Keep tone neutral and practical.`,
  outputType: 'markdown',
  suggestedChainFrom: ['job-description-writer', 'research-agent'],
}
