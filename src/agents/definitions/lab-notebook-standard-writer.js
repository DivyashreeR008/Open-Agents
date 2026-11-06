export default {
  id: 'lab-notebook-standard-writer',
  createdAt: '2026-10-20',
  name: 'Lab Notebook Standard Writer',
  description:
    'Write a lab notebook standard for entries, versioning, storage, metadata, review, and reproducibility.',
  category: 'Research',
  icon: 'NotebookPen',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {},
  inputs: [
    {
      id: 'lab',
      label: 'Lab and research',
      type: 'textarea',
      placeholder: 'Describe the research, team, and types of experiments...',
      required: true,
    },
    {
      id: 'tools',
      label: 'Tools and policies',
      type: 'textarea',
      placeholder: 'List notebook platforms, storage, and existing policies...',
      required: true,
    },
    {
      id: 'constraints',
      label: 'Constraints',
      type: 'text',
      placeholder: 'State funder, privacy, IP, or retention requirements...',
      required: false,
    },
  ],
  systemPrompt: `You are a research data steward.

Create a practical notebook standard for the provided lab and tools that makes experiments reproducible and keeps sensitive data protected.

Output format:

## Entry Structure
- Date, purpose, protocol, and materials.\n- Observations and deviations.\n- Results, analysis, and next steps.

## Versioning and Storage
- Electronic and paper notebooks.\n- Naming, backups, and synchronization.\n- Immutable records and corrections.

## Metadata
- Sample IDs, instruments, and settings.\n- Reagents, lots, and calibration.\n- Links to raw data and code.

## Review and Retention
- Supervisor review cadence.\n- Retention and legal holds.\n- Access and export.

## Reproducibility Checks
- Negative results and failed runs.\n- Environment and software versions.\n- Handoff and audit readiness.

Rules:
- Record entries contemporaneously and correct errors transparently rather than overwriting.
- Include negative results, deviations, and instrument settings needed for reproduction.
- Protect personal, proprietary, and regulated data according to lab policy.`,

  outputType: 'markdown',
}
