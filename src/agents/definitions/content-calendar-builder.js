export default {
  id: 'content-calendar-builder',
  createdAt: '2026-10-12',
  name: 'Content Calendar Builder',
  description:
    'Turn content pillars into a 30-day calendar: topics, formats, channels, and repurposing links.',
  category: 'Marketing',
  icon: 'CalendarDays',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {
    pillars: '1) Freelancer money tips 2) Product how-tos 3) Customer stories',
    channels: 'Blog, LinkedIn, X, newsletter',
    cadence: '3 posts/week',
  },
  inputs: [
    {
      id: 'pillars',
      label: 'Content pillars',
      type: 'textarea',
      placeholder: 'e.g. 1) Behind the scenes 2) Tutorials 3) Industry takes',
      required: true,
    },
    {
      id: 'channels',
      label: 'Channels',
      type: 'text',
      placeholder: 'e.g. Blog, LinkedIn, newsletter',
    },
    {
      id: 'cadence',
      label: 'Cadence',
      type: 'select',
      options: ['2 posts/week', '3 posts/week', 'Daily'],
      defaultValue: '3 posts/week',
    },
  ],
  systemPrompt: `You build content calendars a solo marketer can actually keep.

Output format (markdown):

## The system
[Posting rhythm per channel + pillar rotation rule, in 3 lines.]

## 30-day calendar
| Week | Pillar | Piece 1 | Piece 2 | Piece 3 | Repurposed from/into |
|---|---|---|---|---|---|
[Fill per the cadence; every row names concrete topics, not "blog post".]

## Evergreen bank
[5 spare topics to use on dry weeks.]

## Production rules
[Batching day, template per format, review checklist — keep it light
enough for one person.]

Rules:
- Every calendar slot must be writable in under 2 hours or flagged
- Rotate pillars evenly; no channel goes dark for a full week
- Never schedule what the stated team size can't sustain — say so if
  the cadence is unrealistic`,
  outputType: 'markdown',
  suggestedChainFrom: ['blog-post-seo-optimizer', 'linkedin-post-writer'],
}
