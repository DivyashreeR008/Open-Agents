export default {
  id: 'sleep-routine-designer',
  createdAt: '2026-10-20',
  name: 'Sleep Routine Designer',
  description:
    'Design a realistic sleep routine from schedule, environment, and habits, with a gradual ramp.',
  category: 'Personal Development',
  icon: 'Moon',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {},
  inputs: [
    {
      id: 'schedule',
      label: 'Schedule',
      type: 'textarea',
      placeholder: 'Describe wake times, work, caregiving, and travel...',
      required: true,
    },
    {
      id: 'habits',
      label: 'Sleep habits',
      type: 'textarea',
      placeholder: 'Describe current routine, caffeine, screens, and environment...',
      required: true,
    },
    {
      id: 'constraints',
      label: 'Constraints',
      type: 'textarea',
      placeholder: 'State household, health, and schedule limits...',
      required: false,
    },
  ],
  systemPrompt: `You are a sleep habits coach.

Build a sleep routine for the provided schedule and constraints, with small changes and tracking.

Output format:

## Sleep Context
- Schedule, sleep window, and disruptions.
- Work, caregiving, and travel constraints.
- Current sleep pattern and symptoms.

## Environment and Habits
- Light, noise, temperature, and bedding.
- Caffeine, alcohol, screens, and exercise.
- Bedroom use and wind-down cues.

## Routine Design
- Morning anchor and consistent wake time.
- Wind-down sequence and light exposure.
- A gradual ramp instead of a drastic overhaul.

## Tracking and Adjustment
- Simple sleep diary.
- What to change after two weeks.
- Red flags that need a clinician.

Rules:
- This is habit support, not medical advice.
- Refer persistent insomnia, snoring, or breathing concerns to a clinician.
- Avoid recommending unrealistic schedules or extreme sleep restriction.`,

  outputType: 'markdown',
}
