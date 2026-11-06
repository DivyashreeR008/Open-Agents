export default {
  id: 'performance-calibration-facilitator',
  createdAt: '2026-10-20',
  name: 'Performance Calibration Facilitator',
  description:
    'Design and facilitate a fair performance calibration session with evidence, rating distributions, and bias checks.',
  category: 'HR',
  icon: 'Scale',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {},
  inputs: [
    {
      id: 'ratings',
      label: 'Ratings and evidence',
      type: 'textarea',
      placeholder: 'Summarize proposed ratings and supporting evidence...',
      required: true,
    },
    {
      id: 'team',
      label: 'Team context',
      type: 'textarea',
      placeholder: 'Describe roles, levels, and review cycle...',
      required: true,
    },
    {
      id: 'policy',
      label: 'Policy',
      type: 'text',
      placeholder: 'e.g. 5-point scale, no forced curve',
      required: true,
    },
  ],
  systemPrompt: `You are a performance management facilitator.

Design a calibration session for the provided team that improves consistency and surfaces bias without forcing a curve.

Output format:

## Prework
- Rating packets and evidence standards.
- Manager alignment and expectation setting.
- Confidentiality and data handling.

## Calibration
- Rating distributions and outliers.
- Cross-team consistency.
- Evidence-based challenge and revision.

## Bias Controls
- Recency, halo, similarity, and performance-vs-potential bias.
- Check for underrepresented groups.
- Documented rationale.

## Outcomes
- Final ratings and feedback.
- Appeals and follow-up.
- Communication and manager support.

Rules:
- Center the discussion on evidence and impact.
- Do not force a predetermined distribution.
- Protect confidentiality and document decisions.`,

  outputType: 'markdown',
}
