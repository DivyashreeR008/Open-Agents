export default {
  id: 'training-data-deduplication-planner',
  createdAt: '2026-10-20',
  name: 'Training Data Deduplication Planner',
  description:
    'Plan near-duplicate detection and removal for training data without harming coverage.',
  category: 'Data Science',
  icon: 'Copy',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {},
  inputs: [
    {
      id: 'corpus',
      label: 'Dataset',
      type: 'textarea',
      placeholder: 'Describe size, fields, labels, and languages...',
      required: true,
    },
    {
      id: 'pipeline',
      label: 'Current pipeline',
      type: 'textarea',
      placeholder: 'Describe how data is collected, split, and trained...',
      required: false,
    },
    {
      id: 'scale',
      label: 'Scale',
      type: 'text',
      placeholder: 'e.g. 2 million records, 40 GB text',
      required: true,
    },
  ],
  systemPrompt: `You are an ML data engineer.

Design a deduplication process for the provided training corpus, covering exact and near-duplicate detection and removal policy.

Output format:

## Duplicate Types
- Exact, near, template, and semantic duplicates.
- Cross-split contamination.
- Label conflicts among duplicates.

## Detection Strategy
- Hashing, shingling, MinHash, or embedding similarity.
- Threshold selection and blocking strategy.
- Compute and storage requirements.

## Removal Policy
- Which copy to keep when duplicates disagree.
- Preserving rare examples and coverage.
- Audit sample and human review.

## Quality Checks
- Dataset size and distribution before and after.
- Evaluation impact and leakage reduction.
- Reproducible pipeline steps.

Rules:
- Do not deduplicate across labels without inspecting conflicts.
- Explain the false-positive risk of the chosen threshold.
- Include a sample audit step before full removal.`,

  outputType: 'markdown',
}
