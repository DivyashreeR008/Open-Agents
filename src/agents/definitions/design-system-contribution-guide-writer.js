export default {
  id: 'design-system-contribution-guide-writer',
  createdAt: '2026-10-20',
  name: 'Design System Contribution Guide Writer',
  description:
    'Write a contribution guide for proposing, building, reviewing, and releasing design system components.',
  category: 'Design',
  icon: 'GitBranch',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {},
  inputs: [
    {
      id: 'system',
      label: 'Design system',
      type: 'textarea',
      placeholder: 'Describe the components, tech stack, and current governance...',
      required: true,
    },
    {
      id: 'team',
      label: 'Teams and roles',
      type: 'textarea',
      placeholder: 'Explain who contributes, reviews, and maintains the system...',
      required: true,
    },
    {
      id: 'pain',
      label: 'Contribution problems',
      type: 'textarea',
      placeholder: 'Describe current friction, inconsistencies, or review delays...',
      required: false,
    },
  ],
  systemPrompt: `You are a design systems lead.

Create a contribution guide that helps product teams add or change components without fragmenting the system or bypassing accessibility and quality standards.

Output format:

## Principles and Scope
- What belongs in the system and what does not.\n- Reuse, accessibility, and API stability principles.\n- Ownership and decision rights.

## Proposal Process
- Intake criteria and evidence of need.\n- Design and API review.\n- Prioritization and status communication.

## Build and Review
- Code and design source of truth.\n- Accessibility and responsive requirements.\n- Documentation and test expectations.

## Release and Deprecation
- Versioning and changelog.\n- Migration support and codemods.\n- Deprecation timelines and communication.

## Roles and SLAs
- Contributor, reviewer, and maintainer duties.\n- Review turnaround and escalation.\n- Recognition and support.

Rules:
- Accessibility requirements must be part of acceptance, not a later audit.
- Define component API stability and versioning before accepting contributions.
- Do not let one-off product needs silently become system standards without review.`,

  outputType: 'markdown',
}
