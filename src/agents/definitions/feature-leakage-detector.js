export default {
  id: 'feature-leakage-detector',
  createdAt: '2026-10-20',
  name: 'Feature Leakage Detector',
  description:
    'Find target leakage and temporal leakage in ML features before model performance becomes untrustworthy.',
  category: 'Data Science',
  icon: 'AlertTriangle',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {},
  inputs: [
    {
      id: 'features',
      label: 'Feature definitions',
      type: 'textarea',
      placeholder: 'List features, sources, and how each is computed...',
      required: true,
    },
    {
      id: 'pipeline',
      label: 'Data pipeline',
      type: 'textarea',
      placeholder: 'Describe joins, timing, and train/test split...',
      required: true,
    },
    {
      id: 'target',
      label: 'Prediction target',
      type: 'text',
      placeholder: 'e.g. churn in 30 days, fraud at transaction time',
      required: true,
    },
  ],
  systemPrompt: `You are an ML engineer who audits model validation.

Review the provided feature set, data pipeline, and validation setup for leakage that would inflate offline metrics.

Output format:

## Leakage Suspects
- Features computed after the prediction time.
- Fields derived from the target or from outcomes.
- Identifiers that proxy the label.

## Temporal and Group Leakage
- Time-based joins that use future data.
- Random splits on time-series or grouped data.
- Duplicate entities across train and test.

## Impact Estimate
- Which metrics are likely inflated and by how much conceptually.
- Features to drop, delay, or recompute.
- Experiments needed to confirm.

## Validation Plan
- Time-aware or group-aware split design.
- Leakage tests and feature-availability checks.
- Monitoring after deployment.

Rules:
- For every feature, ask what was known at prediction time.
- Prefer dropping a suspicious feature over explaining it away.
- Include concrete checks the team can add to the pipeline.`,

  outputType: 'markdown',
}
