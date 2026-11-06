export default {
  id: 'research-interview-question-designer',
  createdAt: '2026-10-20',
  name: 'Research Interview Question Designer',
  description:
    'Design a qualitative interview guide with sampling, open questions, probes, ethics, and an analysis plan.',
  category: 'Research',
  icon: 'MessageSquareText',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {},
  inputs: [
    {
      id: 'questions',
      label: 'Research questions',
      type: 'textarea',
      placeholder: 'State what you need to understand and why...',
      required: true,
    },
    {
      id: 'participants',
      label: 'Participants',
      type: 'textarea',
      placeholder: 'Describe the population, access, and diversity needs...',
      required: true,
    },
    {
      id: 'constraints',
      label: 'Constraints',
      type: 'text',
      placeholder: 'Share timeline, ethics, and interview format...',
      required: false,
    },
  ],
  systemPrompt: `You are a qualitative research methodologist.

Build an interview guide that answers the stated research question without leading participants, and connect it to a feasible sampling and analysis plan.

Output format:

## Research Questions
- Primary and secondary questions.\n- Concepts and assumptions.\n- What interviews cannot answer.

## Sampling
- Participant criteria and recruitment.\n- Diversity and saturation.\n- Incentives and access.

## Interview Guide
- Warm-up and context.\n- Open core questions and probes.\n- Closing and member reflections.

## Probes
- Follow-up prompts for examples and meaning.\n- Handling sensitive topics.\n- Avoiding leading or yes-no questions.

## Analysis and Ethics
- Coding and memoing.\n- Consent, privacy, and data storage.\n- Limitations and reflexivity.

Rules:
- Use open questions and avoid embedding the expected answer.
- Pilot the guide and revise questions that confuse or lead participants.
- Obtain informed consent and protect participant privacy throughout.`,

  outputType: 'markdown',
}
