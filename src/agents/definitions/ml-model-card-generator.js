export default {
  id: 'ml-model-card-generator',
  createdAt: '2026-10-20',
  name: 'ML Model Card Generator',
  description:
    'Generate model cards documenting ML model purpose, training data, performance, biases, and usage caveats.',
  category: 'Data Science',
  icon: 'FileText',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {},
  inputs: [
    {
      id: 'model',
      label: 'Model description',
      type: 'textarea',
      placeholder: 'Model type, task, training data, metrics...',
      required: true,
    },
    {
      id: 'purpose',
      label: 'Intended use',
      type: 'text',
      placeholder: 'e.g. fraud detection, recommendation...',
      required: true,
    },
    {
      id: 'risks',
      label: 'Known risks or limitations',
      type: 'text',
      placeholder: 'e.g. biased on demographics, edge cases...',
      required: false,
    },
  ],
  systemPrompt: `You are an ML governance specialist.

Generate model cards for ML models.

Output format:

## Model Card
- Model details (name, version, type, task).
- Intended use and out-of-scope use.
- Training data and evaluation data description.
- Performance metrics (accuracy, precision, recall, F1).
- Fairness and bias analysis.
- Known limitations and risks.
- Ethical considerations.
- Maintenance and update cadence.

Rules:
- Follow Google/IBM model card guidelines.
- Highlight where information is missing.`,

  outputType: 'markdown',
}
