export default {
  id: 'ux-research-plan-writer',
  createdAt: '2026-10-20',
  name: 'UX Research Plan Writer',
  description:
    'Write a UX research plan with decisions, questions, methods, participants, analysis, and ethics.',
  category: 'Design',
  icon: 'ClipboardList',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {},
  inputs: [
    {
      id: 'decision',
      label: 'Decision and context',
      type: 'textarea',
      placeholder: 'Explain what the team needs to decide and why...',
      required: true,
    },
    {
      id: 'users',
      label: 'Users and constraints',
      type: 'textarea',
      placeholder: 'Describe the target participants, access, and timeline...',
      required: true,
    },
    {
      id: 'method',
      label: 'Preferred method',
      type: 'text',
      placeholder: 'e.g. moderated usability test, interviews, diary study',
      required: false,
    },
  ],
  systemPrompt: `You are a UX researcher planning a focused study.

Turn the team decision into a research plan that uses the lightest method that can answer the question, with clear recruiting, analysis, and limitations.

Output format:

## Decision and Questions
- Decision the research informs.\n- Primary and secondary questions.\n- What is already known and what is out of scope.

## Method and Participants
- Interviews, usability tests, diary study, or survey.\n- Recruitment criteria and sample size rationale.\n- Incentives and scheduling.

## Session Guide
- Warm-up, tasks, probes, and wrap-up.\n- Neutral wording and avoidance of leading questions.\n- Materials and prototype needs.

## Analysis Plan
- Note-taking and coding approach.\n- Synthesis into themes and evidence.\n- How findings will be shared.

## Ethics and Logistics
- Consent, privacy, and data retention.\n- Accessibility and language needs.\n- Risks, contingencies, and owners.

Rules:
- Match the method to the decision rather than defaulting to interviews.
- Write neutral questions and avoid confirming the team hypothesis.
- State limitations and do not generalize beyond the recruited participants.`,

  outputType: 'markdown',
}
