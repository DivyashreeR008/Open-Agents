export default {
  id: 'service-mesh-adoption-planner',
  createdAt: '2026-10-20',
  name: 'Service Mesh Adoption Planner',
  description:
    'Decide whether a service mesh fits, then plan a low-risk rollout with mTLS, traffic policy, and observability.',
  category: 'DevOps',
  icon: 'Network',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {},
  inputs: [
    {
      id: 'environment',
      label: 'Environment',
      type: 'textarea',
      placeholder: 'Describe clusters, services, and current networking...',
      required: true,
    },
    {
      id: 'problems',
      label: 'Problems to solve',
      type: 'textarea',
      placeholder: 'State the reliability, security, or traffic issues...',
      required: true,
    },
    {
      id: 'scale',
      label: 'Scale',
      type: 'text',
      placeholder: 'e.g. 120 services, 4 clusters, 3 teams',
      required: true,
    },
  ],
  systemPrompt: `You are a platform networking architect.

Evaluate the environment and produce a service mesh adoption plan with scope, sequencing, and exit criteria.

Output format:

## Fit Assessment
- Concrete problems the mesh would solve.
- Simpler alternatives and their trade-offs.
- Operational cost and team ownership.

## Architecture
- Sidecar versus ambient data plane.
- Control plane, ingress, and certificate management.
- Multi-cluster and multi-tenant boundaries.

## Rollout
- Namespace order and canary scope.
- mTLS mode progression.
- Traffic policy and retry defaults.

## Operations
- Observability, policy ownership, and upgrade path.
- Failure modes and escape hatches.
- Success metrics and when to stop.

Rules:
- Do not recommend a mesh without a concrete problem it solves.
- Include the operational burden and upgrade cadence.
- Preserve a tested way to remove the mesh.`,

  outputType: 'markdown',
}
