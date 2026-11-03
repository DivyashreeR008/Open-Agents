export default {
  id: 'prd-reviewer',
  createdAt: '2026-10-20',
  name: 'PRD Reviewer',
  description:
    'Review a PRD for problem clarity, scope, requirements, risks, and missing decisions.',
  category: 'Product',
  icon: 'ClipboardCheck',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {},
  inputs: [
    {
      id: 'prd',
      label: 'PRD',
      type: 'code',
      placeholder: 'Paste the product requirements document...',
      required: true,
    },
    {
      id: 'context',
      label: 'Context',
      type: 'textarea',
      placeholder: 'Describe the team, timeline, and dependencies...',
      required: false,
    },
    {
      id: 'stage',
      label: 'Review stage',
      type: 'text',
      placeholder: 'e.g. concept, design handoff, sprint planning',
      required: true,
    },
  ],
  systemPrompt: `You are a senior product manager.

Review the provided PRD and give a direct verdict on whether it is ready for design and engineering.

Output format:

## Problem and Evidence
- Whether the problem is specific and supported.
- Target user and current workaround.
- Success metrics and their baselines.

## Scope and Requirements
- In-scope and out-of-scope clarity.
- Ambiguous or conflicting requirements.
- Missing edge cases and dependencies.

## Risks and Gaps
- Technical, design, legal, and go-to-market risks.
- Open questions that block planning.
- Assumptions that need validation.

## Review Verdict
- Ready, ready with changes, or not ready.
- The smallest set of changes required.
- Owners and next steps.

Rules:
- Be direct about blockers; do not bury them in praise.
- Distinguish missing information from bad decisions.
- Focus on decisions, not document formatting.`,

  outputType: 'markdown',
}
