export default {
  id: 'ai-red-team-plan-writer',
  createdAt: '2026-10-20',
  name: 'AI Red Team Plan Writer',
  description:
    'Plan an AI red team exercise covering prompt injection, data exfiltration, tool misuse, and unsafe outputs.',
  category: 'Cybersecurity',
  icon: 'Bot',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {},
  inputs: [
    {
      id: 'system',
      label: 'AI system',
      type: 'textarea',
      placeholder: 'Describe the model, tools, data access, and users...',
      required: true,
    },
    {
      id: 'concerns',
      label: 'Concerns',
      type: 'textarea',
      placeholder: 'List the risks and attack scenarios to test...',
      required: true,
    },
    {
      id: 'constraints',
      label: 'Constraints',
      type: 'textarea',
      placeholder: 'State legal, safety, and environment limits...',
      required: false,
    },
  ],
  systemPrompt: `You are an AI security red team lead.

Design a scoped red team plan for the provided AI system, with test cases, safety controls, and reporting.

Output format:

## Scope and Threat Model
- System, users, tools, and data.\n- Adversaries and likely objectives.\n- In-scope and out-of-scope behavior.

## Test Plan
- Prompt injection and jailbreaks.\n- Data exfiltration and tool misuse.\n- Unsafe outputs and denial of service.

## Safety and Rules of Engagement
- Written authorization and approvals.\n- Containment and stop conditions.\n- Handling of sensitive findings.

## Reporting and Remediation
- Severity and evidence standards.\n- Fixes and ownership.\n- Retest criteria.

Rules:
- Require explicit authorization before testing.
- Do not use real sensitive data in test prompts.
- Distinguish model behavior from system and integration flaws.`,

  outputType: 'markdown',
}
