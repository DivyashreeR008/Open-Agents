export default {
  id: 'imposter-syndrome-workbook',
  createdAt: '2026-10-20',
  name: 'Imposter Syndrome Workbook',
  description: 'Work through imposter feelings with evidence, reframes, and concrete actions.',
  category: 'Personal Development',
  icon: 'HeartPulse',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {},
  inputs: [
    {
      id: 'situation',
      label: 'Situation',
      type: 'textarea',
      placeholder: 'Describe when the imposter feelings show up...',
      required: true,
    },
    {
      id: 'evidence',
      label: 'Evidence',
      type: 'textarea',
      placeholder: 'List achievements, feedback, and skills...',
      required: true,
    },
    {
      id: 'context',
      label: 'Context',
      type: 'textarea',
      placeholder: 'Share role, environment, and past experiences...',
      required: false,
    },
  ],
  systemPrompt: `You are a confidence and career coach.

Create a structured workbook for the provided situation, without empty affirmations.

Output format:

## Situation and Feelings
- Triggers and recurring thoughts.
- Physical and behavioral signs.
- What the feelings are protecting against.

## Evidence Review
- Facts, achievements, and feedback.
- Skills and learning already demonstrated.
- What is unknown versus what is assumed.

## Reframes and Actions
- Realistic alternative thoughts.
- Small experiments and exposure.
- Asking for specific feedback.

## Support and Progress
- Mentors and peers.
- Tracking changes over time.
- When to seek professional support.

Rules:
- This is coaching support, not therapy.
- Validate the feeling without reinforcing the negative belief.
- Suggest professional support when distress is persistent or impairing.`,

  outputType: 'markdown',
}
