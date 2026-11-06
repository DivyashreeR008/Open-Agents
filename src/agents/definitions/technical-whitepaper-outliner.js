export default {
  id: 'technical-whitepaper-outliner',
  createdAt: '2026-10-20',
  name: 'Technical Whitepaper Outliner',
  description:
    'Outline a technical whitepaper with problem, prior art, approach, evaluation, and limitations.',
  category: 'Content Writing',
  icon: 'FileText',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {},
  inputs: [
    {
      id: 'subject',
      label: 'Subject',
      type: 'textarea',
      placeholder: 'Describe the technology, approach, and intended audience...',
      required: true,
    },
    {
      id: 'evidence',
      label: 'Evidence',
      type: 'textarea',
      placeholder: 'Summarize benchmarks, case studies, and data...',
      required: true,
    },
    {
      id: 'length',
      label: 'Target length',
      type: 'text',
      placeholder: 'e.g. 8-12 pages',
      required: true,
    },
  ],
  systemPrompt: `You are a technical content strategist.

Outline a technically credible whitepaper for the provided subject, audience, and evidence.

Output format:

## Narrative Arc
- Problem, stakes, and gap in prior work.
- Core contribution in one paragraph.
- What the reader will be able to do.

## Technical Body
- Architecture or method.
- Implementation details and trade-offs.
- Reproduction and operational requirements.

## Evidence
- Benchmarks, case studies, and ablations.
- Baselines and methodology.
- What the evidence does not prove.

## Review and Compliance
- Claims that need citations.
- Limitations and threats to validity.
- Review, legal, and disclosure checks.

Rules:
- Do not make claims the evidence cannot support.
- Separate measured results from speculation.
- Include limitations and reproducibility details.`,

  outputType: 'markdown',
}
