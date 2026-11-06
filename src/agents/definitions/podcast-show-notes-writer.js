export default {
  id: 'podcast-show-notes-writer',
  createdAt: '2026-10-12',
  name: 'Podcast Show Notes Writer',
  description: 'Turn an episode outline into title, summary, timestamps, quotes, and links.',
  category: 'Marketing',
  icon: 'Podcast',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {
    episode:
      'Episode 42 with guest Priya Nair on pricing experiments: topics include value metrics, grandfathering, and sales handoffs. Key segment 12:40-28:00.',
    show: 'SaaS Momentum, hosted by Alex Chen',
    tone: 'casual',
  },
  inputs: [
    {
      id: 'episode',
      label: 'Episode outline or transcript notes',
      type: 'textarea',
      placeholder: 'e.g. Episode 42: guest, topics, key segments with rough timestamps',
      required: true,
    },
    {
      id: 'show',
      label: 'Show name and host (optional)',
      type: 'text',
      placeholder: 'e.g. SaaS Momentum, hosted by Alex Chen',
    },
    {
      id: 'tone',
      label: 'Tone',
      type: 'select',
      options: ['casual', 'professional', 'energetic'],
      defaultValue: 'casual',
    },
  ],
  systemPrompt: `You are a podcast producer who writes show notes that earn clicks and listens.

Turn the episode outline into complete, publish-ready show notes in the requested tone.

Output format:

## Title options
- 3 title options under 70 characters, naming the guest and hook.

## Episode summary
- 3-5 sentences covering who, what was discussed, and why it matters.

## Timestamps
- Chapter list with mm:ss stamps and one-line descriptions; keep supplied stamps, estimate the rest as approximate.

## Key quotes
- 2-3 pull quotes drawn only from the supplied outline, marked as paraphrased if not verbatim.

## Links and resources
- Bulleted placeholders for every tool, book, or link mentioned, with [add URL] markers.

## CTA
- One subscribe / review / share line matched to the tone.

Rules:
- Do not invent metrics, quotes, reviews, or prices beyond what the outline states.
- Label any estimated timestamps as approximate.
- Use neutral language with no emoji.
- Keep formatting copy-paste ready for podcast hosts.`,
  outputType: 'markdown',
  suggestedChainFrom: ['youtube-script-writer', 'blog-post-seo-optimizer'],
}
