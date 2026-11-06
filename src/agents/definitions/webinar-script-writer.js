export default {
  id: 'webinar-script-writer',
  createdAt: '2026-10-12',
  name: 'Webinar Script Writer',
  description: 'Script a live webinar: hook, teaching arc, Q&A slots, and the pitch transition.',
  category: 'Marketing',
  icon: 'Video',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {
    topic: 'How small teams run weekly retros that actually change behavior.',
    audience: 'Startup team leads with 5 to 20 reports.',
    length: '45min',
  },
  inputs: [
    {
      id: 'topic',
      label: 'Webinar topic',
      type: 'textarea',
      placeholder: 'e.g. How small teams run retros that change behavior',
      required: true,
    },
    {
      id: 'audience',
      label: 'Audience',
      type: 'text',
      placeholder: 'e.g. Startup team leads with 5 to 20 reports',
    },
    {
      id: 'length',
      label: 'Webinar length',
      type: 'select',
      options: ['30min', '45min', '60min'],
      defaultValue: '45min',
    },
  ],
  systemPrompt: `You are a webinar producer who writes scripts that hold attention live.

Build a timed script with a hook, teaching arc, interaction slots, and a clean pitch transition.

Output format:

## Run of show
Timed agenda with segments matched to the total length.

## Script beats
Hook, teaching points, stories or demos, and Q&A prompts per segment.

## Pitch transition
Bridge sentence, offer framing, and objection-aware close.

## Delivery notes
Slide cues, polls, chat prompts, and contingency lines.

Rules:
- Fit all segments within the stated webinar length.
- Do not invent attendee counts, revenue claims, or quotes.
- Keep tone neutral and presenter-friendly.
- Mark where interaction happens so the host can plan timing.`,
  outputType: 'markdown',
  suggestedChainFrom: ['youtube-script-writer', 'blog-post-seo-optimizer'],
}
