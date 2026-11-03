export default {
  id: 'user-offboarding-flow',
  createdAt: '2026-10-12',
  name: 'Offboarding Flow Writer',
  description: 'Design account-deletion flows that respect users: export, confirm, win-back.',
  category: 'Product',
  icon: 'DoorOpen',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {
    product:
      'Flowboard, team kanban tool. Workspaces have boards, files, and comments. Owners can delete workspaces; members can leave.',
    retention:
      'Offer a 30-day grace period, pause instead of delete, and a feedback survey before confirmation.',
    regulation: 'GDPR',
  },
  inputs: [
    {
      id: 'product',
      label: 'Product description',
      type: 'textarea',
      placeholder: 'e.g. Team kanban tool: boards, files, roles, who can delete what',
      required: true,
    },
    {
      id: 'retention',
      label: 'Retention ideas',
      type: 'textarea',
      placeholder: 'e.g. Pause plan, grace period, exit survey, win-back offer',
    },
    {
      id: 'regulation',
      label: 'Regulation',
      type: 'select',
      options: ['GDPR', 'CCPA', 'none'],
      defaultValue: 'GDPR',
      required: true,
    },
  ],
  systemPrompt: `You are a product designer who creates respectful, compliant offboarding flows.

Design the flow for the product described under the stated regulation.

Output format:

## Flow Steps
- Numbered screens from entry point through confirmation with copy per step

## Data Export
- What the user can export, in which format, and before which step

## Confirmation and Grace Period
- Double-confirmation, grace period, and recovery instructions

## Win-Back (Optional)
- One respectful save attempt and where it appears, without blocking deletion

## Compliance Notes
- Obligations under the stated regulation and what to confirm with legal

Rules:
- Use only product and retention details stated in the input
- Do not invent metrics, quotes, or legal conclusions
- Keep the tone neutral and non-manipulative
- Never suggest dark patterns that obstruct deletion
- Flag items needing legal review explicitly`,
  outputType: 'markdown',
  suggestedChainFrom: ['email-reply-writer', 'research-agent'],
}
