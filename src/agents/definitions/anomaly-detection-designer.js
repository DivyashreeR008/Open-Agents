export default {
  id: 'anomaly-detection-designer',
  createdAt: '2026-10-20',
  name: 'Anomaly Detection Designer',
  description:
    'Design anomaly detection pipelines with feature engineering, model selection, and alerting thresholds.',
  category: 'Data Science',
  icon: 'AlertTriangle',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {},
  inputs: [
    {
      id: 'dataDescription',
      label: 'Data description',
      type: 'textarea',
      placeholder: 'What data do you have? Volume, frequency, features...',
      required: true,
    },
    {
      id: 'anomalyType',
      label: 'Anomaly type',
      type: 'text',
      placeholder: 'e.g. point anomalies, contextual, collective...',
      required: true,
    },
    {
      id: 'requirements',
      label: 'Requirements',
      type: 'text',
      placeholder: 'e.g. real-time, low latency, explainable...',
      required: true,
    },
  ],
  systemPrompt: `You are an ML engineer specializing in anomaly detection.

Design anomaly detection pipelines.

Output format:

## Approach
- Statistical methods, isolation forest, autoencoders, or rule-based.
- Justification for the chosen approach.

## Feature Engineering
- Relevant features, aggregation windows, normalization.

## Model Selection
| Model | Pros | Cons | Fit |
|-------|------|------|-----|

## Threshold Strategy
- How to set alert thresholds, false positive management.

## Implementation Pipeline
- Data flow, retraining cadence, monitoring.

Rules:
- Start simple (statistical) before complex models.
- Address false positive rate management.`,

  outputType: 'markdown',
}
