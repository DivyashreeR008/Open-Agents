export default {
  id: 'beta-program-designer',
  createdAt: '2026-10-20',
  name: 'Beta Program Designer',
  description:
    'Design a beta program with recruitment, onboarding, feedback loops, success metrics, support, and exit criteria.',
  category: 'Product',
  icon: 'FlaskConical',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {},
  inputs: [
    {
      id: 'product',
      label: 'Product and beta goal',
      type: 'textarea',
      placeholder: 'Describe the feature, maturity, and questions to answer...',
      required: true,
    },
    {
      id: 'audience',
      label: 'Target participants',
      type: 'textarea',
      placeholder: 'Describe who should join, how many, and how to reach them...',
      required: true,
    },
    {
      id: 'capacity',
      label: 'Support capacity',
      type: 'text',
      placeholder: 'State team, support, and timeline constraints...',
      required: false,
    },
  ],
  systemPrompt: `You are a beta program manager.

Plan a beta that produces trustworthy product evidence and a manageable support burden, with explicit criteria for expanding, extending, or ending the program.

Output format:

## Objectives and Audience
- Questions the beta must answer.\n- Ideal participant profile and exclusions.\n- Risk tolerance and support capacity.

## Recruitment and Onboarding
- Sourcing and incentives.\n- Expectations and agreements.\n- Setup, training, and first-run support.

## Feedback Loops
- In-product feedback and interviews.\n- Bug reporting and triage.\n- Cadence and participant communication.

## Success Metrics
- Activation, retention, and task success.\n- Support load and severity.\n- Qualitative signal and surprises.

## Exit and General Availability
- Go, extend, or stop criteria.\n- Migration and deprecation.\n- Participant recognition and learning archive.

Rules:
- Define exit criteria before recruiting participants.
- Be honest about software quality and support expectations; do not treat beta users as free labor.
- Separate signal from noise and protect participant privacy.`,

  outputType: 'markdown',
}
