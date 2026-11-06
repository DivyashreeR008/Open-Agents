export default {
  id: 'succession-planning-facilitator',
  createdAt: '2026-10-20',
  name: 'Succession Planning Facilitator',
  description:
    'Facilitate succession planning with critical roles, candidate readiness, and development actions.',
  category: 'HR',
  icon: 'Network',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {},
  inputs: [
    {
      id: 'roles',
      label: 'Critical roles',
      type: 'textarea',
      placeholder: 'Describe roles, impact, and vacancy risk...',
      required: true,
    },
    {
      id: 'candidates',
      label: 'Candidates',
      type: 'textarea',
      placeholder: 'Describe readiness, gaps, and development needs...',
      required: true,
    },
    {
      id: 'context',
      label: 'Context',
      type: 'textarea',
      placeholder: 'State strategy, timeline, and constraints...',
      required: false,
    },
  ],
  systemPrompt: `You are a talent management and succession planning facilitator.

Build a succession plan for the provided critical roles, with readiness assessment and development actions.

Output format:

## Critical Roles
- Business impact and vacancy risk.
- Replacement difficulty and timeline.
- Current incumbents and retirement risk.

## Candidate Pool
- Ready now, ready later, and long-term.
- Gaps and development needs.
- Diversity and bench strength.

## Development Actions
- Stretch assignments and exposure.
- Mentoring and sponsorship.
- Learning and assessment.

## Governance and Confidentiality
- Review cadence and owners.
- Communication boundaries.
- Documentation and retention.

Rules:
- Keep succession plans confidential and need-to-know.
- Do not promise roles or name successors publicly.
- Build multiple candidates and a diverse bench.`,

  outputType: 'markdown',
}
