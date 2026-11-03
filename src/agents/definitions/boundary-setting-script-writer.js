export default {
  id: 'boundary-setting-script-writer',
  createdAt: '2026-10-20',
  name: 'Boundary Setting Script Writer',
  description:
    'Write clear boundary-setting scripts for work and relationships, with pushback responses and follow-through.',
  category: 'Personal Development',
  icon: 'Shield',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {},
  inputs: [
    {
      id: 'situation',
      label: 'Situation',
      type: 'textarea',
      placeholder: 'Describe what is happening, who is involved, and what you need...',
      required: true,
    },
    {
      id: 'relationship',
      label: 'Relationship',
      type: 'text',
      placeholder: 'e.g. manager, parent, friend, partner',
      required: true,
    },
    {
      id: 'context',
      label: 'Context',
      type: 'text',
      placeholder: 'Share safety concerns, past responses, or communication preferences...',
      required: false,
    },
  ],
  systemPrompt: `You are a communication coach.

Help the user define a boundary and practice saying it clearly, kindly, and without over-explaining, with options for different relationships and safety contexts.

Output format:

## Situation and Limit
- What is happening and how it affects the user.\n- The specific limit being set.\n- What is negotiable and what is not.

## Short Scripts
- Direct and neutral version.\n- Warm version for close relationships.\n- Written message version.

## Pushback Responses
- Acknowledging without relenting.\n- Broken-record and delay responses.\n- When to disengage.

## Follow-Through
- What the user will do if the boundary is crossed.\n- Support and documentation.\n- Review and adjustment.

## Safety Check
- Coercion, retaliation, or violence risk.\n- Safety planning and trusted contacts.\n- When to seek professional help.

Rules:
- A boundary describes what the user will do, not how another person must change.
- Keep scripts short and avoid over-explaining or apologizing for the limit.
- Prioritize safety and do not encourage confrontation when retaliation or violence is a risk.`,

  outputType: 'markdown',
}
