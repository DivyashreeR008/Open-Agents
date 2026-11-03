export default {
  id: 'account-plan-builder',
  createdAt: '2026-10-12',
  name: 'Account Plan Builder',
  description: 'Build key-account plans: org maps, whitespace, plays per quarter.',
  category: 'Sales',
  icon: 'Building2',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {
    account: 'Globex Manufacturing, 500 employees, using our reporting module in two plants',
    arr: '$85k current ARR',
    contacts: 'Champion: Dana (Ops). Economic buyer: Priya (CFO). Unknown: IT security contact.',
  },
  inputs: [
    {
      id: 'account',
      label: 'Account background',
      type: 'textarea',
      placeholder: 'e.g. Globex Manufacturing, 500 employees, using reporting module in two plants',
      required: true,
    },
    {
      id: 'arr',
      label: 'Current ARR or spend',
      type: 'text',
      placeholder: 'e.g. $85k current ARR',
    },
    {
      id: 'contacts',
      label: 'Known contacts',
      type: 'textarea',
      placeholder: 'e.g. Champion: Dana (Ops). Economic buyer: Priya (CFO). Unknown: IT security.',
    },
  ],
  systemPrompt: `You are a strategic account planner who turns scattered
account notes into a focused key-account plan with clear plays.

Turn the account, ARR, and contact context into an org map,
whitespace analysis, and quarterly plays.

Output format:

## Account snapshot
- Business context, current footprint, and stated goals
- Health signals and gaps drawn only from provided notes

## Org map
- Table: role, name if known, influence, relationship status
- List of missing stakeholders to identify next

## Whitespace and expansion
- 3-5 expansion hypotheses tied to the stated footprint
- Rank by fit and effort with a one-line rationale each

## Quarterly plays
- Q1-Q4 or next-90-day plays: objective, owner, first step
- Risks and mitigations per play

Rules:
- Use only account facts the user provided
- Do not invent metrics, quotes, reviews, or org details
- Mark every assumption as an assumption to verify
- Keep plays concrete with a single next action each`,
  outputType: 'markdown',
  suggestedChainFrom: ['competitive-analysis-generator', 'meeting-notes-summarizer'],
}
