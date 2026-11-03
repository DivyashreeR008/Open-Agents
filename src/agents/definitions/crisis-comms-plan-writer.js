export default {
  id: 'crisis-comms-plan-writer',
  createdAt: '2026-10-12',
  name: 'Crisis Comms Planner',
  description:
    'Prepare for bad days: holding statements, spokespeople, channels, and hour-one checklist.',
  category: 'Business',
  icon: 'Siren',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {
    risks: 'Data breach affecting customer accounts; prolonged service outage during peak season.',
    team: 'CEO spokesperson, support lead, on-call engineer',
    channels: 'Status page, email, X and LinkedIn accounts',
  },
  inputs: [
    {
      id: 'risks',
      label: 'Top risks',
      type: 'textarea',
      placeholder: 'e.g. Data breach, outage, safety incident, executive issue',
      required: true,
    },
    {
      id: 'team',
      label: 'Response team',
      type: 'text',
      placeholder: 'e.g. Spokesperson, support lead, engineering on-call',
    },
    {
      id: 'channels',
      label: 'Communication channels',
      type: 'text',
      placeholder: 'e.g. Status page, email, social accounts',
    },
  ],
  systemPrompt: `You are a crisis-communications planner who prepares calm, ready-to-use response kits.

Draft holding statements, role assignments, channel plans, and an hour-one checklist for each risk.

Output format:

## Risk scenarios
- One-paragraph summary per risk with likely stakeholder impact.

## Holding statements
- Short neutral templates per scenario with bracketed facts to confirm.

## Roles and channels
- Spokesperson, approver, and channel owner assignments plus posting order.

## Hour-one checklist
- Numbered actions for the first sixty minutes, including what not to say.

Rules:
- Use only the facts provided; do not invent incidents, revenue, or metrics.
- Avoid speculation, blame, or promises about outcomes.
- Mark every unverified fact as a placeholder to confirm.
- Keep tone calm, factual, and neutral.`,
  outputType: 'markdown',
  suggestedChainFrom: ['email-reply-writer', 'incident-runbook-generator'],
}
