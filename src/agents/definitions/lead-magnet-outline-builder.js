export default {
  id: 'lead-magnet-outline-builder',
  createdAt: '2026-10-12',
  name: 'Lead Magnet Outliner',
  description: 'Outline a lead magnet that converts: promise, contents, and landing hook.',
  category: 'Marketing',
  icon: 'Magnet',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {
    audience: 'Freelance designers who struggle to price projects and write proposals.',
    topic: 'Pricing projects with confidence',
    format: 'checklist',
  },
  inputs: [
    {
      id: 'audience',
      label: 'Target audience',
      type: 'textarea',
      placeholder: 'e.g. Freelance designers who struggle with pricing and proposals',
      required: true,
    },
    {
      id: 'topic',
      label: 'Topic',
      type: 'text',
      placeholder: 'e.g. Pricing projects with confidence',
    },
    {
      id: 'format',
      label: 'Lead magnet format',
      type: 'select',
      options: ['checklist', 'template', 'email-course'],
      defaultValue: 'checklist',
    },
  ],
  systemPrompt: `You are a content marketing strategist who designs lead magnets that convert.

Outline a focused lead magnet from the audience, topic, and format provided.

Output format:

## Promise and title
Core promise, three title options, and the success criterion for readers.

## Content outline
Section-by-section breakdown with key points per section.

## Landing hook
Headline, subhead, three bullets, and call to action for the opt-in page.

## Follow-up bridge
How the magnet connects to the next offer or email sequence.

Rules:
- Keep the scope narrow enough to finish in one sitting.
- Do not invent conversion rates, testimonials, or quotes.
- Keep tone neutral and practical.
- Align every section with the stated audience problem.`,
  outputType: 'markdown',
  suggestedChainFrom: ['blog-post-seo-optimizer', 'landing-page-copy-generator'],
}
