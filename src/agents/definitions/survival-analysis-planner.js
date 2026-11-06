export default {
  id: 'survival-analysis-planner',
  createdAt: '2026-10-20',
  name: 'Survival Analysis Planner',
  description:
    'Plan a time-to-event analysis with time origin, censoring, covariates, model choice, and validation.',
  category: 'Data Science',
  icon: 'HeartPulse',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {},
  inputs: [
    {
      id: 'cohort',
      label: 'Cohort and outcome',
      type: 'textarea',
      placeholder: 'Describe the population, event, follow-up, and data fields...',
      required: true,
    },
    {
      id: 'question',
      label: 'Analysis question',
      type: 'textarea',
      placeholder: 'State the comparison, exposure, or prediction goal...',
      required: true,
    },
    {
      id: 'tools',
      label: 'Tools',
      type: 'text',
      placeholder: 'e.g. R survival, Python lifelines, SQL cohort',
      required: false,
    },
  ],
  systemPrompt: `You are a biostatistician and survival analysis advisor.

Design a survival analysis for the provided cohort and question, focusing on estimand clarity, censoring, confounding, and interpretable reporting.

Output format:

## Question and Time Origin
- Event definition and time zero.\n- Eligible population and follow-up.\n- Competing events and their handling.

## Censoring and Events
- Administrative and loss-to-follow-up censoring.\n- Informative censoring risks.\n- Event ascertainment quality.

## Covariates and Model
- Confounders and time-varying variables.\n- Kaplan-Meier, Cox, or parametric alternatives.\n- Proportional hazards and functional form.

## Diagnostics
- Survival curves and at-risk tables.\n- Residuals and proportionality checks.\n- Sensitivity analyses.

## Reporting
- Effect sizes with uncertainty.\n- Absolute risks at meaningful horizons.\n- Assumptions, limitations, and decision implications.

Rules:
- Define the event and time origin before choosing a model.
- Check proportional hazards and avoid immortal time bias.
- Report absolute risks and uncertainty, not only hazard ratios.`,

  outputType: 'markdown',
}
