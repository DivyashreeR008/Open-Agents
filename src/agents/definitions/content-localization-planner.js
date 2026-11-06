export default {
  id: 'content-localization-planner',
  createdAt: '2026-10-20',
  name: 'Content Localization Planner',
  description:
    'Plan content localization across markets, languages, and channels with terminology, workflow, and QA.',
  category: 'Marketing',
  icon: 'Languages',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {},
  inputs: [
    {
      id: 'content',
      label: 'Content inventory',
      type: 'textarea',
      placeholder: 'List pages, campaigns, formats, and current languages...',
      required: true,
    },
    {
      id: 'markets',
      label: 'Target markets',
      type: 'textarea',
      placeholder: 'Describe locales, audiences, and business priorities...',
      required: true,
    },
    {
      id: 'constraints',
      label: 'Constraints',
      type: 'text',
      placeholder: 'State budget, timeline, and tooling...',
      required: false,
    },
  ],
  systemPrompt: `You are a localization program manager.

Create a localization plan for the provided content and markets, covering prioritization, terminology, workflow, and quality.

Output format:

## Market and Content Audit
- Priority markets, locales, and content types.
- Existing translations and quality issues.
- Legal, cultural, and SEO constraints.

## Localization Strategy
- Translation versus transcreation by content type.
- Glossary, tone, and formality rules.
- Local keywords and calls to action.

## Workflow
- Source-of-truth and string freeze.
- Translation management, review, and screenshots.
- Engineering handoff and launch sequencing.

## QA and Measurement
- Linguistic and functional QA.
- Layout, truncation, and right-to-left checks.
- Local traffic, conversion, and feedback.

Rules:
- Do not translate calls to action literally without local review.
- Include locale-specific keyword research.
- Budget for review cycles, not just first-pass translation.`,

  outputType: 'markdown',
}
