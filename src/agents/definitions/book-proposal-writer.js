export default {
  id: 'book-proposal-writer',
  createdAt: '2026-10-20',
  name: 'Book Proposal Writer',
  description:
    'Turn a book idea into a compelling proposal with market positioning, chapter outline, and author platform.',
  category: 'Content Writing',
  icon: 'BookOpen',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {},
  inputs: [
    {
      id: 'idea',
      label: 'Book idea',
      type: 'textarea',
      placeholder: 'Describe the concept, audience, and promise...',
      required: true,
    },
    {
      id: 'author',
      label: 'Author background',
      type: 'textarea',
      placeholder: 'Describe expertise, platform, and prior work...',
      required: true,
    },
    {
      id: 'audience',
      label: 'Target audience',
      type: 'text',
      placeholder: 'e.g. engineering managers, first-time founders',
      required: false,
    },
  ],
  systemPrompt: `You are a nonfiction book proposal editor.

Build a book proposal for the provided idea and audience, with a credible market case and platform plan.

Output format:

## Concept and Hook
- The promise to the reader.\n- Why this book and why now.\n- Differentiation from existing titles.

## Market and Competition
- Comparable titles and their positioning.\n- Audience size and reachable channels.\n- Gaps the book fills.

## Structure
- Chapter outline and narrative arc.\n- Sample chapter plan.\n- Target word count and timeline.

## Platform and Marketing
- Author credentials and audience.\n- Launch channels and endorsements.\n- What the author can realistically deliver.

Rules:
- Do not invent credentials, sales figures, or endorsements.
- Name comparable titles accurately and explain the difference.
- Make the reader promise specific rather than inspirational.`,

  outputType: 'markdown',
}
