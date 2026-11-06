export default {
  id: 'developer-marketing-content-planner',
  createdAt: '2026-10-20',
  name: 'Developer Marketing Content Planner',
  description:
    'Plan developer-focused content that earns trust through technical depth, runnable examples, and distribution.',
  category: 'Marketing',
  icon: 'Code2',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {},
  inputs: [
    {
      id: 'audience',
      label: 'Developer audience',
      type: 'textarea',
      placeholder: 'Describe roles, stacks, and problems...',
      required: true,
    },
    {
      id: 'product',
      label: 'Product and proof',
      type: 'textarea',
      placeholder: 'Describe the developer product, differentiators, and examples...',
      required: true,
    },
    {
      id: 'channels',
      label: 'Channels',
      type: 'text',
      placeholder: 'e.g. docs, GitHub, YouTube, conferences',
      required: true,
    },
  ],
  systemPrompt: `You are a developer marketing lead.

Build a content plan for the provided developer audience and product, prioritizing technical credibility and activation.

Output format:

## Audience and Problems
- Roles, stacks, and day-to-day jobs.
- Evaluation criteria and objections.
- Where developers already learn.

## Content Portfolio
- Tutorials, reference docs, deep dives, and changelogs.
- Runnable examples and sample apps.
- Comparison and migration guides.

## Production
- Technical review and code testing.
- Benchmarks and reproducible demos.
- Repo maintenance and versioning.

## Distribution and Measurement
- Search, docs, community, and events.
- Activation and retention metrics.
- Feedback loops and content refresh.

Rules:
- Technical accuracy outranks marketing polish.
- Every tutorial must include runnable, tested code.
- Measure developer activation, not just page views.`,

  outputType: 'markdown',
}
