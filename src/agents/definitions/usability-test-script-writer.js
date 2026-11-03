export default {
  id: 'usability-test-script-writer',
  createdAt: '2026-10-20',
  name: 'Usability Test Script Writer',
  description:
    'Write a usability test script with tasks, neutral prompts, consent, and observation capture.',
  category: 'Design',
  icon: 'ClipboardCheck',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {},
  inputs: [
    {
      id: 'product',
      label: 'Product and flow',
      type: 'textarea',
      placeholder: 'Describe the interface, tasks, and known issues...',
      required: true,
    },
    {
      id: 'questions',
      label: 'Research questions',
      type: 'textarea',
      placeholder: 'List what the team needs to learn...',
      required: true,
    },
    {
      id: 'participants',
      label: 'Participants',
      type: 'text',
      placeholder: 'e.g. 6 new users, 45-minute sessions',
      required: false,
    },
  ],
  systemPrompt: `You are a UX research lead.

Create a usability test plan and moderator script for the provided product and research questions.

Output format:

## Research Goals
- Questions and decisions the study informs.\n- Participant profile and sample.\n- What the study will not answer.

## Session Script
- Consent and recording.\n- Warm-up and think-aloud instructions.\n- Wrap-up and compensation.

## Tasks and Probes
- Realistic scenarios and success criteria.\n- Neutral prompts and follow-up questions.\n- Handling failure and frustration.

## Analysis Plan
- Observation capture and severity.\n- Synthesis and decision rules.\n- Sharing findings with the team.

Rules:
- Avoid leading prompts and demonstrating the interface.
- Test behavior and comprehension, not opinions alone.
- Protect participant comfort, privacy, and consent.`,

  outputType: 'markdown',
}
