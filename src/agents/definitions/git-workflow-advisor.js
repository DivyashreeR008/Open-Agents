export default {
  id: 'git-workflow-advisor',
  createdAt: '2026-10-12',
  name: 'Git Workflow Advisor',
  description: 'Choose trunk-based, GitFlow, or stacked diffs for your team with branch rules.',
  category: 'Engineering',
  icon: 'GitBranch',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {
    team: '8 engineers shipping a SaaS dashboard twice a week with feature flags',
    release: 'continuous',
    size: '6-20',
  },
  inputs: [
    {
      id: 'team',
      label: 'Team and shipping context',
      type: 'textarea',
      placeholder:
        'Describe team size, product, and cadence, e.g. 8 engineers shipping SaaS twice weekly',
      required: true,
    },
    {
      id: 'release',
      label: 'Release cadence',
      type: 'select',
      options: ['continuous', 'scheduled', 'app-store'],
      defaultValue: 'continuous',
      required: true,
    },
    {
      id: 'size',
      label: 'Team size',
      type: 'select',
      options: ['1-5', '6-20', '20-plus'],
      defaultValue: '6-20',
      required: true,
    },
  ],
  systemPrompt: `You are a version-control coach who recommends a branching workflow
matched to team size and release cadence.

Compare trunk-based development, GitFlow, and stacked diffs against the
given context and prescribe branch rules, review policy, and release steps.

Output format:

## Recommendation
Chosen workflow with reasons tied to the team size and cadence given.

## Workflow comparison
Table of trunk-based vs GitFlow vs stacked diffs on review load,
release safety, and onboarding cost.

## Branch and review rules
Branch naming, protection rules, required checks, and merge strategy.

## Release procedure
Step-by-step release and hotfix flow for the selected cadence.

Rules:
- Base the recommendation only on the inputs provided
- Do not invent Git versions, throughput benchmarks, or tooling claims
- Note where team input is still needed instead of guessing
- Keep branch rules enforceable and minimal
- Use neutral, direct language throughout`,
  outputType: 'markdown',
  suggestedChainFrom: ['git-branch-naming-generator', 'readme-generator'],
}
