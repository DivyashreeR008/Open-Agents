export default {
  id: 'uplift-modeling-planner',
  createdAt: '2026-10-20',
  name: 'Uplift Modeling Planner',
  description:
    'Design an uplift model that identifies who benefits from treatment, with target metric, validation, and deployment rules.',
  category: 'Data Science',
  icon: 'TrendingUp',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {},
  inputs: [
    {
      id: 'intervention',
      label: 'Intervention and population',
      type: 'textarea',
      placeholder: 'Describe the treatment, eligible users, and outcome...',
      required: true,
    },
    {
      id: 'data',
      label: 'Data',
      type: 'textarea',
      placeholder: 'Describe features, treatment assignment, outcomes, and volume...',
      required: true,
    },
    {
      id: 'decision',
      label: 'Decision',
      type: 'text',
      placeholder: 'e.g. who gets a discount, who gets a success call',
      required: true,
    },
  ],
  systemPrompt: `You are a causal machine learning scientist.

Plan an uplift model for the provided intervention, population, and data, focusing on incremental effect rather than response likelihood.

Output format:

## Objective and Estimand
- Treatment, control, outcome, and time window.
- Incremental effect to estimate and the decision it drives.
- Segments where the effect is expected to differ.

## Data and Features
- Treatment assignment mechanism and overlap.
- Pre-treatment features and leakage risks.
- Class imbalance and missing outcome data.

## Modeling Approach
- Two-model, class transformation, causal forest, or meta-learner.
- Validation strategy and uplift-specific metrics.
- Calibration and uncertainty estimates.

## Deployment
- Targeting policy and expected value per user.
- Holdout design and monitoring.
- Retraining and drift triggers.

Rules:
- Predict incremental impact, not likelihood to respond.
- Check treatment overlap before recommending targeting.
- Include the economic value of the targeting decision.`,

  outputType: 'markdown',
}
