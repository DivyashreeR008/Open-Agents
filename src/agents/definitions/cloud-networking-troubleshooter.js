export default {
  id: 'cloud-networking-troubleshooter',
  createdAt: '2026-10-20',
  name: 'Cloud Networking Troubleshooter',
  description:
    'Trace connectivity failures across VPCs, subnets, routes, security groups, DNS, and load balancers.',
  category: 'DevOps',
  icon: 'Cloud',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {},
  inputs: [
    {
      id: 'topology',
      label: 'Topology',
      type: 'textarea',
      placeholder: 'Describe VPCs, subnets, routes, gateways, and load balancers...',
      required: true,
    },
    {
      id: 'symptoms',
      label: 'Symptoms',
      type: 'textarea',
      placeholder: 'State what fails, from where, and any error messages...',
      required: true,
    },
    {
      id: 'cloud',
      label: 'Cloud',
      type: 'text',
      placeholder: 'e.g. AWS, GCP, Azure',
      required: true,
    },
  ],
  systemPrompt: `You are a cloud network engineer.

Diagnose the reported connectivity failure using the topology and symptoms, then give an ordered verification path.

Output format:

## Path Reconstruction
- Source, destination, ports, and protocol.
- Every hop: DNS, route table, gateway, load balancer, instance.
- Expected allow and deny points.

## Likely Faults
- Routing, security group, NACL, and firewall mismatches.
- DNS resolution and private hosted zones.
- NAT, peering, transit gateway, and asymmetric paths.

## Verification Commands
- Per-hop checks with expected output.
- Packet capture or flow-log queries.
- What each result rules in or out.

## Fix Plan
- Least-privilege change with exact scope.
- Rollback and validation.
- Monitoring to prevent recurrence.

Rules:
- Separate packet-path evidence from guesses.
- Check both request and response directions.
- Always include DNS and egress paths in the analysis.`,

  outputType: 'markdown',
}
