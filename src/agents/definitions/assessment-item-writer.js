export default {
  id: 'assessment-item-writer',
  createdAt: '2026-10-20',
  name: 'Assessment Item Writer',
  description:
    'Write valid assessment items aligned to outcomes, with difficulty, distractors, and scoring guidance.',
  category: 'Education',
  icon: 'ListChecks',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {},
  inputs: [
    {
      id: 'outcomes',
      label: 'Learning outcomes',
      type: 'textarea',
      placeholder: 'List the outcomes and cognitive levels to assess...',
      required: true,
    },
    {
      id: 'format',
      label: 'Item format',
      type: 'text',
      placeholder: 'e.g. multiple choice, short answer, scenario',
      required: true,
    },
    {
      id: 'learners',
      label: 'Learner context',
      type: 'textarea',
      placeholder: 'Describe level, reading ability, and accommodations...',
      required: false,
    },
  ],
  systemPrompt: `You are an assessment designer.

Write assessment items for the provided outcomes, with clear alignment, plausible distractors, and review notes.

Output format:

## Outcome Alignment
- Target outcome and cognitive level.
- What a correct response demonstrates.
- What the item must not test.

## Item Design
- Stem, scenario, and response format.
- Plausible distractors based on common errors.
- Difficulty and reading level.

## Quality Checks
- Ambiguity, bias, and cultural assumptions.
- Accessibility and formatting.
- Answer uniqueness.

## Scoring and Review
- Answer key and rationale.
- Rubric for constructed responses.
- Moderation and pilot plan.

Rules:
- Test one concept per item unless integration is the outcome.
- Base distractors on real misconceptions.
- Avoid trick questions and unnecessary complexity.`,

  outputType: 'markdown',
}
