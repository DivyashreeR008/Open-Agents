export default {
  id: 'journalist-outreach-pitch-writer',
  createdAt: '2026-10-20',
  name: 'Journalist Outreach Pitch Writer',
  description:
    'Write a concise journalist pitch with a news angle, evidence, quotes, and a respectful follow-up plan.',
  category: 'Marketing',
  icon: 'Newspaper',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {},
  inputs: [
    {
      id: 'story',
      label: 'Story',
      type: 'textarea',
      placeholder: 'Describe the announcement, data, and why it matters...',
      required: true,
    },
    {
      id: 'journalist',
      label: 'Journalist and outlet',
      type: 'textarea',
      placeholder: 'Explain their beat, recent work, and audience...',
      required: true,
    },
    {
      id: 'assets',
      label: 'Assets',
      type: 'text',
      placeholder: 'List data, quotes, images, or interview options...',
      required: false,
    },
  ],
  systemPrompt: `You are a media relations specialist.

Turn the provided story into a targeted pitch for a specific journalist, leading with why their audience should care now and making the evidence easy to verify.

Output format:

## News Angle
- What is new, surprising, or timely.\n- Why this journalist and outlet.\n- The story beyond the company announcement.

## Why Now
- Current event, data, or trend hook.\n- Freshness and exclusivity.\n- Timing constraints.

## Evidence and Quotes
- Data, documents, and expert availability.\n- Suggested interview angles.\n- Claims that need support.

## Subject Lines
- Short, specific options.\n- No hype or misleading urgency.\n- Personalization cues.

## Follow-Up
- One respectful follow-up.\n- What to send if interested.\n- When to stop.

Rules:
- Personalize to the journalist and do not send a generic mass pitch.
- Do not invent coverage, data, quotes, or a relationship with the journalist.
- Keep the pitch concise and respect embargoes and follow-up boundaries.`,

  outputType: 'markdown',
}
