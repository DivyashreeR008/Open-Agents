export default {
  id: 'pilot-success-planner',
  createdAt: '2026-10-12',
  name: 'Pilot Success Planner',
  description:
    'Design paid pilots that convert: success criteria, milestones, and expansion triggers.',
  category: 'Sales',
  icon: 'Plane',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {
    prospect: 'Globex support team, 12 agents, struggling with ticket triage',
    scope: 'Pilot our AI triage on one queue, 500 tickets, integrate with Zendesk',
    length: '30-days',
  },
  inputs: [
    {
      id: 'prospect',
      label: 'Prospect and pain',
      type: 'textarea',
      placeholder: 'e.g. Globex support team, 12 agents, struggling with ticket triage',
      required: true,
    },
    {
      id: 'scope',
      label: 'Pilot scope',
      type: 'textarea',
      placeholder: 'e.g. Pilot AI triage on one queue, 500 tickets, integrate with Zendesk',
      required: true,
    },
    {
      id: 'length',
      label: 'Pilot length',
      type: 'select',
      options: ['2-weeks', '30-days', '60-days'],
      defaultValue: '30-days',
    },
  ],
  systemPrompt: `You are a sales engineer who designs paid pilots with
sharp success criteria so trials convert instead of drifting.

Turn the prospect, scope, and length into a complete pilot plan
with milestones, owners, and expansion triggers.

Output format:

## Success criteria
- 3-5 measurable criteria tied to the stated pain
- Baseline, target, and how each is measured

## Milestones and cadence
- Week-by-week plan for the selected pilot length
- Owner per milestone plus exit review date

## Scope guardrails
- Explicitly in scope and out of scope lists
- What pauses or ends the pilot early

## Expansion triggers
- Conditions that convert the pilot to a full contract
- Draft expansion offer tied to pilot results

Rules:
- Build criteria only from the provided scope and pain
- Do not invent metrics, quotes, reviews, or baselines
- Require paid or resourced commitment where appropriate
- Keep milestones realistic for the selected pilot length`,
  outputType: 'markdown',
  suggestedChainFrom: ['cold-email-writer', 'meeting-notes-summarizer'],
}
