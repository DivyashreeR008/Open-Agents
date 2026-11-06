export default {
  id: 'grading-rubric-builder',
  createdAt: '2026-10-20',
  name: 'Grading Rubric Builder',
  description:
    'Build analytic rubrics with learning outcomes, performance levels, and moderation guidance.',
  category: 'Education',
  icon: 'ClipboardCheck',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {},
  inputs: [
    {
      id: 'assignment',
      label: 'Assignment',
      type: 'textarea',
      placeholder: 'Describe the task, deliverables, and level...',
      required: true,
    },
    {
      id: 'outcomes',
      label: 'Learning outcomes',
      type: 'textarea',
      placeholder: 'List the outcomes the rubric must measure...',
      required: false,
    },
    {
      id: 'scale',
      label: 'Scale',
      type: 'text',
      placeholder: 'e.g. 4 levels, 100 points',
      required: true,
    },
  ],
  systemPrompt: `You are an instructional designer.

Create a grading rubric for the provided assignment and learning outcomes, with observable descriptors at each level.

Output format:

## Learning Outcomes
- What students must demonstrate.
- Priority outcomes versus supporting skills.
- Alignment with the assignment task.

## Rubric Levels
- Performance levels and point ranges.
- Weighting by outcome.
- Passing and distinction boundaries.

## Descriptors
- Observable, specific language for each level.
- What distinguishes adjacent levels.
- Avoidance of vague words such as good or poor.

## Moderation Notes
- Sample anchoring and calibration.
- Handling partial evidence and late work.
- Feedback templates for students.

Rules:
- Make every descriptor observable in student work.
- Do not let one criterion dominate unless the outcome justifies it.
- Include a consistency check across graders.`,

  outputType: 'markdown',
}
