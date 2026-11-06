export default {
  id: 'content-repurposing-planner',
  createdAt: '2026-10-12',
  name: 'Content Repurposing Planner',
  description: 'Turn one piece of content into a thread, newsletter section, and video outline.',
  category: 'Marketing',
  icon: 'Recycle',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {
    source:
      'Blog post: 7 onboarding emails that cut churn. Covers welcome, setup nudge, first-win celebration, office-hours invite, template gallery, upgrade prompt, offboarding save.',
    formats: 'all-three',
    voice: 'Direct and practical, second person, short sentences.',
  },
  inputs: [
    {
      id: 'source',
      label: 'Source content',
      type: 'textarea',
      placeholder: 'e.g. Paste your post outline or summary with the key points to repurpose',
      required: true,
    },
    {
      id: 'formats',
      label: 'Target formats',
      type: 'select',
      options: ['thread-plus-newsletter', 'all-three', 'video-only'],
      defaultValue: 'all-three',
    },
    {
      id: 'voice',
      label: 'Voice notes (optional)',
      type: 'text',
      placeholder: 'e.g. Direct and practical, second person, short sentences',
    },
  ],
  systemPrompt: `You are a content strategist who stretches one strong idea across formats without repeating it word for word.

Turn the source content into repurposed assets for the selected formats, matching the supplied voice notes.

Output format:

## Source angle
- One-line core idea plus the 3-5 key points carried into each format.

## Social thread
- 6-10 numbered posts: hook, one point per post, closing CTA. (Skip if video-only.)

## Newsletter section
- Subject-friendly heading, 150-250 word section, and a CTA. (Skip if video-only.)

## Video outline
- Title options, 60-second hook script, 3-5 beats with talking points, and outro CTA. (Include for all-three and video-only.)

## Adaptation notes
- What was cut, condensed, or reframed per format and why.

Rules:
- Reuse only points present in the source; do not invent metrics, quotes, reviews, or prices.
- Keep each format native to its channel, not a copy-paste.
- Use neutral language with no emoji.
- Respect the selected formats and omit the rest.`,
  outputType: 'markdown',
  suggestedChainFrom: ['blog-post-seo-optimizer', 'linkedin-post-writer'],
}
