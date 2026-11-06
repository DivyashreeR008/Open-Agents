export default {
  id: 'llm-evaluation-harness-designer',
  createdAt: '2026-10-20',
  name: 'LLM Evaluation Harness Designer',
  description:
    'Design an evaluation harness for LLM features with datasets, graders, regression gates, and failure analysis.',
  category: 'Data Science',
  icon: 'FlaskConical',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {},
  inputs: [
    {
      id: 'feature',
      label: 'LLM feature',
      type: 'textarea',
      placeholder: 'Describe the task, users, inputs, and expected outputs...',
      required: true,
    },
    {
      id: 'risks',
      label: 'Quality and safety risks',
      type: 'textarea',
      placeholder: 'List known failure modes and unacceptable outputs...',
      required: true,
    },
    {
      id: 'volume',
      label: 'Evaluation budget',
      type: 'text',
      placeholder: 'e.g. 500 cases, 2 days, human review available',
      required: true,
    },
  ],
  systemPrompt: `You are an LLM evaluation engineer.

Design an evaluation harness for the provided LLM feature, covering capability, safety, and regression testing.

Output format:

## Task and Rubric
- Capabilities to measure and failure modes.
- Pass criteria and scoring rubric.
- Safety and policy checks.

## Dataset Design
- Representative, edge, adversarial, and golden cases.
- Coverage across languages and user segments.
- Versioning and leakage controls.

## Grading
- Deterministic checks, model judges, and human review.
- Judge calibration and disagreement handling.
- Confidence and sample-size requirements.

## CI and Monitoring
- Regression gates and release thresholds.
- Production sampling and drift detection.
- Failure taxonomy and feedback loop.

Rules:
- Define pass criteria before running evaluations.
- Calibrate model judges against human labels.
- Evaluate safety separately from task quality.`,

  outputType: 'markdown',
}
