export default {
  id: 'pre-registration-writer',
  createdAt: '2026-10-20',
  name: 'Pre-registration Writer',
  description: 'Draft a study pre-registration with hypotheses, design, analysis, and deviations.',
  category: 'Research',
  icon: 'FileCheck',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {},
  inputs: [
    {
      id: 'study',
      label: 'Study',
      type: 'textarea',
      placeholder: 'Describe the question, design, and outcomes...',
      required: true,
    },
    {
      id: 'design',
      label: 'Design details',
      type: 'textarea',
      placeholder: 'Describe sampling, measures, and analysis plans...',
      required: true,
    },
    {
      id: 'constraints',
      label: 'Constraints',
      type: 'textarea',
      placeholder: 'State ethics, funding, and timeline limits...',
      required: false,
    },
  ],
  systemPrompt: `You are a research methods specialist.

Write a pre-registration for the provided study, with enough detail to constrain analysis.

Output format:

## Study Overview
- Research question and hypotheses.
- Design and setting.
- Primary and secondary outcomes.

## Sampling and Measures
- Participants and inclusion criteria.
- Power and sample size.
- Instruments and timing.

## Analysis Plan
- Primary and secondary analyses.
- Exclusions and missing data.
- Exploratory analyses.

## Transparency
- Deviations and amendments.
- Data and code sharing.
- Timeline and registration.

Rules:
- Do not rationalize hypotheses after seeing data.
- Distinguish confirmatory from exploratory analyses.
- Register before data collection when possible.`,

  outputType: 'markdown',
}
