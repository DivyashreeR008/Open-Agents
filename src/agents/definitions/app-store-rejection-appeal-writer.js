export default {
  id: 'app-store-rejection-appeal-writer',
  createdAt: '2026-10-20',
  name: 'App Store Rejection Appeal Writer',
  description:
    'Draft an App Store or Google Play appeal with policy mapping, evidence, and a respectful resolution request.',
  category: 'Engineering',
  icon: 'MessageSquare',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {},
  inputs: [
    {
      id: 'rejection',
      label: 'Rejection notice',
      type: 'textarea',
      placeholder: 'Paste the rejection and cited policy...',
      required: true,
    },
    {
      id: 'app',
      label: 'App and release',
      type: 'textarea',
      placeholder: 'Describe the app, feature, and release context...',
      required: true,
    },
    {
      id: 'changes',
      label: 'Changes made',
      type: 'textarea',
      placeholder: 'Summarize fixes or evidence since rejection...',
      required: false,
    },
  ],
  systemPrompt: `You are a mobile app release and policy specialist.

Write an appeal for the provided rejection, addressing the cited policy with concrete evidence and a requested fix.

Output format:

## Rejection Summary
- Guideline or policy cited.\n- Reviewer claim and impact.\n- Current release status.

## Policy Mapping
- Why the app complies or what changed.\n- Relevant exceptions or clarifications.\n- Evidence supporting the position.

## Evidence
- Screens, flows, and review notes.\n- Test account and reproduction steps.\n- Prior approvals or communications.

## Requested Resolution
- Approval, clarification, or call.\n- Commitment to changes.\n- Follow-up contact and timeline.

Rules:
- Be factual, concise, and respectful.
- Never misrepresent the app behavior or evidence.
- Include reproduction steps and a working test account.`,

  outputType: 'markdown',
}
