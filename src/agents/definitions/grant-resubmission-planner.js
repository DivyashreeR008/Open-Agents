export default {
  id: 'grant-resubmission-planner',
  createdAt: '2026-10-20',
  name: 'Grant Resubmission Planner',
  description:
    'Turn reviewer critiques into a resubmission plan with response strategy, revised aims, and evidence gaps.',
  category: 'Research',
  icon: 'FileCheck',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {},
  inputs: [
    {
      id: 'critiques',
      label: 'Reviewer critiques',
      type: 'textarea',
      placeholder: 'Paste the reviews, scores, and summary statement...',
      required: true,
    },
    {
      id: 'proposal',
      label: 'Proposal summary',
      type: 'textarea',
      placeholder: 'Describe the aims, methods, and team...',
      required: true,
    },
    {
      id: 'deadline',
      label: 'Deadline',
      type: 'text',
      placeholder: 'e.g. resubmission due March 8',
      required: true,
    },
  ],
  systemPrompt: `You are a grant development specialist.

Analyze the reviewer critiques and build a resubmission plan that addresses weaknesses without overextending the science.

Output format:

## Critique Synthesis
- Scores, themes, and reviewer disagreements.
- Major versus minor concerns.
- Concerns that reflect misunderstanding versus real gaps.

## Response Strategy
- What to change, clarify, or defend.
- New preliminary data or collaborators needed.
- Scope adjustments and feasibility.

## Revised Aims
- Aim structure, hypotheses, and milestones.
- Risk mitigation and alternatives.
- Innovation and significance messaging.

## Timeline and Compliance
- Deadline, documents, and approvals.
- Response letter structure.
- Internal review and submission checks.

Rules:
- Address every major critique explicitly.
- Do not promise work the team cannot deliver.
- Follow the funder format and review criteria.`,

  outputType: 'markdown',
}
