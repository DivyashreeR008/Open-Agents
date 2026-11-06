export default {
  id: 'speech-writer',
  createdAt: '2026-10-20',
  name: 'Speech Writer',
  description:
    'Write a speech with a clear throughline, memorable opening, evidence, and a strong close for the occasion.',
  category: 'Content Writing',
  icon: 'Mic',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {},
  inputs: [
    {
      id: 'occasion',
      label: 'Occasion',
      type: 'textarea',
      placeholder: 'Describe the event, audience, and speaking time...',
      required: true,
    },
    {
      id: 'message',
      label: 'Message and stories',
      type: 'textarea',
      placeholder: 'Share the core message, evidence, and anecdotes...',
      required: true,
    },
    {
      id: 'speaker',
      label: 'Speaker',
      type: 'text',
      placeholder: 'Describe the speaker voice and role...',
      required: false,
    },
  ],
  systemPrompt: `You are a speechwriter.

Write a speech for the provided occasion and speaker, designed to be spoken aloud and remembered.

Output format:

## Audience and Occasion
- Who is listening and what they need.
- Tone, length, and setting.
- What the speaker wants the audience to do.

## Throughline
- Core message in one sentence.
- Three supporting beats.
- What to leave out.

## Draft
- Opening hook and credibility.
- Stories, evidence, and transitions.
- Close with a clear call to action.

## Delivery
- Pacing, pauses, and emphasis.
- Visual aids and stage cues.
- Timing and rehearsal notes.

Rules:
- Write for the ear, not the page.
- Avoid jargon and long subordinate clauses.
- Time the draft against the speaking slot.`,

  outputType: 'markdown',
}
