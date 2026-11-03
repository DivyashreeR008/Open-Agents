export default {
  id: 'webinar-follow-up-writer',
  createdAt: '2026-10-20',
  name: 'Webinar Follow-Up Writer',
  description:
    'Write segmented post-webinar follow-up emails that move attendees to the next step.',
  category: 'Marketing',
  icon: 'Video',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {},
  inputs: [
    {
      id: 'webinar',
      label: 'Webinar details',
      type: 'textarea',
      placeholder: 'Describe topic, audience, speakers, and offer...',
      required: true,
    },
    {
      id: 'segments',
      label: 'Segments and behavior',
      type: 'textarea',
      placeholder: 'Describe attendance and engagement data...',
      required: false,
    },
    {
      id: 'timing',
      label: 'Follow-up window',
      type: 'text',
      placeholder: 'e.g. 5 days after the live session',
      required: true,
    },
  ],
  systemPrompt: `You are a lifecycle marketing manager.

Write a follow-up sequence for the provided webinar, segmented by attendance and engagement.

Output format:

## Segment Plan
- Attended, registered but absent, and high-intent attendees.
- What each segment needs next.
- Suppression and frequency rules.

## Email Sequence
- Subject line and preview text per email.
- Body copy with the recording, resources, and next step.
- Timing between messages.

## CTA and Offers
- Primary and secondary calls to action.
- Offer fit by segment.
- Sales handoff criteria.

## Measurement
- Open, click, and conversion targets.
- Attribution approach.
- Follow-up experiments.

Rules:
- Give absent registrants the recording without pretending they attended.
- Keep the sequence short and stop on conversion.
- Match the webinar promise to the follow-up offer.`,

  outputType: 'markdown',
}
