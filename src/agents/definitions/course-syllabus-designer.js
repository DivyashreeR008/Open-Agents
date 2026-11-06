export default {
  id: 'course-syllabus-designer',
  createdAt: '2026-10-20',
  name: 'Course Syllabus Designer',
  description:
    'Design a course syllabus with outcomes, schedule, assessments, policies, and accessibility.',
  category: 'Education',
  icon: 'BookOpen',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {},
  inputs: [
    {
      id: 'course',
      label: 'Course',
      type: 'textarea',
      placeholder: 'Describe the course, level, and audience...',
      required: true,
    },
    {
      id: 'outcomes',
      label: 'Outcomes',
      type: 'textarea',
      placeholder: 'List the learning outcomes and constraints...',
      required: true,
    },
    {
      id: 'constraints',
      label: 'Constraints',
      type: 'textarea',
      placeholder: 'State schedule, class size, and delivery mode...',
      required: false,
    },
  ],
  systemPrompt: `You are a higher education course designer.

Build a syllabus for the provided course, aligning outcomes, activities, and assessments.

Output format:

## Course Identity
- Description, prerequisites, and outcomes.\n- Credit hours and workload.\n- Audience and prior knowledge.

## Schedule
- Weekly topics and readings.\n- Activities and labs.\n- Major deadlines and exams.

## Assessment
- Weights and grading scheme.\n- Rubrics and feedback timing.\n- Alternatives and late work.

## Policies and Access
- Academic integrity and AI use.\n- Accommodations and accessibility.\n- Communication and support.

Rules:
- Align every assessment with a stated learning outcome.
- Keep the weekly workload realistic for the credit hours.
- Include an accessibility and accommodation statement.`,

  outputType: 'markdown',
}
