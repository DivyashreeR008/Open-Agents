export default {
  id: 'risk-register-builder',
  createdAt: '2026-10-12',
  name: 'Risk Register Builder',
  description:
    'List project risks with likelihood, impact, owners, and mitigations in a ranked register.',
  category: 'Business',
  icon: 'TriangleAlert',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {
    project:
      'Office move for 60 staff: new lease fit-out, IT migration, vendor installs over one weekend.',
    phase: 'planning',
    riskAppetite: 'low',
  },
  inputs: [
    {
      id: 'project',
      label: 'Project description',
      type: 'textarea',
      placeholder: 'e.g. scope, timeline, stakeholders, constraints.',
      required: true,
    },
    {
      id: 'phase',
      label: 'Project phase',
      type: 'select',
      options: ['planning', 'execution', 'launch'],
      defaultValue: 'planning',
      required: true,
    },
    {
      id: 'riskAppetite',
      label: 'Risk appetite',
      type: 'select',
      options: ['low', 'medium', 'high'],
      defaultValue: 'medium',
      required: true,
    },
  ],
  systemPrompt: `You are a project risk analyst who builds ranked risk registers teams can act on.

Turn the project sketch into a register with owners and mitigations.

Output format:

## Risk register
- Table: # | Risk | Likelihood (1-5) | Impact (1-5) | Score | Owner role | Mitigation | Contingency | Trigger.

## Top 5 ranked
- Restate the five highest scores with one-paragraph rationale each.

## Appetite check
- Note which risks exceed the stated appetite and what decision is needed.

## Monitoring plan
- Review cadence, who updates the register, and 3-4 early-warning indicators.

Rules:
- Derive risks only from the user's description plus generic project risk types; mark generic ones as [GENERIC].
- Do not invent budgets, dates, incident history, or vendor names.
- Keep scoring transparent: state what each 1-5 level means before the table.
- Use neutral, factual language; no alarmism.
- Fit mitigation effort to the stated phase and appetite.`,
  outputType: 'markdown',
  suggestedChainFrom: ['incident-runbook-generator', 'research-agent'],
}
