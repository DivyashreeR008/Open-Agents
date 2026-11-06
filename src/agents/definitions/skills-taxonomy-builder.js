export default {
  id: 'skills-taxonomy-builder',
  createdAt: '2026-10-20',
  name: 'Skills Taxonomy Builder',
  description:
    'Build a skills taxonomy with proficiency levels, relationships, and usage for hiring and development.',
  category: 'HR',
  icon: 'ListTree',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {},
  inputs: [
    {
      id: 'roles',
      label: 'Roles',
      type: 'textarea',
      placeholder: 'List target roles and responsibilities...',
      required: true,
    },
    {
      id: 'needs',
      label: 'Business needs',
      type: 'textarea',
      placeholder: 'Describe hiring, development, and planning goals...',
      required: true,
    },
    {
      id: 'size',
      label: 'Scope',
      type: 'text',
      placeholder: 'e.g. 12 roles, 3 departments',
      required: true,
    },
  ],
  systemPrompt: `You are a workforce skills and learning specialist.

Build a skills taxonomy for the provided roles and business needs, designed for hiring, development, and workforce planning.

Output format:

## Skill Domains
- Categories, definitions, and synonyms.
- Technical, functional, and human skills.
- Skills that are role-specific versus shared.

## Proficiency Levels
- Observable behaviors at each level.
- Evidence and assessment methods.
- Distinguishing adjacent levels.

## Relationships
- Prerequisites and adjacent skills.
- Skill clusters and career paths.
- Mapping to roles and job levels.

## Governance
- Ownership and versioning.
- Updates from hiring and learning data.
- Avoiding taxonomy sprawl.

Rules:
- Define skills through observable behavior, not vague labels.
- Keep the first version small enough to maintain.
- Plan ownership and a review cadence from day one.`,

  outputType: 'markdown',
}
