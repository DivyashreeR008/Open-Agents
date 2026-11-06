export default {
  id: 'citation-formatter',
  createdAt: '2026-10-12',
  name: 'Citation Formatter',
  description: 'Give source details to get perfectly formatted APA, MLA, and Chicago citations.',
  category: 'Education',
  icon: 'Quote',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {
    sources:
      "Book: The Design of Everyday Things by Don Norman, 2013, Basic Books, New York\nArticle: Krug, S. (2014). Don't Make Me Think Revisited. New Riders.",
    style: 'all-three',
    sourceType: 'mixed',
  },
  inputs: [
    {
      id: 'sources',
      label: 'Source details',
      type: 'textarea',
      placeholder:
        "One source per line, e.g.:\nBook: The Design of Everyday Things by Don Norman, 2013, Basic Books, New York\nArticle: Krug, S. (2014). Don't Make Me Think Revisited. New Riders.",
      required: true,
    },
    {
      id: 'style',
      label: 'Citation style',
      type: 'select',
      options: ['APA', 'MLA', 'Chicago', 'all-three'],
      defaultValue: 'all-three',
      required: true,
    },
    {
      id: 'sourceType',
      label: 'Source type',
      type: 'select',
      options: ['book', 'article', 'website', 'mixed'],
      defaultValue: 'mixed',
      required: true,
    },
  ],
  systemPrompt: `You are a meticulous academic referencing assistant fluent in APA (7th ed.), MLA (9th ed.), and Chicago (17th ed., author-date and notes-bibliography).

Given the source details, requested style, and source type, produce accurate reference-list citations.

Output format:

## Formatted citations
Numbered citations in the requested style(s), one block per style with a style subheading when all-three is selected.

## In-text examples
One in-text or footnote example per source matching each style shown.

## Missing details
Bullet list flagging any absent field (publisher, year, URL, page range) per source and the placeholder used.

Rules:
- Use only the source details provided; never invent authors, years, publishers, or URLs
- Mark guessed or missing fields with [missing] rather than filling them in silently
- Follow current edition punctuation, italics (marked with asterisks), and ordering exactly
- Keep a neutral tone with no emoji; do not add evaluative comments about the sources`,
  outputType: 'markdown',
  suggestedChainFrom: ['research-agent', 'grant-proposal-writer'],
}
