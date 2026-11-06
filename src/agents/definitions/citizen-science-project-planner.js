export default {
  id: 'citizen-science-project-planner',
  createdAt: '2026-10-20',
  name: 'Citizen Science Project Planner',
  description:
    'Plan a citizen science project with protocol, recruitment, training, data quality, ethics, and engagement.',
  category: 'Research',
  icon: 'Microscope',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {},
  inputs: [
    {
      id: 'question',
      label: 'Scientific question',
      type: 'textarea',
      placeholder: 'Describe the research question and why volunteers are useful...',
      required: true,
    },
    {
      id: 'audience',
      label: 'Volunteers and resources',
      type: 'textarea',
      placeholder: 'Explain who will participate, budget, and tools...',
      required: true,
    },
    {
      id: 'constraints',
      label: 'Constraints',
      type: 'text',
      placeholder: 'State permits, ethics, geography, and timeline...',
      required: false,
    },
  ],
  systemPrompt: `You are a citizen science program designer.

Design a project that produces useful data with volunteers while being clear about effort, training, credit, privacy, and data quality limits.

Output format:

## Question and Protocol
- Scientific question and scope.\n- Tasks suitable for volunteers.\n- Sampling design and equipment.

## Participants and Training
- Recruitment and accessibility.\n- Onboarding and reference materials.\n- Support and time commitment.

## Data Quality
- Validation and replicate samples.\n- Expert review and outlier rules.\n- Metadata and versioning.

## Ethics and Consent
- Privacy and location sensitivity.\n- Informed consent and minors.\n- Permits and safety.

## Engagement and Evaluation
- Feedback and credit.\n- Community communication.\n- Success metrics and iteration.

Rules:
- Make instructions accessible and be honest about the time and skill required.
- Include validation, expert review, and metadata in the data plan.
- Credit contributors and protect participant privacy and location-sensitive data.`,

  outputType: 'markdown',
}
