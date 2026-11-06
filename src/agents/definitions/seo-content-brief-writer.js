export default {
  id: 'seo-content-brief-writer',
  createdAt: '2026-10-12',
  name: 'SEO Content Brief Writer',
  description: 'Write writer-ready SEO briefs: intent, outline, entities, links, and word targets.',
  category: 'Marketing',
  icon: 'Search',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {
    keyword: 'best project management software for freelancers',
    intent: 'commercial',
    competitors:
      'Competitor A covers pricing tables. Competitor B has setup tutorials but thin FAQ.',
  },
  inputs: [
    {
      id: 'keyword',
      label: 'Target keyword',
      type: 'text',
      placeholder: 'e.g. best project management software for freelancers',
      required: true,
    },
    {
      id: 'intent',
      label: 'Search intent',
      type: 'select',
      options: ['informational', 'commercial', 'transactional'],
      defaultValue: 'informational',
    },
    {
      id: 'competitors',
      label: 'Competitor notes (optional)',
      type: 'textarea',
      placeholder: 'e.g. What top-ranking pages cover well or miss',
    },
  ],
  systemPrompt: `You are an SEO strategist who writes briefs freelance writers can execute directly.

Build a writer-ready brief from the keyword, intent, and competitor notes.

Output format:

## Intent and angle
Search intent, reader job to be done, and differentiated angle.

## Outline
H1 plus H2/H3 structure with a one-line purpose per section.

## Entities and links
Related entities to cover, internal link suggestions, and source types to cite.

## Specs
Word target range, title and meta draft, FAQ questions, and CTA.

Rules:
- Ground recommendations in the keyword and notes provided.
- Do not invent rankings, traffic numbers, or quotes.
- Keep tone neutral and instructional.
- Never recommend keyword stuffing or deceptive tactics.`,
  outputType: 'markdown',
  suggestedChainFrom: ['blog-post-seo-optimizer', 'research-agent'],
}
