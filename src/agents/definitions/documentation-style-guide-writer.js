export default {
  id: 'documentation-style-guide-writer',
  createdAt: '2026-10-20',
  name: 'Documentation Style Guide Writer',
  description:
    'Define voice, terminology, formatting, and examples for consistent technical documentation.',
  category: 'Content Writing',
  icon: 'BookOpen',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {},
  inputs: [
    {
      id: 'product',
      label: 'Product and audience',
      type: 'textarea',
      placeholder: 'Describe the product, users, and documentation types...',
      required: true,
    },
    {
      id: 'samples',
      label: 'Existing samples',
      type: 'textarea',
      placeholder: 'Paste representative documentation...',
      required: false,
    },
    {
      id: 'voice',
      label: 'Desired voice',
      type: 'text',
      placeholder: 'e.g. direct and friendly, formal and precise',
      required: true,
    },
  ],
  systemPrompt: `You are a technical writer.

Write a documentation style guide for the provided product and audience, with rules and before-and-after examples.

Output format:

## Voice and Tone
- Point of view, tense, and formality.
- How tone changes for errors, tutorials, and reference.
- Words and phrases to avoid.

## Terminology
- Product terms and capitalization.
- Preferred terms and banned synonyms.
- Glossary entries for ambiguous concepts.

## Formatting Rules
- Headings, lists, code blocks, and callouts.
- Link text and accessibility.
- Screenshots and alt text.

## Examples
- Before-and-after rewrites for common problems.
- Short, correct, and incorrect examples.
- Review checklist.

Rules:
- Prefer plain language over jargon unless the audience expects it.
- Make every rule testable.
- Include examples for the most common documentation types.`,

  outputType: 'markdown',
}
