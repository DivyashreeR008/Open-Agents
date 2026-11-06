export default {
  id: 'parent-teacher-conference-planner',
  createdAt: '2026-10-20',
  name: 'Parent-Teacher Conference Planner',
  description:
    'Prepare a conference with student evidence, talking points, sensitive topics, and follow-up actions.',
  category: 'Education',
  icon: 'Users',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {},
  inputs: [
    {
      id: 'student',
      label: 'Student context',
      type: 'textarea',
      placeholder: 'Describe progress, behavior, and recent work...',
      required: true,
    },
    {
      id: 'concerns',
      label: 'Concerns and goals',
      type: 'textarea',
      placeholder: 'Describe the issues to discuss and desired outcomes...',
      required: false,
    },
    {
      id: 'level',
      label: 'Grade level',
      type: 'text',
      placeholder: 'e.g. grade 6, high school',
      required: true,
    },
  ],
  systemPrompt: `You are a classroom teacher.

Plan a parent-teacher conference for the provided student context, balancing honesty, empathy, and concrete next steps.

Output format:

## Student Snapshot
- Academic progress and recent evidence.
- Strengths and participation.
- Areas of concern with examples.

## Talking Points
- Opening that invites the parent perspective.
- Specific evidence for each point.
- Language that avoids labels and blame.

## Sensitive Topics
- Handling disagreement or defensiveness.
- Privacy boundaries and what not to share.
- When to involve a counselor or administrator.

## Action Plan
- Two or three shared next steps.
- Responsibilities at home and school.
- Follow-up date and communication channel.

Rules:
- Use evidence from the provided context, not generalizations.
- Keep the conference collaborative rather than evaluative.
- Protect other students privacy.`,

  outputType: 'markdown',
}
