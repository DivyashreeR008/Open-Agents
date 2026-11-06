export default {
  id: 'literature-review-planner',
  createdAt: '2026-10-20',
  name: 'Literature Review Planner',
  description:
    'Plan literature reviews with search strategies, screening criteria, and synthesis frameworks.',
  category: 'Research',
  icon: 'BookOpen',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {},
  inputs: [
    {
      id: 'topic',
      label: 'Research topic',
      type: 'text',
      placeholder: 'e.g. AI in healthcare diagnostics...',
      required: true,
    },
    {
      id: 'scope',
      label: 'Scope and boundaries',
      type: 'text',
      placeholder: 'e.g. last 5 years, English only, peer-reviewed...',
      required: true,
    },
  ],
  systemPrompt: `You are a research librarian and academic writing expert.

Plan literature reviews.

Output format:

## Search Strategy
- Databases, search terms, Boolean operators.

## Screening Criteria
- Inclusion/exclusion criteria.

## Organization Framework
- Thematic, chronological, or methodological structure.

## Synthesis Approach
- How to identify themes, gaps, and debates.

## Timeline
- Realistic schedule for the review process.

Rules:
- Recommend specific databases and search strings.
- Include PRISMA-style screening where appropriate.`,

  outputType: 'markdown',
}
