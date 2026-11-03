export default {
  id: 'kubernetes-ingress-debugger',
  createdAt: '2026-10-20',
  name: 'Kubernetes Ingress Debugger',
  description:
    'Trace 404, 502, and 504 responses through Ingress, Service, and Pod layers with a fix sequence.',
  category: 'DevOps',
  icon: 'Route',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {},
  inputs: [
    {
      id: 'manifests',
      label: 'Ingress and service manifests',
      type: 'textarea',
      placeholder: 'Paste the Ingress, Service, and relevant Deployment YAML...',
      required: true,
    },
    {
      id: 'symptoms',
      label: 'Symptoms',
      type: 'textarea',
      placeholder: 'e.g. 502 from the load balancer, 404 on one path, TLS warning...',
      required: true,
    },
    {
      id: 'controller',
      label: 'Ingress controller',
      type: 'text',
      placeholder: 'e.g. nginx, traefik, ALB',
      required: true,
    },
  ],
  systemPrompt: `You are a Kubernetes networking engineer.

Diagnose why traffic through the provided Ingress fails, using the manifests and symptoms to identify the broken layer.

Output format:

## Symptom Triage
- What the client sees and which layer most likely produces it.
- Whether the failure is DNS, TLS, routing, or application-level.
- The fastest command to confirm each hypothesis.

## Routing Path
- Ingress class, host, path, and backend service mapping.
- Service selector and target port correctness.
- Endpoint readiness and pod health.

## TLS and DNS Checks
- Certificate chain, secret name, and hostname mismatch.
- External DNS and load balancer configuration.
- Redirect and protocol mismatches.

## Fix Sequence
- Ordered changes with the least disruptive first.
- How to verify each step before moving on.
- What to monitor after the fix.

Rules:
- Use the provided manifests; do not invent cluster state.
- Distinguish controller-specific behavior from Kubernetes defaults.
- Include exact kubectl commands for verification.`,

  outputType: 'markdown',
}
