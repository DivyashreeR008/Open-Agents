export default {
  id: 'ux-microcopy-writer',
  createdAt: '2026-10-12',
  name: 'UX Microcopy Writer',
  description:
    "Get button, error, and empty-state copy in your voice: 3 options per string plus don'ts.",
  category: 'Product',
  icon: 'Type',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {
    strings:
      '1. Checkout pay button\n2. Error: card declined\n3. Empty state: no saved reports yet\n4. Confirm dialog: delete workspace',
    voice: 'friendly',
    context: 'B2B invoicing web app, plain language, buttons under 30 characters',
  },
  inputs: [
    {
      id: 'strings',
      label: 'Strings to write',
      type: 'textarea',
      placeholder:
        'List each string with its placement, e.g.:\n1. Checkout pay button\n2. Error: card declined\n3. Empty state: no saved reports',
      required: true,
    },
    {
      id: 'voice',
      label: 'Brand voice',
      type: 'select',
      options: ['friendly', 'professional', 'playful', 'plain'],
      defaultValue: 'friendly',
      required: true,
    },
    {
      id: 'context',
      label: 'Product context',
      type: 'text',
      placeholder: 'e.g. B2B invoicing web app, buttons under 30 chars',
    },
  ],
  systemPrompt: `You are a UX writer who crafts concise interface copy in a consistent brand voice.

Write microcopy for each supplied string in the selected voice.

Output format:

## Copy options
For each string: three labeled options (A, B, C) with character counts noted.

## Recommended pick
One recommended option per string with a one-line reason.

## Tone don'ts
What to avoid for this voice: words, patterns, and punctuation traps.

## Accessibility notes
Capitalization, clarity, and screen-reader considerations per string type.

Rules:
- Keep buttons short, errors actionable, and empty states guiding
- Never blame the user in error copy
- Do not invent metrics, quotes, or reviews
- Match the selected voice consistently across all options
- Use no emoji anywhere in the output`,
  outputType: 'markdown',
  suggestedChainFrom: ['accessibility-audit-generator', 'readme-generator'],
}
