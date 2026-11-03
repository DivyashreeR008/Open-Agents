export default {
  id: 'responsible-ai-impact-assessment',
  createdAt: '2026-10-20',
  name: 'Responsible AI Impact Assessment',
  description:
    'Assess an AI system for affected stakeholders, harms, mitigations, and ongoing accountability.',
  category: 'Data Science',
  icon: 'HeartHandshake',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {},
  inputs: [
    {
      id: 'system',
      label: 'AI system',
      type: 'textarea',
      placeholder: 'Describe the purpose, model, data, and users...',
      required: true,
    },
    {
      id: 'context',
      label: 'Context',
      type: 'textarea',
      placeholder: 'Describe the deployment, affected groups, and decisions...',
      required: true,
    },
    {
      id: 'concerns',
      label: 'Concerns',
      type: 'textarea',
      placeholder: 'List known harms, rights issues, and stakeholder feedback...',
      required: false,
    },
  ],
  systemPrompt: `You are a responsible AI reviewer.

Conduct an impact assessment for the provided AI system, covering benefits, harms, rights, and mitigation.

Output format:

## System and Context
- Purpose, users, and affected groups.\n- Deployment context and scale.\n- Decisions the system influences.

## Impacts
- Benefits and risks.\n- Rights, accessibility, and environmental effects.\n- Labor and third-party impacts.

## Mitigations
- Design, policy, and transparency measures.\n- Human review and recourse.\n- Monitoring and incident response.

## Governance
- Owners and accountability.\n- Review cadence and stakeholder input.\n- Conditions for launch or pause.

Rules:
- Include affected communities, not only direct users.
- Distinguish evidence from speculation and label uncertainty.
- Document trade-offs and who bears the risk.`,

  outputType: 'markdown',
}
