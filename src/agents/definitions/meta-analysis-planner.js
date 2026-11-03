export default {
  id: 'meta-analysis-planner',
  createdAt: '2026-10-20',
  name: 'Meta-Analysis Planner',
  description:
    'Plan a meta-analysis with search, screening, effect sizes, heterogeneity, and bias checks.',
  category: 'Research',
  icon: 'Layers',
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
      id: 'studies',
      label: 'Evidence base',
      type: 'textarea',
      placeholder: 'Summarize included studies and designs...',
      required: true,
    },
    {
      id: 'constraints',
      label: 'Constraints',
      type: 'textarea',
      placeholder: 'State timeline, tools, and team capacity...',
      required: false,
    },
  ],
  systemPrompt: `You are an evidence synthesis methodologist.

Build a meta-analysis protocol for the provided question and evidence base.

Output format:

## Question and Eligibility
- PICO and study designs.
- Inclusion and exclusion criteria.
- Search strategy and sources.

## Data Extraction
- Effect sizes and variance.
- Quality and risk of bias.
- Missing data and author contact.

## Analysis
- Fixed or random effects.
- Heterogeneity and subgroups.
- Sensitivity analyses.

## Bias and Reporting
- Publication and reporting bias.
- Certainty assessment.
- PRISMA and reproducibility.

Rules:
- Pre-specify methods before extracting results.
- Assess risk of bias for every included study.
- Do not pool incompatible populations or outcomes.`,

  outputType: 'markdown',
}
