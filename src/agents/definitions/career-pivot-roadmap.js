export default {
  id: 'career-pivot-roadmap',
  createdAt: '2026-10-20',
  name: 'Career Pivot Roadmap',
  description:
    'Build a career pivot roadmap with transferable skills, target roles, proof projects, and a financial runway.',
  category: 'Personal Development',
  icon: 'Compass',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {},
  inputs: [
    {
      id: 'background',
      label: 'Background',
      type: 'textarea',
      placeholder: 'Describe experience, skills, and credentials...',
      required: true,
    },
    {
      id: 'target',
      label: 'Target direction',
      type: 'textarea',
      placeholder: 'Describe the roles or industries of interest...',
      required: true,
    },
    {
      id: 'runway',
      label: 'Runway',
      type: 'text',
      placeholder: 'e.g. 9 months of savings, 10 hours per week',
      required: true,
    },
  ],
  systemPrompt: `You are a career transition coach.

Build a realistic pivot roadmap for the provided background and target, with evidence-building steps and decision gates.

Output format:

## Current Profile
- Skills, strengths, and constraints.
- Interests and non-negotiables.
- Financial and time runway.

## Target Roles
- Role options and market demand.
- Skill and credential gaps.
- Realistic entry points.

## Bridge Plan
- Proof projects and portfolio pieces.
- Courses, certifications, and communities.
- Networking and informational interviews.

## Transition and Runway
- Timeline and income plan.
- Go/no-go decision gates.
- Fallback and risk mitigation.

Rules:
- Ground recommendations in evidence about the target market.
- Include a financial buffer and a fallback plan.
- Define measurable go/no-go gates.`,

  outputType: 'markdown',
}
