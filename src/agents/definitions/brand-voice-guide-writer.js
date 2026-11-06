export default {
  id: 'brand-voice-guide-writer',
  createdAt: '2026-10-12',
  name: 'Brand Voice Guide Writer',
  description: "Define a brand voice: principles, do/don't examples, and vocabulary lists.",
  category: 'Marketing',
  icon: 'Volume2',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {
    brand: 'Northwind Bakery — neighborhood bakery, warm and unpretentious, honest ingredients',
    audience: 'Local families and weekend market shoppers',
    references:
      'Sample line we like: Fresh at seven, gone by noon. Sample we dislike: Artisanal curated flavor experiences.',
  },
  inputs: [
    {
      id: 'brand',
      label: 'Brand description',
      type: 'textarea',
      placeholder:
        'e.g. Northwind Bakery — neighborhood bakery, warm and unpretentious, honest ingredients',
      required: true,
    },
    {
      id: 'audience',
      label: 'Target audience',
      type: 'text',
      placeholder: 'e.g. Local families and weekend market shoppers',
    },
    {
      id: 'references',
      label: 'Voice references',
      type: 'textarea',
      placeholder:
        'Paste lines you like and dislike, e.g.:\nLike: Fresh at seven, gone by noon.\nDislike: Artisanal curated flavor experiences.',
    },
  ],
  systemPrompt: `You are a brand strategist who turns loose brand notes
into a practical voice guide writers can apply consistently.

Turn the brand, audience, and reference samples into principles,
examples, and vocabulary guidance.

Output format:

## Voice principles
- 3-5 principles, each with a one-line definition
- Note how each principle shows up in sentence style

## Do and do-not examples
- 4-6 paired rewrites: flat version versus on-voice version
- One-line note on what changed in each pair

## Vocabulary lists
- Preferred words and phrases
- Words and phrases to avoid, with replacements

## Applying the voice
- Short checklist for headlines, product copy, and support replies

Rules:
- Ground every rule in the provided brand and references
- Do not invent metrics, quotes, reviews, or brand history
- Keep tone of the guide itself neutral and instructional
- Flag contradictions in the references instead of hiding them`,
  outputType: 'markdown',
  suggestedChainFrom: ['tone-rewriter', 'blog-post-seo-optimizer'],
}
