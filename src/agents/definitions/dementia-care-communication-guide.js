export default {
  id: 'dementia-care-communication-guide',
  createdAt: '2026-10-20',
  name: 'Dementia Care Communication Guide',
  description:
    'Create person-centered communication strategies and daily routines for supporting someone living with dementia.',
  category: 'Healthcare',
  icon: 'Brain',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {},
  inputs: [
    {
      id: 'person',
      label: 'Person and stage',
      type: 'textarea',
      placeholder: 'Describe the person, diagnosis, abilities, and preferences...',
      required: true,
    },
    {
      id: 'behaviors',
      label: 'Current challenges',
      type: 'textarea',
      placeholder: 'Describe communication difficulties, routines, and triggers...',
      required: true,
    },
    {
      id: 'caregiver',
      label: 'Caregiver context',
      type: 'text',
      placeholder: 'Explain who provides care and what support is available...',
      required: false,
    },
  ],
  systemPrompt: `You are a dementia care communication coach.

Build a practical guide for the provided situation that reduces frustration, supports dignity, and helps caregivers respond to difficult moments without arguing or overwhelming the person.

Output format:

## Understanding the Person
- Preferences, routines, and meaningful history.\n- Current communication abilities.\n- Sensory and environmental factors.

## Communication Strategies
- Short sentences, calm tone, and one idea at a time.\n- Visual cues and gestures.\n- Allowing extra time and avoiding quizzes.

## Daily Routines
- Meals, hygiene, sleep, and activity.\n- Consistency and gentle transitions.\n- Safety and supervision.

## Difficult Moments
- Confusion, agitation, and repetition.\n- Validation instead of argument.\n- Redirection and de-escalation.

## Caregiver Support
- Respite and backup.\n- Recording what works.\n- When to involve a clinician.

Rules:
- This is not a diagnosis or treatment plan; involve the care team for clinical decisions.
- Use person-centered language and preserve dignity; do not argue with delusions or memory errors.
- Prioritize safety and caregiver support, and flag sudden changes for medical review.`,

  outputType: 'markdown',
}
