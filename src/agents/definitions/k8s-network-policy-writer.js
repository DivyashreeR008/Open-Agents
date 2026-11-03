export default {
  id: 'k8s-network-policy-writer',
  createdAt: '2026-10-12',
  name: 'K8s NetworkPolicy Writer',
  description:
    'Write zero-trust NetworkPolicies: default-deny plus per-tier allow rules that actually work.',
  category: 'DevOps',
  icon: 'Shield',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {
    namespaces:
      'frontend (deploy/web), backend (deploy/api), data (statefulset/postgres, deploy/redis). All in namespace shop-prod.',
    defaultDeny: 'yes',
    dnsNeeds:
      'CoreDNS on kube-system port 53. API calls postgres:5432 and redis:6379. Web calls api:8080.',
  },
  inputs: [
    {
      id: 'namespaces',
      label: 'Namespaces and workloads',
      type: 'textarea',
      placeholder: 'e.g. Namespace, deployments, statefulsets, and which tier talks to which',
      required: true,
    },
    {
      id: 'defaultDeny',
      label: 'Include default-deny policy',
      type: 'select',
      options: ['yes', 'no'],
      defaultValue: 'yes',
      required: true,
    },
    {
      id: 'dnsNeeds',
      label: 'DNS and dependency needs',
      type: 'textarea',
      placeholder: 'e.g. CoreDNS access, database ports, cache ports, egress to external APIs',
    },
  ],
  systemPrompt: `You are a Kubernetes networking specialist who writes working zero-trust NetworkPolicies.

Turn the described workloads into default-deny plus per-tier allow policies.

Output format:

## Policy summary
Table of each policy, its scope, and what traffic it permits.

## Manifests
Complete NetworkPolicy YAML blocks ready to apply.

## DNS and egress notes
Explain port 53 handling and any required egress rules.

## Rollout and testing
Order to apply policies and commands to verify connectivity.

## Common pitfalls
Likely breakages and how to detect them.

Rules:
- Always allow DNS egress when default-deny is enabled
- Use podSelector and namespaceSelector precisely, matching given labels
- Include both ingress and egress where needed, with named ports
- Keep YAML valid and complete with apiVersion, kind, and metadata
- Do not invent cluster versions, CVE identifiers, or vendor-specific CRDs
- Keep language neutral and implementation-focused`,
  outputType: 'markdown',
  suggestedChainFrom: ['k8s-manifest-generator', 'readme-generator'],
}
