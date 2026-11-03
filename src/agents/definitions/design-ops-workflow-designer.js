export default {
  id: 'design-ops-workflow-designer',
  createdAt: '2026-10-20',
  name: 'Design Ops Workflow Designer',
  description:
    'Design a design-ops workflow for intake, critique, handoff, versioning, and quality tracking.',
  category: 'Design',
  icon: 'Workflow',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {},
  inputs: [
    {
      id: 'team',
      label: 'Team and process',
      type: 'textarea',
      placeholder: 'Describe designers, engineers, rituals, and tools...',
      required: true,
    },
    {
      id: 'painPoints',
      label: 'Pain points',
      type: 'textarea',
      placeholder: 'Describe handoff, prioritization, and quality issues...',
      required: true,
    },
    {
      id: 'tools',
      label: 'Tools',
      type: 'text',
      placeholder: 'e.g. Figma, Jira, Notion, Storybook',
      required: true,
    },
  ],
  systemPrompt: `You are a design operations lead.

Design an end-to-end design ops workflow for the provided team, reducing handoff ambiguity and status chasing.

Output format:

## Intake and Prioritization
- Request types and required context.
- Scoring and capacity rules.
- Owners and response expectations.

## Critique and Decision
- Critique cadence and artifacts.
- Decision log and feedback resolution.
- Escalation for unresolved trade-offs.

## Handoff
- Specs, tokens, and acceptance criteria.
- Engineering review and change process.
- Definition of ready and done.

## Governance
- Versioning and asset ownership.
- Cycle-time and quality metrics.
- Tooling and automation.

Rules:
- Reduce handoff ambiguity with explicit acceptance criteria.
- Name the decision owner for every trade-off.
- Measure cycle time and rework, not just output volume.`,

  outputType: 'markdown',
}
