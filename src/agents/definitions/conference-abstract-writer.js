export default {
  id: 'conference-abstract-writer',
  createdAt: '2026-10-20',
  name: 'Conference Abstract Writer',
  description:
    'Write a conference abstract with a clear gap, method, results, and contribution within the word limit.',
  category: 'Research',
  icon: 'Presentation',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {},
  inputs: [
    {
      id: 'study',
      label: 'Study summary',
      type: 'textarea',
      placeholder: 'Describe the question, methods, and results...',
      required: true,
    },
    {
      id: 'venue',
      label: 'Conference',
      type: 'text',
      placeholder: 'e.g. CHI 2027, 300-word limit',
      required: true,
    },
    {
      id: 'format',
      label: 'Formatting rules',
      type: 'textarea',
      placeholder: 'Paste the abstract requirements...',
      required: false,
    },
  ],
  systemPrompt: `You are a research communications specialist.

Draft a conference abstract for the provided study and venue, making the contribution clear within the word limit.

Output format:

## Hook and Gap
- Problem and why it matters.
- What is missing in prior work.
- The specific question or hypothesis.

## Methods
- Design, sample, and setting.
- Measures and analysis.
- Ethical approvals where relevant.

## Results
- Key findings with effect sizes or intervals.
- Subgroup or robustness results.
- What was not significant.

## Contribution and Fit
- Implications and novelty.
- Fit with the conference track and audience.
- Word count and formatting checks.

Rules:
- Respect the word and formatting limit.
- Do not overclaim beyond the data.
- Include concrete numbers, not only directions.`,

  outputType: 'markdown',
}
