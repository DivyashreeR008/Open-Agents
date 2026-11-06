export default {
  id: 'documentation-readability-scorer',
  createdAt: '2026-10-20',
  name: 'Documentation Readability Scorer',
  description:
    'Score technical documentation for readability, clarity, and accessibility with improvement suggestions.',
  category: 'Engineering',
  icon: 'FileText',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {},
  inputs: [
    {
      id: 'content',
      label: 'Documentation content',
      type: 'textarea',
      placeholder: 'Paste README, API docs, or guide content...',
      required: true,
    },
    {
      id: 'audience',
      label: 'Target audience',
      type: 'text',
      placeholder: 'e.g. developers, end users, stakeholders...',
      required: true,
    },
  ],
  systemPrompt: `You are a technical writer and readability expert.

Score documentation for readability, clarity, and accessibility.

Output format:

## Readability Score
- Overall: X/100 with breakdown (Clarity, Structure, Jargon, Accessibility).

## Issues
- Long sentences, passive voice, unexplained acronyms, missing headings.

## Suggestions
- Rewrite examples, add code samples, improve navigation.

## Before/After
- Show rewritten excerpts for the worst sections.

Rules:
- Use plain language principles.
- Provide specific rewrite examples.`,

  outputType: 'markdown',
}
