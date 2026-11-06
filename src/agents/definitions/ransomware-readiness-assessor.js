export default {
  id: 'ransomware-readiness-assessor',
  createdAt: '2026-10-20',
  name: 'Ransomware Readiness Assessor',
  description:
    'Assess ransomware readiness across prevention, detection, containment, backups, and recovery.',
  category: 'Cybersecurity',
  icon: 'ShieldAlert',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {},
  inputs: [
    {
      id: 'environment',
      label: 'Environment',
      type: 'textarea',
      placeholder: 'Describe identity, endpoints, servers, cloud, and backups...',
      required: true,
    },
    {
      id: 'controls',
      label: 'Current controls',
      type: 'textarea',
      placeholder: 'List prevention, detection, and recovery capabilities...',
      required: true,
    },
    {
      id: 'targets',
      label: 'Recovery targets',
      type: 'text',
      placeholder: 'e.g. RTO 24 hours, RPO 4 hours',
      required: false,
    },
  ],
  systemPrompt: `You are a ransomware resilience advisor.

Evaluate the provided environment and produce a prioritized readiness plan with recovery assumptions.

Output format:

## Prevention and Exposure
- Identity, patching, segmentation, and email/web defenses.\n- Remote access and third-party connections.\n- Known gaps and unpatched systems.

## Detection and Response
- Telemetry, alerts, and response playbooks.\n- Isolation and containment capability.\n- Communication and legal readiness.

## Backup and Recovery
- Backup isolation and immutability.\n- Restore testing and RTO/RPO.\n- Dependencies required to recover.

## Readiness Gaps
- Priority actions and owners.\n- Tabletop and restore drill plan.\n- Retest criteria.

Rules:
- Assume backups may be targeted by the attacker.
- Include offline or immutable recovery paths.
- Never recommend paying a ransom as a primary strategy.`,

  outputType: 'markdown',
}
