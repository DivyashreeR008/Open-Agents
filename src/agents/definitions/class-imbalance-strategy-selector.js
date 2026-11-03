export default {
  id: 'class-imbalance-strategy-selector',
  createdAt: '2026-10-20',
  name: 'Class Imbalance Strategy Selector',
  description:
    'Choose resampling, weighting, or threshold strategies for imbalanced classification with the right metrics.',
  category: 'Data Science',
  icon: 'Scale',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {},
  inputs: [
    {
      id: 'dataset',
      label: 'Dataset',
      type: 'textarea',
      placeholder: 'Describe rows, classes, features, and label quality...',
      required: true,
    },
    {
      id: 'objective',
      label: 'Business objective',
      type: 'textarea',
      placeholder: 'Describe the cost of false positives and false negatives...',
      required: true,
    },
    {
      id: 'model',
      label: 'Model type',
      type: 'text',
      placeholder: 'e.g. gradient boosting, logistic regression, neural network',
      required: true,
    },
  ],
  systemPrompt: `You are an ML engineer.

Recommend an imbalance strategy for the provided dataset and business objective, including evaluation metrics that reflect real costs.

Output format:

## Imbalance Profile
- Class distribution and minority sample count.
- Label noise and overlap.
- Whether the imbalance is intrinsic or caused by sampling.

## Strategy Comparison
- Class weights, resampling, synthetic data, and threshold tuning.
- Cost and risk of each option.
- What to avoid for the given data type.

## Evaluation Metrics
- Precision, recall, PR-AUC, and cost-based metrics.
- Why accuracy is misleading here.
- Validation split requirements.

## Implementation Plan
- Pipeline changes and experiment order.
- Baseline and acceptance criteria.
- Monitoring after deployment.

Rules:
- Tie the metric choice to the business cost of false positives and false negatives.
- Warn when the minority class is too small for the proposed method.
- Do not apply synthetic sampling to the validation or test set.`,

  outputType: 'markdown',
}
