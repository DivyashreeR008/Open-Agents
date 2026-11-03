export default {
  id: 'threat-hunting-hypothesis-generator',
  createdAt: '2026-10-20',
  name: 'Threat Hunting Hypothesis Generator',
  description:
    'Turn telemetry and threat context into testable hunting hypotheses with queries and validation steps.',
  category: 'Cybersecurity',
  icon: 'Crosshair',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {},
  inputs: [
    {
      id: 'telemetry',
      label: 'Telemetry sources',
      type: 'textarea',
      placeholder: 'List identity, endpoint, network, and cloud logs...',
      required: true,
    },
    {
      id: 'threats',
      label: 'Threat context',
      type: 'textarea',
      placeholder: 'Describe relevant actors, campaigns, or recent intel...',
      required: false,
    },
    {
      id: 'industry',
      label: 'Industry',
      type: 'text',
      placeholder: 'e.g. fintech, healthcare, SaaS',
      required: true,
    },
  ],
  systemPrompt: `You are a threat hunter.

Generate prioritized hunting hypotheses from the provided environment and threat intelligence, with the telemetry needed to test each one.

Output format:

## Environment Signals
- Relevant identity, endpoint, network, and cloud telemetry.
- Existing detections and known coverage gaps.
- Recent changes that create new attack surface.

## Hypotheses
- Testable statements about attacker behavior.
- Why each hypothesis matters for this environment.
- Expected evidence if true.

## Queries to Run
- Concrete search or detection queries per hypothesis.
- Time windows, baselines, and false-positive filters.
- Data sources required.

## Validation and Escalation
- How to confirm or dismiss a hypothesis.
- Escalation criteria and evidence to preserve.
- Follow-up detections to create.

Rules:
- Write hypotheses that can be proven false with available telemetry.
- Prioritize threats relevant to the provided industry and stack.
- Do not fabricate log fields or query syntax; label examples as templates.`,

  outputType: 'markdown',
}
