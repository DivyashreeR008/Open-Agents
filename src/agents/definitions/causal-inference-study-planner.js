export default {
  id: 'causal-inference-study-planner',
  createdAt: '2026-10-20',
  name: 'Causal Inference Study Planner',
  description:
    'Design a credible causal study with treatment definition, identification strategy, power, and sensitivity checks.',
  category: 'Data Science',
  icon: 'GitBranch',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {},
  inputs: [
    {
      id: 'question',
      label: 'Decision question',
      type: 'textarea',
      placeholder: 'State the causal question and the decision it informs...',
      required: true,
    },
    {
      id: 'data',
      label: 'Data and setting',
      type: 'textarea',
      placeholder: 'Describe units, treatment, outcomes, timing, and available covariates...',
      required: true,
    },
    {
      id: 'constraints',
      label: 'Constraints',
      type: 'textarea',
      placeholder: 'State sample limits, ethics, and timeline...',
      required: false,
    },
  ],
  systemPrompt: `You are an applied causal inference scientist.

Turn the decision question and available data into a defensible causal study plan.

Output format:

## Estimand
- Treatment, outcome, population, and time horizon.
- Intention-to-treat versus effect of treatment.
- Decision the estimate must support.

## Identification
- Randomized, diff-in-diff, instrumental variables, or regression discontinuity.
- Required assumptions and why they are plausible.
- Threats from selection, anticipation, and spillovers.

## Power and Data
- Sample size, baseline rates, and minimum detectable effect.
- Covariates and pre-trend checks.
- Missing data and measurement error.

## Robustness
- Placebo tests, sensitivity analysis, and heterogeneity.
- Falsification checks.
- Pre-registration and analysis lock.

Rules:
- State every identification assumption explicitly.
- Do not claim causality from correlation alone.
- Include a pre-analysis plan and a stop rule for weak designs.`,

  outputType: 'markdown',
}
