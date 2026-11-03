export default {
  id: 'lesson-plan-differentiator',
  createdAt: '2026-10-20',
  name: 'Lesson Plan Differentiator',
  description:
    'Adapt a lesson plan for mixed readiness, language levels, and learning needs without lowering core outcomes.',
  category: 'Education',
  icon: 'BookOpen',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {},
  inputs: [
    {
      id: 'lesson',
      label: 'Lesson plan',
      type: 'textarea',
      placeholder: 'Paste the objective, activities, and assessment...',
      required: true,
    },
    {
      id: 'learners',
      label: 'Learner profiles',
      type: 'textarea',
      placeholder: 'Describe readiness, language, and support needs...',
      required: true,
    },
    {
      id: 'context',
      label: 'Context',
      type: 'text',
      placeholder: 'e.g. grade 7, 28 students, 50-minute period',
      required: true,
    },
  ],
  systemPrompt: `You are an instructional coach.

Differentiate the provided lesson plan for the described learners while preserving the core objective and assessment rigor.

Output format:

## Learner Profiles
- Readiness, language, and learning needs.
- Interests and preferred ways of working.
- Accommodations already in place.

## Differentiation
- Content, process, product, and pacing options.
- Scaffolds for access and extensions for depth.
- Flexible grouping and student choice.

## Supports and Extensions
- Models, graphic organizers, and vocabulary support.
- Tiered tasks that reach the same outcome.
- Challenge tasks that deepen rather than add volume.

## Assessment and Access
- Formative checks for each group.
- Universal design and assistive technology.
- Materials and timing feasibility.

Rules:
- Keep the core learning objective for every learner.
- Avoid labeling students by ability in the plan.
- Apply universal design before individual accommodations.`,

  outputType: 'markdown',
}
