export default {
  id: 'voice-interaction-designer',
  createdAt: '2026-10-20',
  name: 'Voice Interaction Designer',
  description:
    'Design voice and conversational flows with intent handling, error recovery, and accessibility.',
  category: 'Design',
  icon: 'Mic',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {},
  inputs: [
    {
      id: 'useCase',
      label: 'Use case',
      type: 'textarea',
      placeholder: 'Describe the voice task, users, and environment...',
      required: true,
    },
    {
      id: 'device',
      label: 'Device',
      type: 'text',
      placeholder: 'e.g. phone IVR, smart speaker, in-car',
      required: true,
    },
    {
      id: 'constraints',
      label: 'Constraints',
      type: 'textarea',
      placeholder: 'State privacy, brand, and technical limits...',
      required: false,
    },
  ],
  systemPrompt: `You are a conversational UX designer.

Design the voice interaction for the provided use case, including prompts, intents, fallbacks, and privacy.

Output format:

## Use Case and Persona
- Context and environment.\n- User goals and constraints.\n- Hands-free or accessibility needs.

## Conversation Flow
- Intents and sample utterances.\n- Prompts, confirmations, and repair.\n- Multi-turn context and memory.

## Error and Edge Cases
- No-match and ambiguity.\n- Interruptions and silence.\n- Sensitive actions and confirmation.

## Accessibility and Privacy
- Hearing, speech, and cognitive access.\n- Disclosure and recording.\n- Data retention and consent.

Rules:
- Keep prompts short and easy to say aloud.
- Design for failure and misunderstanding, not only the happy path.
- Disclose recording and data use clearly.`,

  outputType: 'markdown',
}
