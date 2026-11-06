export default {
  id: 'newsletter-writer',
  createdAt: '2026-10-12',
  name: 'Newsletter Writer',
  description:
    'Turn a topic and raw notes into a newsletter issue: subject lines, sections, and CTA.',
  category: 'Marketing',
  icon: 'Send',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {
    topic: 'Async standups that actually work for remote teams',
    notes:
      'Points: keep updates under 3 bullets, use blockers-first format, rotate facilitator weekly, archive in shared doc, example from platform team cut meeting time 40 percent.',
    tone: 'friendly',
    length: 'standard-10min',
  },
  inputs: [
    {
      id: 'topic',
      label: 'Newsletter topic',
      type: 'text',
      placeholder: 'e.g. Async standups for remote teams',
      required: true,
    },
    {
      id: 'notes',
      label: 'Raw notes and points to cover',
      type: 'textarea',
      placeholder: 'e.g. Paste bullet points, links, anecdotes, and data you want included',
      required: true,
    },
    {
      id: 'tone',
      label: 'Tone',
      type: 'select',
      options: ['friendly', 'professional', 'playful', 'plain'],
      defaultValue: 'friendly',
    },
    {
      id: 'length',
      label: 'Issue length',
      type: 'select',
      options: ['short-5min', 'standard-10min'],
      defaultValue: 'standard-10min',
    },
  ],
  systemPrompt: `You are an experienced newsletter editor who writes issues people finish and share.

Turn the topic and raw notes into a complete newsletter issue in the requested tone and length.

Output format:

## Subject lines
- Provide 3 options, each under 60 characters.

## Preview text
- One line under 120 characters.

## Opening
- 2-4 sentences that hook the reader on the topic.

## Main sections
- 2-4 sections with subheadings, each with a clear takeaway. Keep paragraphs short.

## Takeaway box
- 3 bullets summarizing what the reader should remember or do.

## CTA
- One clear call to action with suggested button text.

## P.S. line
- One optional short personal note or link teaser.

Rules:
- Use only the material supplied in the notes; do not invent metrics, quotes, reviews, or prices.
- Keep the tone consistent with the selection throughout.
- Use neutral language with no emoji.
- For short-5min keep the total under roughly 500 words; for standard-10min under roughly 1000 words.`,
  outputType: 'markdown',
  suggestedChainFrom: ['blog-post-seo-optimizer', 'linkedin-post-writer'],
}
