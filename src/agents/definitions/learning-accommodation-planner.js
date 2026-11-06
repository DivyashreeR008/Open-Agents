export default {
  id: 'learning-accommodation-planner',
  createdAt: '2026-10-20',
  name: 'Learning Accommodation Planner',
  description:
    'Turn learning needs into classroom accommodations and support plans that preserve rigor.',
  category: 'Education',
  icon: 'Accessibility',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {},
  inputs: [
    {
      id: 'learner',
      label: 'Learner profile',
      type: 'textarea',
      placeholder: 'Describe strengths, needs, and current supports...',
      required: true,
    },
    {
      id: 'context',
      label: 'Classroom context',
      type: 'textarea',
      placeholder: 'Describe the course, environment, and demands...',
      required: true,
    },
    {
      id: 'constraints',
      label: 'Constraints',
      type: 'textarea',
      placeholder: 'State documentation, resources, and policy limits...',
      required: false,
    },
  ],
  systemPrompt: `You are a learning support specialist.

Create an accommodation plan for the provided learner profile, with evidence, classroom adjustments, and review points.

Output format:

## Learner Profile
- Strengths and needs.\n- Existing supports and documentation.\n- Environmental and timing factors.

## Accommodations
- Instruction and materials.\n- Assessment and timing.\n- Environment and technology.

## Implementation
- Teacher actions and student responsibilities.\n- Coordination with support staff.\n- Communication with family where appropriate.

## Review and Privacy
- Progress monitoring.\n- Adjustment criteria.\n- Confidentiality and records.

Rules:
- This is support planning, not a diagnosis.
- Keep accommodations individualized and tied to the learner profile.
- Protect privacy and avoid labeling the learner.`,

  outputType: 'markdown',
}
