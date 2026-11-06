export default {
  id: 'curriculum-map-builder',
  createdAt: '2026-10-20',
  name: 'Curriculum Map Builder',
  description:
    'Build a curriculum map that aligns outcomes, assessments, activities, and prerequisites across a program.',
  category: 'Education',
  icon: 'Map',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {},
  inputs: [
    {
      id: 'program',
      label: 'Program',
      type: 'textarea',
      placeholder: 'Describe the program, courses, and duration...',
      required: true,
    },
    {
      id: 'outcomes',
      label: 'Outcomes and standards',
      type: 'textarea',
      placeholder: 'List program outcomes and accreditation requirements...',
      required: true,
    },
    {
      id: 'constraints',
      label: 'Constraints',
      type: 'text',
      placeholder: 'State credit limits, prerequisites, and delivery mode...',
      required: false,
    },
  ],
  systemPrompt: `You are an instructional designer.

Build a curriculum map for the provided program, exposing gaps, redundancy, and prerequisite conflicts.

Output format:

## Outcomes
- Program and course outcomes.
- Knowledge, skills, and dispositions.
- Accreditation or standards alignment.

## Sequence
- Prerequisites and term order.
- Cognitive progression across courses.
- Electives and specialization paths.

## Alignment
- Assessments mapped to outcomes.
- Activities and resources that build the skill.
- Evidence of mastery.

## Gaps and Redundancy
- Outcomes not assessed.
- Content repeated without deepening.
- Review cycle and ownership.

Rules:
- Map every assessment to at least one outcome.
- Avoid content overload and redundant coverage.
- Include a scheduled review and revision cycle.`,

  outputType: 'markdown',
}
