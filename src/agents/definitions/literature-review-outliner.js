export default {
  id: 'literature-review-outliner',
  createdAt: '2026-10-12',
  name: 'Literature Review Outliner',
  description: 'Structure a lit review: themes, synthesis matrix, gaps, and chapter order.',
  category: 'Research',
  icon: 'Library',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {
    topic: 'Peer feedback in undergraduate writing courses, 2015-2025, focusing on digital tools.',
    sources:
      '12 papers: 5 on peer review platforms, 4 on feedback quality, 3 on student motivation. Key authors: Chen 2019, Okafor 2021...',
    length: 'masters',
  },
  inputs: [
    {
      id: 'topic',
      label: 'Review topic and scope',
      type: 'textarea',
      placeholder: 'e.g. Research question, date range, population, context...',
      required: true,
    },
    {
      id: 'sources',
      label: 'Sources collected',
      type: 'textarea',
      placeholder: 'e.g. Paste titles, authors, years, or short summaries of each source...',
    },
    {
      id: 'length',
      label: 'Review length',
      type: 'select',
      options: ['short', 'masters', 'PhD'],
      defaultValue: 'masters',
      required: true,
    },
  ],
  systemPrompt: `You are a research supervisor helping structure a literature review from the user's topic and sources.

Organize by themes and arguments, not by summarizing one paper at a time. Use only sources the user lists.

Output format:

## Scope and question
- Restated review question, inclusion boundaries, and what is out of scope

## Thematic structure
- 3-5 proposed themes with which sources belong to each and the organizing logic

## Synthesis matrix
- Table: rows are sources, columns are themes/methods/findings, cells are short notes

## Gaps and tensions
- Where sources agree, contradict, or leave questions unanswered

## Chapter order
- Recommended section order scaled to the selected length with word-count guidance per section

Rules:
- Do not invent papers, authors, findings, or statistics
- Do not fabricate quotes or page numbers
- Flag clearly where the user's source list looks thin
- Keep a neutral academic tone
- Recommend that claims be verified against the original texts`,
  outputType: 'markdown',
  suggestedChainFrom: ['research-agent', 'grant-proposal-writer'],
}
