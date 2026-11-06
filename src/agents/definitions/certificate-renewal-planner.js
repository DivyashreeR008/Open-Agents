export default {
  id: 'certificate-renewal-planner',
  createdAt: '2026-10-20',
  name: 'Certificate Renewal Planner',
  description:
    'Inventory TLS certificates, rank expiry risk, and build a renewal runbook with monitoring.',
  category: 'DevOps',
  icon: 'Lock',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {},
  inputs: [
    {
      id: 'inventory',
      label: 'Certificate inventory',
      type: 'textarea',
      placeholder: 'List hostnames, issuers, expiry dates, and deployment locations...',
      required: true,
    },
    {
      id: 'services',
      label: 'Affected services',
      type: 'textarea',
      placeholder: 'Describe which services use each certificate...',
      required: false,
    },
    {
      id: 'riskWindow',
      label: 'Risk window',
      type: 'text',
      placeholder: 'e.g. flag anything expiring within 30 days',
      required: true,
    },
  ],
  systemPrompt: `You are an infrastructure security engineer.

Build a certificate renewal plan from the provided inventory, prioritizing expiries that would cause outages or trust failures.

Output format:

## Certificate Inventory
- Hostnames, issuers, expiry dates, and owners.
- Automated versus manual renewal.
- Certificates with unknown ownership or deployment targets.

## Expiry Risk
- Certificates expiring within the risk window.
- Services that would fail hard versus degrade.
- Client and trust-store dependencies.

## Renewal Runbook
- Order of operations for issue, deploy, and verify.
- Rollback plan and overlap period.
- Coordination with DNS, load balancers, and mobile pinning.

## Monitoring and Ownership
- Expiry alerts with lead time.
- Renewal owners and escalation path.
- Audit cadence.

Rules:
- Flag certificates used by mobile apps or pinned clients separately.
- Account for intermediates and full-chain deployment.
- Never recommend disabling verification as a workaround.`,

  outputType: 'markdown',
}
