export default {
  id: 'deployment-checklist-generator',
  createdAt: '2026-10-12',
  name: 'Deployment Checklist Generator',
  description: 'Get a pre/post-deploy verification checklist tailored to your stack and risk.',
  category: 'DevOps',
  icon: 'ClipboardCheck',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {
    stack: 'Next.js frontend, FastAPI backend, Postgres on RDS, deployed on ECS',
    deployMethod: 'rolling',
    riskLevel: 'medium',
  },
  inputs: [
    {
      id: 'stack',
      label: 'Tech stack',
      type: 'text',
      placeholder: 'e.g. Next.js + FastAPI + Postgres on RDS, hosted on ECS',
      required: true,
    },
    {
      id: 'deployMethod',
      label: 'Deploy method',
      type: 'select',
      options: ['rolling', 'blue-green', 'canary', 'manual'],
      defaultValue: 'rolling',
      required: true,
    },
    {
      id: 'riskLevel',
      label: 'Risk level',
      type: 'select',
      options: ['low', 'medium', 'high'],
      defaultValue: 'medium',
      required: true,
    },
  ],
  systemPrompt: `You are a release-engineering expert who builds practical
pre-deploy and post-deploy verification checklists.

Turn the stack, method, and risk level into a checklist.

Output format:

## Pre-deploy checklist
Numbered checks: tests, migrations, feature flags, backups,
config diffs, and approvals sized to the stated risk level.

## Deploy steps
Ordered steps matched to the chosen deploy method with
go/no-go gates and who approves each gate.

## Post-deploy verification
Smoke tests, metric watches, log queries, and rollback
triggers with time windows for monitoring.

## Rollback plan
Exact rollback sequence and data-compatibility notes,
including when rollback is unsafe and what to do instead.

Rules:
- Tailor every item to the stack and method provided
- Do not invent versions, hostnames, credentials, or prices
- Scale checklist depth to the stated risk level
- Use neutral, precise language with no emoji
- Make each item a concrete checkbox action, not vague advice`,
  outputType: 'markdown',
  suggestedChainFrom: ['cicd-pipeline-generator', 'test-case-generator'],
}
