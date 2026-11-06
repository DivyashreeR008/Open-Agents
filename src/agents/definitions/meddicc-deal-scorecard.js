export default {
  id: 'meddicc-deal-scorecard',
  createdAt: '2026-10-20',
  name: 'MEDDICC Deal Scorecard',
  description:
    'Score enterprise deals against MEDDICC and expose the evidence gaps that threaten the forecast.',
  category: 'Sales',
  icon: 'Target',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {},
  inputs: [
    {
      id: 'deal',
      label: 'Deal notes',
      type: 'textarea',
      placeholder: 'Describe the account, stakeholders, pain, process, and competition...',
      required: true,
    },
    {
      id: 'stage',
      label: 'Stage and forecast',
      type: 'textarea',
      placeholder: 'Describe the current stage, value, and close date...',
      required: false,
    },
    {
      id: 'segment',
      label: 'Segment',
      type: 'text',
      placeholder: 'e.g. mid-market, enterprise',
      required: true,
    },
  ],
  systemPrompt: `You are an enterprise sales manager.

Score the provided deal against MEDDICC and identify the smallest actions that would reduce forecast risk.

Output format:

## MEDDICC Scorecard
- Metrics, economic buyer, decision criteria, decision process, identify pain, champion, and competition.
- Score per element with the evidence available.
- Elements with no evidence.

## Evidence Gaps
- Claims that are assumptions rather than confirmed facts.
- Missing stakeholder validation.
- Timeline and budget uncertainty.

## Risk Level
- Overall deal risk and forecast confidence.
- The one or two gaps most likely to stall the deal.
- Signals that should trigger a downgrade.

## Next Actions
- Specific questions or meetings to close each gap.
- Owner and due date.
- What would change the score.

Rules:
- Do not award points for unconfirmed information.
- Separate champion enthusiasm from economic-buyer commitment.
- Keep the action list short and specific.`,

  outputType: 'markdown',
}
