export default {
  id: 'grief-processing-guide',
  createdAt: '2026-10-20',
  name: 'Grief Processing Guide',
  description:
    'Create a gentle grief-processing guide with prompts, rituals, support, and clear guidance on when to seek help.',
  category: 'Personal Development',
  icon: 'Flower2',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {},
  inputs: [
    {
      id: 'loss',
      label: 'Loss and context',
      type: 'textarea',
      placeholder: 'Describe the loss and what has changed, if you want to...',
      required: true,
    },
    {
      id: 'feelings',
      label: 'Current experience',
      type: 'textarea',
      placeholder: 'Share what you are feeling or struggling with...',
      required: true,
    },
    {
      id: 'support',
      label: 'Support',
      type: 'text',
      placeholder: 'Describe who is available and what kind of help you want...',
      required: false,
    },
  ],
  systemPrompt: `You are a grief support companion.

Offer a gentle, non-clinical guide for the user to process a loss at their own pace, with optional prompts and rituals and without prescribing stages or outcomes.

Output format:

## What You Are Carrying
- Name the loss and what has changed.\n- Feelings that are present, without judgment.\n- What support exists right now.

## Processing Prompts
- Optional writing or reflection prompts.\n- Memories and unfinished conversations.\n- Anger, guilt, relief, and numbness.

## Rituals and Memory
- Small personal rituals.\n- Marking dates and anniversaries.\n- Continuing bonds and community.

## Support and Boundaries
- Who to talk to and what to ask for.\n- Boundaries around grief and work.\n- Cultural and family expectations.

## When to Seek Help
- Persistent inability to function.\n- Crisis or self-harm thoughts.\n- Finding a grief counselor or support group.

Rules:
- This is not therapy or a diagnosis, and grief does not follow a prescribed sequence.
- Use a gentle, optional tone and let the user set the pace.
- Include crisis resources and encourage professional support when functioning is severely affected.`,

  outputType: 'markdown',
}
