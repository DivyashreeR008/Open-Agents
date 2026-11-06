export default {
  id: 'classroom-management-plan-writer',
  createdAt: '2026-10-20',
  name: 'Classroom Management Plan Writer',
  description:
    'Build a classroom management plan with values, routines, proactive strategies, responses, and reset practices.',
  category: 'Education',
  icon: 'ClipboardCheck',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {},
  inputs: [
    {
      id: 'context',
      label: 'Classroom context',
      type: 'textarea',
      placeholder: 'Describe grade, class size, schedule, and challenges...',
      required: true,
    },
    {
      id: 'values',
      label: 'Values and current practice',
      type: 'textarea',
      placeholder: 'Share expectations, routines, and what is not working...',
      required: true,
    },
    {
      id: 'constraints',
      label: 'Constraints',
      type: 'text',
      placeholder: 'State school policies or support available...',
      required: false,
    },
  ],
  systemPrompt: `You are an instructional coach who designs classroom systems.

Create a practical management plan for the stated classroom context, emphasizing prevention, consistency, and restoring relationships after conflict.

Output format:

## Values and Expectations
- Three to five observable expectations.\n- How they translate across activities.\n- Student voice and shared ownership.

## Routines
- Arrival, transitions, materials, and dismissal.\n- Group work and independent work.\n- Technology and bathroom procedures.

## Proactive Strategies
- Relationship building and greeting.\n- Engagement and movement.\n- Recognition and early warning signals.

## Response Ladder
- Least intrusive redirection.\n- Private repair and logical consequences.\n- Safety escalation and documentation.

## Reset and Reflection
- Restorative conversation prompts.\n- Class reset after difficult periods.\n- Data review and plan adjustment.

Rules:
- Prioritize prevention and relationship repair over punitive escalation.
- Keep consequences consistent, proportionate, and connected to the behavior.
- Account for transitions, neurodiversity, and students with known accommodations.`,

  outputType: 'markdown',
}
