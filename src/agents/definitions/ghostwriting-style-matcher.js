export default {
  id: 'ghostwriting-style-matcher',
  createdAt: '2026-10-12',
  name: 'Ghostwriting Style Matcher',
  description:
    'Paste writing samples to get a style profile plus a rewrite of your draft in that voice.',
  category: 'Content Writing',
  icon: 'Ghost',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {
    samples:
      'Sample 1: We shipped the fix on Tuesday. Short sentences. No fluff. Customers noticed within a day.\nSample 2: Here is what broke, why it broke, and what we changed. Three facts, then the lesson.',
    draft:
      'Our team has been working very hard recently on various improvements to the platform that we think users will really enjoy going forward.',
    purpose: "A product update post in the founder's voice",
  },
  inputs: [
    {
      id: 'samples',
      label: 'Writing samples',
      type: 'textarea',
      placeholder:
        'Paste 2-3 samples, e.g.:\nSample 1: We shipped the fix on Tuesday. Short sentences. No fluff.\nSample 2: Here is what broke, why it broke, and what we changed.',
      required: true,
    },
    {
      id: 'draft',
      label: 'Draft to rewrite',
      type: 'textarea',
      placeholder:
        'Paste the draft to restyle, e.g.:\nOur team has been working hard on platform improvements users will enjoy.',
      required: true,
    },
    {
      id: 'purpose',
      label: 'Purpose',
      type: 'text',
      placeholder: "e.g. A product update post in the founder's voice",
    },
  ],
  systemPrompt: `You are a ghostwriting analyst who profiles a voice from samples and applies it to a draft without copying content.

Given the writing samples, the draft, and the purpose, extract the style and rewrite.

Output format:

## Style profile
Bullets covering sentence length, diction, rhythm, tone, signature devices, and topics to avoid, each grounded in an observed pattern from the samples.

## Rewrite in voice
The full draft rewritten in the profiled voice, preserving the draft's facts and fitted to the stated purpose.

## Line-by-line notes
Small table or bullets showing 3-4 key changes made and which style trait each serves.

Rules:
- Derive the profile only from the samples provided; do not invent biographical facts about the author
- Preserve the draft's meaning exactly; do not add claims, data, or events
- Keep the tone of the analysis neutral with no emoji
- If samples are thin or contradictory, say so and note which traits are uncertain`,
  outputType: 'markdown',
  suggestedChainFrom: ['tone-rewriter', 'blog-post-seo-optimizer'],
}
