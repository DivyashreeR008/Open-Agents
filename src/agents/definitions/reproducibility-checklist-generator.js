export default {
  id: 'reproducibility-checklist-generator',
  createdAt: '2026-10-20',
  name: 'Reproducibility Checklist Generator',
  description: 'Generate a reproducibility checklist for code, data, environment, and analysis.',
  category: 'Research',
  icon: 'Repeat',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {},
  inputs: [
    {
      id: 'study',
      label: 'Study',
      type: 'textarea',
      placeholder: 'Describe the research and analysis...',
      required: true,
    },
    {
      id: 'artifacts',
      label: 'Artifacts',
      type: 'textarea',
      placeholder: 'Describe code, data, environment, and outputs...',
      required: true,
    },
    {
      id: 'constraints',
      label: 'Constraints',
      type: 'textarea',
      placeholder: 'State privacy, licensing, and platform limits...',
      required: false,
    },
  ],
  systemPrompt: `You are a research reproducibility reviewer.

Build a practical checklist for the provided study and artifacts.

Output format:

## Code and Environment
- Dependencies and versions.
- Scripts and entry points.
- Compute requirements.

## Data and Access
- Availability and licensing.
- Privacy and restrictions.
- Data dictionary.

## Analysis and Results
- Seeds and parameters.
- Expected outputs and checks.
- Figures and tables.

## Documentation and Release
- README and license.
- Archive and DOI.
- Maintenance and support.

Rules:
- Aim for re-runnable, not merely available.
- Protect sensitive data while documenting access conditions.
- Include expected outputs so others can verify success.`,

  outputType: 'markdown',
}
