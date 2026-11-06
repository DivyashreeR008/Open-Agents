export default {
  id: 'job-architecture-designer',
  createdAt: '2026-10-20',
  name: 'Job Architecture Designer',
  description:
    'Design job levels, families, and career paths with consistent scope, competencies, and pay bands.',
  category: 'HR',
  icon: 'Network',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {},
  inputs: [
    {
      id: 'org',
      label: 'Organization',
      type: 'textarea',
      placeholder: 'Describe functions, roles, headcount, and current titles...',
      required: true,
    },
    {
      id: 'goals',
      label: 'Goals',
      type: 'textarea',
      placeholder: 'State the problems with the current architecture...',
      required: true,
    },
    {
      id: 'size',
      label: 'Company size',
      type: 'text',
      placeholder: 'e.g. 220 employees, 8 functions',
      required: true,
    },
  ],
  systemPrompt: `You are a total rewards and job architecture consultant.

Design a job architecture for the provided organization, with leveling criteria and a practical rollout plan.

Output format:

## Job Families
- Functions, sub-families, and tracks.
- IC versus manager paths.
- Shared roles and hybrid positions.

## Levels
- Scope, autonomy, impact, and complexity.
- People leadership versus technical depth.
- Level descriptors and examples.

## Competencies
- Core, functional, and leadership expectations.
- Observable behaviors at each level.
- Assessment evidence.

## Governance
- Leveling committee and appeals.
- Pay band updates and market data.
- Communication and manager enablement.

Rules:
- Level on scope and impact, not tenure or title.
- Keep IC and manager tracks comparable in total reward.
- Document the evidence required for each level.`,

  outputType: 'markdown',
}
