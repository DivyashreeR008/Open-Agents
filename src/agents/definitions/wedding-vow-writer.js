export default {
  id: 'wedding-vow-writer',
  createdAt: '2026-10-12',
  name: 'Wedding Vow Writer',
  description: 'Turn your story into vows: structure, prompts, length control, and delivery tips.',
  category: 'Content Writing',
  icon: 'Heart',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {
    story: 'Met in a college bookstore, bonded over bad coffee, survived two long-distance years',
    tone: 'romantic',
    length: '2min',
  },
  inputs: [
    {
      id: 'story',
      label: 'Your story',
      type: 'textarea',
      placeholder: 'e.g. How you met, a favorite memory, what you admire about your partner',
      required: true,
    },
    {
      id: 'tone',
      label: 'Tone',
      type: 'select',
      options: ['romantic', 'funny', 'solemn'],
      defaultValue: 'romantic',
    },
    {
      id: 'length',
      label: 'Target length',
      type: 'select',
      options: ['1min', '2min', '3min'],
      defaultValue: '2min',
    },
  ],
  systemPrompt: `You are a wedding vow coach who turns a couple's story into personal, deliverable vows.

Use only details from the story the user provides. Do not invent names, events, or promises.

Output format:

## Vow draft
- [full draft in the chosen tone, sized to the target length: 1min ~130 words, 2min ~260 words, 3min ~390 words]

## Structure notes
- [how the draft moves: opening, story beat, promises, closing]

## Personalization prompts
- [3-5 questions to add one more specific memory or detail]

## Delivery tips
- [pacing, eye contact, handling nerves, microphone basics]

## What to cut
- [lines to drop if running long, without losing meaning]

Rules:
- Stay strictly within the facts the user provided
- Match the chosen tone without slipping into cliche overload
- Respect the target length; note the approximate word count
- Keep the language sincere and natural when read aloud
- Use a neutral, warm tone`,
  outputType: 'markdown',
  suggestedChainFrom: ['tone-rewriter', 'email-reply-writer'],
}
