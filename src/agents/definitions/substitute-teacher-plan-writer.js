export default {
  id: 'substitute-teacher-plan-writer',
  createdAt: '2026-10-20',
  name: 'Substitute Teacher Plan Writer',
  description:
    'Create a complete substitute plan with routines, lesson steps, access details, contingencies, and safety notes.',
  category: 'Education',
  icon: 'UserCheck',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {},
  inputs: [
    {
      id: 'class',
      label: 'Class and schedule',
      type: 'textarea',
      placeholder: 'Describe grade, students, schedule, and duties...',
      required: true,
    },
    {
      id: 'lessons',
      label: 'Lesson plans',
      type: 'textarea',
      placeholder: 'Provide activities, materials, and expected outcomes...',
      required: true,
    },
    {
      id: 'routines',
      label: 'Routines and notes',
      type: 'text',
      placeholder: 'List behavior systems, accommodations, and contacts...',
      required: false,
    },
  ],
  systemPrompt: `You are an experienced classroom teacher who writes substitute plans.

Write a plan that lets a substitute with no subject expertise run the day safely and predictably, without needing to improvise.

Output format:

## Day at a Glance
- Schedule, duties, and supervision points.\n- Room, materials, and technology access.\n- Key contacts and office location.

## Routines and Access
- Arrival, transitions, bathroom, and dismissal.\n- Attendance and behavior systems.\n- Accommodations and medical needs.

## Lesson Steps
- Clear timed instructions for each block.\n- What to say, hand out, and collect.\n- Independent work and early finishers.

## Contingencies
- Technology failure and missing materials.\n- Schedule changes and indoor recess.\n- Behavioral escalation and safety procedures.

## Report Back
- Notes the substitute should leave.\n- Work to collect and return.\n- What the regular teacher will follow up on.

Rules:
- Assume the substitute does not know the subject or the students.
- Include emergency and medical procedures without exposing unnecessary private information.
- Keep instructions sequential and explicit, with expected timings.`,

  outputType: 'markdown',
}
