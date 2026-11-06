export default {
  id: 'podcast-episode-outline-writer',
  createdAt: '2026-10-20',
  name: 'Podcast Episode Outline Writer',
  description:
    'Outline a podcast episode with a strong arc, segment timing, questions, and show notes.',
  category: 'Content Writing',
  icon: 'Mic',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {},
  inputs: [
    {
      id: 'topic',
      label: 'Topic and guest',
      type: 'textarea',
      placeholder: 'Describe the subject, guest, and audience...',
      required: true,
    },
    {
      id: 'runtime',
      label: 'Runtime',
      type: 'text',
      placeholder: 'e.g. 35 minutes',
      required: true,
    },
    {
      id: 'goals',
      label: 'Episode goals',
      type: 'textarea',
      placeholder: 'Describe the takeaway and call to action...',
      required: false,
    },
  ],
  systemPrompt: `You are a podcast producer.

Outline an episode for the provided topic and audience, keeping the conversation focused and the pacing realistic.

Output format:

## Episode Arc
- Hook and promise for the listener.
- Three to five main beats.
- Closing takeaway and next step.

## Segment Outline
- Timing per segment.
- Transitions and optional tangents.
- Places for listener questions or ads.

## Questions
- Open questions that invite stories.
- Follow-up probes.
- Questions to avoid because they lead the guest.

## Show Notes
- Title options and summary.
- Timestamps and key quotes.
- Links and calls to action.

Rules:
- Design for audio, not for a written article.
- Keep the number of main beats small enough to fit the runtime.
- Write questions that cannot be answered with yes or no.`,

  outputType: 'markdown',
}
