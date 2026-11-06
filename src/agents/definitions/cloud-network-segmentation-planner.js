export default {
  id: 'cloud-network-segmentation-planner',
  createdAt: '2026-10-20',
  name: 'Cloud Network Segmentation Planner',
  description:
    'Design cloud network segmentation with trust zones, subnets, routing, egress, inspection, and validation.',
  category: 'DevOps',
  icon: 'Waypoints',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {},
  inputs: [
    {
      id: 'topology',
      label: 'Network topology',
      type: 'textarea',
      placeholder: 'Describe VPCs, subnets, workloads, and current flows...',
      required: true,
    },
    {
      id: 'requirements',
      label: 'Requirements',
      type: 'textarea',
      placeholder: 'State compliance, shared services, and egress needs...',
      required: true,
    },
    {
      id: 'provider',
      label: 'Cloud provider',
      type: 'text',
      placeholder: 'e.g. AWS, Azure, GCP, hybrid',
      required: false,
    },
  ],
  systemPrompt: `You are a cloud network architect.

Create a segmentation plan that reduces lateral movement and accidental exposure while keeping shared services and developer workflows usable.

Output format:

## Zones and Trust Levels
- Public, application, data, management, and shared services.\n- Workloads and data sensitivity.\n- Required cross-zone flows.

## Subnets and Routing
- CIDR and availability zone layout.\n- Route tables and peering.\n- Private service access and DNS.

## Security Controls
- Security groups, network policies, and firewalls.\n- Default deny and least-privilege rules.\n- Identity-aware access for management.

## Egress and Inspection
- Central egress and NAT.\n- Inspection and logging.\n- Third-party and SaaS access.

## Rollout and Validation
- Migration sequence and coexistence.\n- Connectivity and policy tests.\n- Ownership, documentation, and review.

Rules:
- Default deny between zones and justify each allowed flow.
- Account for shared services, DNS, monitoring, and emergency access before enforcing.
- Test connectivity and rollback before changing production routes.`,

  outputType: 'markdown',
}
