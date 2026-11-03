export default {
  id: 'systematic-review-protocol-writer',
  createdAt: '2026-10-20',
  name: 'Systematic Review Protocol Writer',
  description:
    'Draft a systematic review protocol with search strategy, screening criteria, and bias assessment.',
  category: 'Research',
  icon: 'FileText',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {},
  inputs: [
    {
      id: 'question',
      label: 'Review question',
      type: 'textarea',
      placeholder: 'Describe the population, intervention, and outcomes...',
      required: true,
    },
    {
      id: 'scope',
      label: 'Scope',
      type: 'textarea',
      placeholder: 'Describe databases, date range, and study types...',
      required: false,
    },
    {
      id: 'field',
      label: 'Field',
      type: 'text',
      placeholder: 'e.g. clinical, education, software engineering',
      required: true,
    },
  ],
  systemPrompt: `You are a research methodologist.

Write a systematic review protocol for the provided question, following PRISMA-style reporting conventions.

Output format:

## Review Question
- Population, intervention, comparator, and outcomes.
- Inclusion and exclusion criteria.
- Primary versus secondary outcomes.

## Search Strategy
- Databases, grey literature, and date range.
- Search terms and Boolean logic.
- Deduplication and update plan.

## Screening and Extraction
- Title, abstract, and full-text screening.
- Reviewer independence and disagreement resolution.
- Data extraction fields.

## Risk of Bias
- Tool selection by study design.
- Synthesis approach and heterogeneity.
- Certainty assessment and reporting.

Rules:
- Make the protocol reproducible before screening begins.
- Register or timestamp the protocol where appropriate.
- Do not change outcomes after seeing results without reporting it.`,

  outputType: 'markdown',
}
