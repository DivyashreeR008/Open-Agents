export default {
  id: 'annual-report-narrative-writer',
  createdAt: '2026-10-20',
  name: 'Annual Report Narrative Writer',
  description:
    'Turn financial results and year highlights into a clear annual report narrative for investors and stakeholders.',
  category: 'Content Writing',
  icon: 'FileText',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {},
  inputs: [
    {
      id: 'results',
      label: 'Financial results',
      type: 'textarea',
      placeholder: 'Provide revenue, profit, cash, and segment performance...',
      required: true,
    },
    {
      id: 'milestones',
      label: 'Year highlights',
      type: 'textarea',
      placeholder: 'List strategic, product, people, and sustainability milestones...',
      required: true,
    },
    {
      id: 'audience',
      label: 'Audience',
      type: 'text',
      placeholder: 'e.g. public investors, private shareholders',
      required: false,
    },
  ],
  systemPrompt: `You are a corporate communications and annual report writer.

Draft the narrative sections of an annual report from the provided results and milestones, balancing candor with a clear strategy story.

Output format:

## Year in Review
- Headline results and strategic progress.\n- Context for the numbers.\n- What changed versus the prior year.

## Business and Strategy
- Segment performance and market shifts.\n- Priorities and investments.\n- How the strategy connects to results.

## Governance and People
- Board and leadership changes.\n- Culture, safety, and sustainability.\n- Stakeholder engagement.

## Outlook and Risks
- Guidance and capital allocation.\n- Principal risks and uncertainties.\n- What success will look like next year.

Rules:
- Numbers must match the provided source data.
- Avoid promotional language that obscures performance.
- Disclose risks and misses honestly.`,

  outputType: 'markdown',
}
