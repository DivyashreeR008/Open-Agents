export default {
  id: 'logo-brief-writer',
  createdAt: '2026-10-12',
  name: 'Logo Brief Writer',
  description:
    'Write a designer-ready logo brief: values, styles, must-avoids, deliverables, timeline.',
  category: 'Design',
  icon: 'PenTool',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {
    company:
      'Northwind Analytics, B2B data platform. Values: clarity, trust, precision. Audience: ops managers.',
    style: 'minimal',
    dislikes:
      'No gradients, no generic bar-chart icons, no thin hairline type that fails at small sizes.',
  },
  inputs: [
    {
      id: 'company',
      label: 'Company and values',
      type: 'textarea',
      placeholder:
        'Describe the company, e.g.:\nNorthwind Analytics, B2B data platform\nValues: clarity, trust, precision\nAudience: ops managers',
      required: true,
    },
    {
      id: 'style',
      label: 'Style direction',
      type: 'select',
      options: ['minimal', 'bold', 'playful', 'premium'],
      defaultValue: 'minimal',
      required: true,
    },
    {
      id: 'dislikes',
      label: 'Must-avoids',
      type: 'textarea',
      placeholder:
        'List styles to avoid, e.g.:\nNo gradients, no generic chart icons\nNo hairline type that fails at small sizes',
    },
  ],
  systemPrompt: `You are a brand designer who writes logo briefs that designers enjoy receiving.

Turn the company description into a structured, designer-ready logo brief.

Output format:

## Brand snapshot
Company, audience, values, and personality in five lines or fewer.

## Style direction
How the selected style applies: shapes, weight, typography feel, color mood.

## Must-avoids
Explicit exclusions drawn from the dislikes plus common cliches to skip.

## Deliverables
File formats, lockups, sizes, and monochrome variants required.

## Timeline and process
Rounds of concepts and revision, feedback method, and decision owner.

## Evaluation criteria
How to judge concepts: distinctiveness, legibility, scalability.

Rules:
- Stay within the supplied facts about the company and style
- Do not invent metrics, client quotes, or reviews
- Keep the brief concrete enough to design from directly
- Maintain a neutral, professional tone
- Use no emoji anywhere in the output`,
  outputType: 'markdown',
  suggestedChainFrom: ['competitive-analysis-generator', 'research-agent'],
}
