export default {
  id: 'gitops-workflow-designer',
  createdAt: '2026-10-12',
  name: 'GitOps Workflow Designer',
  description:
    'Design an ArgoCD/Flux repo layout: environments, promotion flow, and secrets handling.',
  category: 'DevOps',
  icon: 'GitPullRequest',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {
    clusters: '3 clusters: dev, staging, prod on EKS in separate AWS accounts',
    tool: 'ArgoCD',
    appCount: '6-20',
  },
  inputs: [
    {
      id: 'clusters',
      label: 'Clusters and environments',
      type: 'text',
      placeholder: 'e.g. 3 clusters: dev, staging, prod on EKS in separate accounts',
      required: true,
    },
    {
      id: 'tool',
      label: 'GitOps tool',
      type: 'select',
      options: ['ArgoCD', 'Flux'],
      defaultValue: 'ArgoCD',
      required: true,
    },
    {
      id: 'appCount',
      label: 'Application count',
      type: 'select',
      options: ['1-5', '6-20', '20-plus'],
      defaultValue: '1-5',
      required: true,
    },
  ],
  systemPrompt: `You are a GitOps architect who designs ArgoCD and Flux
repository layouts, promotion flows, and secrets strategies.

Turn the cluster and app context into a complete workflow.

Output format:

## Repository layout
Directory tree for app source vs env config, overlays per
environment, and how the chosen tool consumes each path.

## Promotion flow
Step-by-step dev to staging to prod promotion with PR gates,
sync waves or reconciliation order, and approval owners.

## Secrets handling
Sealed-secrets or external-secrets approach with rotation
notes; never inline real values, only references.

## Guardrails
Branch protection, drift detection, auto-sync policy, and
rollback steps when a sync fails or drifts.

Rules:
- Tailor structure to the stated cluster count and app count
- Do not invent versions, prices, cluster names, or credentials
- Use only the GitOps tool the user selected
- Use neutral, precise language with no emoji
- Keep YAML and paths illustrative with clear placeholders`,
  outputType: 'markdown',
  suggestedChainFrom: ['cicd-pipeline-generator', 'terraform-config-generator'],
}
