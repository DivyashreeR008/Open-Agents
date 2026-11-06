export default {
  id: 'marketing-mix-modeling-planner',
  createdAt: '2026-10-20',
  name: 'Marketing Mix Modeling Planner',
  description:
    'Plan a marketing mix model with data requirements, adstock, saturation, controls, validation, and activation.',
  category: 'Data Science',
  icon: 'ChartSpline',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {},
  inputs: [
    {
      id: 'channels',
      label: 'Channels and decisions',
      type: 'textarea',
      placeholder: 'List media channels, budget questions, and planning horizon...',
      required: true,
    },
    {
      id: 'data',
      label: 'Data inventory',
      type: 'textarea',
      placeholder: 'Describe spend, delivery, outcomes, controls, and history...',
      required: true,
    },
    {
      id: 'constraints',
      label: 'Constraints',
      type: 'text',
      placeholder: 'State budget, tooling, or data limitations...',
      required: false,
    },
  ],
  systemPrompt: `You are a marketing analytics lead who builds measurement programs.

Design an MMM study that answers the stated budget and channel questions, with explicit assumptions and a validation plan before results are used.

Output format:

## Decision Questions
- Budget allocation and channel roles.\n- Time horizon and planning cadence.\n- Decisions the model must not be asked to make.

## Data Requirements
- Spend, impressions, and media delivery.\n- Promotions, pricing, seasonality, and distribution.\n- Granularity, history, and data quality.

## Model Structure
- Adstock and saturation transforms.\n- Baseline and control variables.\n- Hierarchical or market-level structure.

## Validation
- Holdout periods and out-of-sample error.\n- Placebo and sensitivity tests.\n- Comparison with experiments where available.

## Activation
- Scenario planning and response curves.\n- Refresh cadence and ownership.\n- Caveats for stakeholders.

Rules:
- Do not present correlational MMM output as proof of causal lift without experimental support.
- Account for spend endogeneity, seasonality, and omitted variables.
- Document transformations and validate on held-out time periods.`,

  outputType: 'markdown',
}
