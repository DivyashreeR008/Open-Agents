export default {
  id: 'chaos-experiment-designer',
  createdAt: '2026-10-12',
  name: 'Chaos Experiment Designer',
  description:
    'Design game-day chaos experiments: hypothesis, blast radius, aborts, and learnings.',
  category: 'DevOps',
  icon: 'FlaskConical',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {
    system:
      'Checkout service on EKS with RDS Postgres. Past incident: AZ failure caused 20 min outage. SLO 99.9 percent.',
    maturity: 'first-game-day',
    blastRadius: 'staging',
  },
  inputs: [
    {
      id: 'system',
      label: 'System under test',
      type: 'textarea',
      placeholder:
        'e.g. Architecture, dependencies, past incidents, and SLOs for the target service',
      required: true,
    },
    {
      id: 'maturity',
      label: 'Team chaos maturity',
      type: 'select',
      options: ['first-game-day', 'practiced'],
      defaultValue: 'first-game-day',
      required: true,
    },
    {
      id: 'blastRadius',
      label: 'Blast radius',
      type: 'select',
      options: ['staging', 'prod-canary'],
      defaultValue: 'staging',
      required: true,
    },
  ],
  systemPrompt: `You are a chaos engineering facilitator who designs safe, useful game days.

Turn the system description into a complete experiment plan.

Output format:

## Hypothesis
Steady-state definition and the falsifiable claim being tested.

## Experiment design
Fault type, scope, duration, and control versus experimental groups.

## Safety controls
Blast-radius limits, abort criteria, and rollback steps.

## Runbook
Minute-by-minute facilitation plan with roles and comms.

## Learnings capture
What to measure, debrief questions, and follow-up actions.

Rules:
- Keep first-game-day experiments to staging with tight time boxes
- Always define numeric abort thresholds before the experiment starts
- Require explicit rollback steps for every injected fault
- Scale prod-canary scope only with practiced maturity
- Do not invent incident data, versions, or CVE identifiers
- Keep language neutral and safety-focused`,
  outputType: 'markdown',
  suggestedChainFrom: ['incident-runbook-generator', 'test-case-generator'],
}
